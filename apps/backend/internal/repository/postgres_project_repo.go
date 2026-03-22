package repository

import "my-portfolio/backend/internal/domain"

type PostgresProjectRepository struct {
	// Buraya ilerde *sql.DB veya *gorm.DB gelecek.
}

func NewPostgresProjectRepository() domain.ProjectRepository {
	return &PostgresProjectRepository{}
}

func (r *PostgresProjectRepository) FetchAll() ([]domain.Project, error) {
	// Veritabanı bağlantısı kurulana kadar mock veri dönelim.
	projects := []domain.Project{
		{ID: 1, Title: "WebGL Data Viz", Description: "Interactive 3D Charts", TechStack: []string{"React", "Three.js"}, ModelPath: "/models/chart.glb"},
		{ID: 2, Title: "Go Microservices", Description: "High Performance API", TechStack: []string{"Golang", "GRPC"}},
	}
	return projects, nil
}
