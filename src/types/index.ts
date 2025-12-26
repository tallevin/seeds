export interface DocumentTab {
  id: string;
  title: string;
  type: 'md' | 'pdf' | 'txt' | 'other';
  content: string;
  isActive: boolean;
}

export interface ContextFile {
  id: string;
  filename: string;
  filetype: string;
  metadata: string;
}

export interface LibraryFolder {
  id: string;
  name: string;
  files: LibraryFile[];
  isExpanded: boolean;
}

export interface LibraryFile {
  id: string;
  filename: string;
  filetype: string;
}

export interface Page {
  id: string;
  name: string;
  documents: PageDocument[];
  isExpanded: boolean;
}

export interface PageDocument {
  id: string;
  name: string;
}

export interface Seed {
  id: string;
  type: 'similar' | 'related' | 'challenge' | 'extend';
  filename: string;
  filetype: string;
  preview: string;
}

export interface Framework {
  id: string;
  name: string;
  subtitle: string;
  description: string;
}

export interface Style {
  id: string;
  authorName: string;
  preview: string;
}

export interface RoleDefinition {
  thesis: string;
  operatingModel: string;
  deliverables: string;
  methodStack: string;
  influences: string;
}

export type RightSidebarTab = 'seeds' | 'frameworks' | 'role';
export type LeftSidebarTab = 'context' | 'library';
