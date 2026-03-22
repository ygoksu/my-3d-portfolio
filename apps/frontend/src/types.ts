export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  url: string;
  model_path?: string;
}