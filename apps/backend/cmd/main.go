package main

import (
	"log"
	"os"

	"my-portfolio/backend/internal/controller"
	"my-portfolio/backend/internal/repository"
	"my-portfolio/backend/internal/usecase"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName: "Modern 3D Portfolio API (Clean Arch)",
	})

	// 1. Temel Middleware'ler
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("ALLOWED_ORIGINS"),
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// 2. SEO için Bot Tespiti Middleware'i (Sayfa 11)
	app.Use(controller.PrerenderMiddleware)

	// 3. Katmanların İlklendirilmesi (Dependency Injection)
	projectRepo := repository.NewPostgresProjectRepository()
	projectUsecase := usecase.NewProjectUsecase(projectRepo)
	projectController := controller.NewProjectController(projectUsecase)

	// 4. API Rotaları (Sayfa 12)
	api := app.Group("/api/v1")
	api.Get("/projects", projectController.GetProjects)

	// 5. Sunucuyu Başlat
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Backend sunucusu %s portunda başlıyor...", port)
	log.Fatal(app.Listen(":" + port))
}
