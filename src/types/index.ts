export interface DocumentTab {
  id: string;
  title: string;
  type: 'md' | 'pdf' | 'txt' | 'other';
  content: string;
  isActive: boolean;
  pageId?: string; // Which page this document belongs to
}

export interface Heading {
  id: string;
  level: number;
  text: string;
}

export interface ContextFile {
  id: string;
  filename: string;
  filetype: string;
  metadata: string;
  content: string;
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
  content: string;
  metadata?: string;
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
  tabId: string; // Links to DocumentTab
}

export interface Seed {
  id: string;
  type: 'similar' | 'related' | 'challenge' | 'extend';
  filename: string;
  filetype: string;
  preview: string;
  sourceId?: string; // ID of context file or library file
  relevantText?: string; // The text in the editor this seed relates to
}

export interface Framework {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  prompt?: string; // AI prompt to apply this framework
}

export interface Style {
  id: string;
  authorName: string;
  preview: string;
  systemPrompt?: string; // AI system prompt for this style
}

export interface RoleDefinition {
  thesis: string;
  operatingModel: string;
  deliverables: string;
  methodStack: string;
  influences: string;
}

export interface AIConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export type RightSidebarTab = 'seeds' | 'frameworks' | 'role';
export type LeftSidebarTab = 'context' | 'library';
