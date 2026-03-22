package domain

// Project, portfolyoda sergilenecek 3D projelerin ana yapısıdır.
type Project struct {
	ID          int      `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	TechStack   []string `json:"tech_stack"`
	URL         string   `json:"url"`
	ModelPath   string   `json:"model_path"` // 3D modelin yolu (glTF/GLB)
}

// ProjectRepository, veri erişim katmanı için gerekli olan arayüzdür.
// Dependency Inversion (Bağımlılıkların Tersine Çevrilmesi) prensibi için kritiktir.
type ProjectRepository interface {
	FetchAll() ([]Project, error)
}
