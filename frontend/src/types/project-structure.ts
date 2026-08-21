export type StructureItem = {
  name: string;
  description: string;
  children?: StructureItem[];
};

export type StructureSection = {
  title: string;
  subtitle: string;
  items: StructureItem[];
};

export type FolderGuide = {
  name: string;
  purpose: string;
  examples: string;
};
