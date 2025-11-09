// This gives your frontend full typing even though the data file is JS.
export interface Practice {
  title: string;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
}

export const practices: Practice[];
