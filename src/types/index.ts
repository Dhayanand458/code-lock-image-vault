
export interface Template {
  id: number;
  texts: string[];
  selectedIndex: number;
  images: string[];
}

export interface ProjectData {
  images: string[];
  templates: Template[];
}
