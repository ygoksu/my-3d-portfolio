package usecase

import "my-portfolio/backend/internal/domain"

type ProjectUsecase struct {
	repo domain.ProjectRepository
}

func NewProjectUsecase(r domain.ProjectRepository) *ProjectUsecase {
	return &ProjectUsecase{repo: r}
}

func (u *ProjectUsecase) GetAllProjects() ([]domain.Project, error) {
	// Burada iş kuralları (loglama, cache kontrolü vb.) eklenebilir.
	return u.repo.FetchAll()
}
