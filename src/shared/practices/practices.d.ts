// This gives your frontend full typing even though the data file is JS.
export interface Practice {
  title: string;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  instructor?: {
    name?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
    };
  };
}

export const practices: Practice[];
