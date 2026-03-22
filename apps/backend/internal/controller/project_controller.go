package controller

import (
	"my-portfolio/backend/internal/domain"
	"my-portfolio/backend/internal/usecase"

	"github.com/gofiber/fiber/v2"
)
type ProjectUsecaseInterface interface {
    GetAllProjects() ([]domain.Project, error)
}
type ProjectController struct {
    usecase ProjectUsecaseInterface
}

func NewProjectController(u *usecase.ProjectUsecase) *ProjectController {
	return &ProjectController{usecase: u}
}

func (pc *ProjectController) GetProjects(c *fiber.Ctx) error {
	projects, err := pc.usecase.GetAllProjects()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{
		"status": "success",
		"data":   projects,
	})
}
