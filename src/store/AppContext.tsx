import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode, type RefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  DocumentTab,
  ContextFile,
  LibraryFolder,
  LibraryFile,
  Page,
  PageDocument,
  Seed,
  Framework,
  Style,
  RoleDefinition,
  RightSidebarTab,
  LeftSidebarTab,
  Heading,
  AIConfig,
} from '../types';

// Storage keys
const STORAGE_KEYS = {
  TABS: 'seeds_tabs',
  PAGES: 'seeds_pages',
  CONTEXT: 'seeds_context',
  LIBRARY: 'seeds_library',
  PROJECT_TITLE: 'seeds_project_title',
  ROLE: 'seeds_role',
  FRAMEWORKS: 'seeds_frameworks',
  STYLES: 'seeds_styles',
  AI_CONFIG: 'seeds_ai_config',
};

interface SearchResult {
  type: 'document' | 'context' | 'library' | 'heading';
  id: string;
  title: string;
  preview: string;
  parentId?: string;
}

interface AppContextType {
  // Document tabs
  documentTabs: DocumentTab[];
  activeTabId: string | null;
  setActiveTab: (id: string) => void;
  addTab: (pageId?: string) => DocumentTab;
  closeTab: (id: string) => void;
  updateTabTitle: (id: string, title: string) => void;
  updateTabContent: (id: string, content: string) => void;

  // Left sidebar
  leftSidebarTab: LeftSidebarTab;
  setLeftSidebarTab: (tab: LeftSidebarTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];

  // Context files
  contextFiles: ContextFile[];
  addContextFile: (file: Omit<ContextFile, 'id'>) => void;
  removeContextFile: (id: string) => void;
  addToContext: (file: LibraryFile) => void;

  // Library
  libraryFolders: LibraryFolder[];
  addLibraryFolder: (name: string) => void;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  toggleFolderExpand: (id: string) => void;
  addFileToFolder: (folderId: string, file: Omit<LibraryFile, 'id'>) => void;
  deleteFileFromFolder: (folderId: string, fileId: string) => void;
  uploadFiles: (files: FileList, folderId?: string) => Promise<void>;

  // Pages
  pages: Page[];
  addPage: (name: string) => void;
  renamePage: (id: string, name: string) => void;
  deletePage: (id: string) => void;
  togglePageExpand: (id: string) => void;
  addDocumentToPage: (pageId: string, name: string) => void;
  removeDocumentFromPage: (pageId: string, docId: string) => void;
  renameDocumentInPage: (pageId: string, docId: string, name: string) => void;
  openDocumentFromPage: (tabId: string) => void;

  // Project
  projectTitle: string;
  setProjectTitle: (title: string) => void;

  // Headings (from editor)
  headings: Heading[];
  setHeadings: (headings: Heading[]) => void;
  scrollToHeading: (id: string) => void;

  // Right sidebar
  rightSidebarTab: RightSidebarTab;
  setRightSidebarTab: (tab: RightSidebarTab) => void;

  // Seeds (AI-generated)
  seeds: Seed[];
  setSeeds: (seeds: Seed[]) => void;
  generateSeeds: () => Promise<void>;
  insertSeed: (seed: Seed) => void;
  replaceSeed: (seed: Seed) => void;

  // Frameworks
  frameworks: Framework[];
  frameworkSearch: string;
  setFrameworkSearch: (search: string) => void;
  addFramework: (framework: Omit<Framework, 'id'>) => void;
  deleteFramework: (id: string) => void;
  applyFramework: (framework: Framework, selectedText: string) => Promise<string>;

  // Styles
  styles: Style[];
  addStyle: (style: Omit<Style, 'id'>) => void;
  deleteStyle: (id: string) => void;
  applyStyle: (style: Style, selectedText: string) => Promise<string>;

  // Role
  roleDefinition: RoleDefinition;
  setRoleDefinition: (role: RoleDefinition) => void;

  // AI
  aiConfig: AIConfig;
  setAIConfig: (config: AIConfig) => void;
  isAILoading: boolean;
  ghostText: string;
  setGhostText: (text: string) => void;
  generateGhostText: (context: string) => Promise<void>;

  // Export
  exportDocument: (format: 'md' | 'txt' | 'html') => void;

  // Editor ref for scroll
  editorScrollRef: RefObject<HTMLDivElement | null>;
}

// Default frameworks
const defaultFrameworks: Framework[] = [
  {
    id: uuidv4(),
    name: "McLuhan's Tetrad",
    subtitle: 'Laws of Media',
    description: 'Four questions for any medium/technology: What does it enhance? What does it obsolesce? What does it retrieve from the past? What does it reverse into when pushed to extremes?',
    prompt: 'Analyze the following text using McLuhan\'s Tetrad framework. For the subject matter discussed, identify: 1) What does it ENHANCE or intensify? 2) What does it make OBSOLETE or displace? 3) What does it RETRIEVE that was previously obsolesced? 4) What does it REVERSE or flip into when pushed to extremes?',
  },
  {
    id: uuidv4(),
    name: 'Six Thinking Hats',
    subtitle: 'De Bono',
    description: 'Parallel thinking using different perspectives (facts, emotions, caution, benefits, creativity, process)',
    prompt: 'Analyze the following text using the Six Thinking Hats framework: WHITE HAT (facts, data), RED HAT (emotions, intuition), BLACK HAT (caution, risks), YELLOW HAT (benefits, optimism), GREEN HAT (creativity, alternatives), BLUE HAT (process, organization).',
  },
];

// Default styles
const defaultStyles: Style[] = [
  {
    id: uuidv4(),
    authorName: 'Emily Segal (Nemesis)',
    preview: 'Sharp cultural analysis with fashion-forward prose. Mixes high theory with pop culture.',
    systemPrompt: 'Write in the style of Emily Segal - sharp, culturally aware prose that blends high theory with contemporary pop culture. Use precise language with occasional unexpected juxtapositions.',
  },
  {
    id: uuidv4(),
    authorName: 'Jay Springett',
    preview: 'Systems thinking meets solarpunk optimism. Clear explanations of complex networks.',
    systemPrompt: 'Write in the style of Jay Springett - systems-oriented thinking with solarpunk optimism. Focus on networks, emergence, and possible futures. Clear and accessible while maintaining depth.',
  },
  {
    id: uuidv4(),
    authorName: 'Matt Dryhurst',
    preview: 'Techno-political analysis with artist sensibility. Explores power in digital systems.',
    systemPrompt: 'Write in the style of Matt Dryhurst - techno-political analysis from an artist\'s perspective. Examine power structures, ownership, and agency in digital systems.',
  },
];

const defaultRole: RoleDefinition = {
  thesis: '',
  operatingModel: '',
  deliverables: '',
  methodStack: '',
  influences: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const editorScrollRef = useRef<HTMLDivElement | null>(null);

  // Initialize state from localStorage or defaults
  const [documentTabs, setDocumentTabs] = useState<DocumentTab[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    const defaultTab: DocumentTab = {
      id: uuidv4(),
      title: 'Untitled',
      type: 'md',
      content: '',
      isActive: true,
    };
    return [defaultTab];
  });

  const [activeTabId, setActiveTabIdState] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABS);
    if (saved) {
      try {
        const tabs = JSON.parse(saved);
        const active = tabs.find((t: DocumentTab) => t.isActive);
        return active?.id || tabs[0]?.id || null;
      } catch { /* ignore */ }
    }
    return documentTabs[0]?.id || null;
  });

  const [leftSidebarTab, setLeftSidebarTab] = useState<LeftSidebarTab>('context');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [contextFiles, setContextFiles] = useState<ContextFile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTEXT);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [libraryFolders, setLibraryFolders] = useState<LibraryFolder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [pages, setPages] = useState<Page[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAGES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [projectTitle, setProjectTitleState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PROJECT_TITLE) || 'Untitled Project';
  });

  const [headings, setHeadings] = useState<Heading[]>([]);
  const [rightSidebarTab, setRightSidebarTab] = useState<RightSidebarTab>('seeds');
  const [seeds, setSeeds] = useState<Seed[]>([]);

  const [frameworks, setFrameworks] = useState<Framework[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FRAMEWORKS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return defaultFrameworks;
  });

  const [frameworkSearch, setFrameworkSearch] = useState('');

  const [styles, setStyles] = useState<Style[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STYLES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return defaultStyles;
  });

  const [roleDefinition, setRoleDefinitionState] = useState<RoleDefinition>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return defaultRole;
  });

  const [aiConfig, setAIConfigState] = useState<AIConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return { apiKey: '', model: 'claude-3-haiku-20240307', baseUrl: 'https://api.anthropic.com' };
  });

  const [isAILoading, setIsAILoading] = useState(false);
  const [ghostText, setGhostText] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(documentTabs));
  }, [documentTabs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTEXT, JSON.stringify(contextFiles));
  }, [contextFiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(libraryFolders));
  }, [libraryFolders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECT_TITLE, projectTitle);
  }, [projectTitle]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, JSON.stringify(roleDefinition));
  }, [roleDefinition]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FRAMEWORKS, JSON.stringify(frameworks));
  }, [frameworks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STYLES, JSON.stringify(styles));
  }, [styles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(aiConfig));
  }, [aiConfig]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    documentTabs.forEach(tab => {
      if (tab.title.toLowerCase().includes(query) || tab.content.toLowerCase().includes(query)) {
        results.push({
          type: 'document',
          id: tab.id,
          title: tab.title,
          preview: tab.content.slice(0, 100).replace(/<[^>]*>/g, ''),
        });
      }
    });

    contextFiles.forEach(file => {
      if (file.filename.toLowerCase().includes(query) || file.content.toLowerCase().includes(query)) {
        results.push({
          type: 'context',
          id: file.id,
          title: file.filename,
          preview: file.content.slice(0, 100),
        });
      }
    });

    libraryFolders.forEach(folder => {
      folder.files.forEach(file => {
        if (file.filename.toLowerCase().includes(query) || file.content.toLowerCase().includes(query)) {
          results.push({
            type: 'library',
            id: file.id,
            title: file.filename,
            preview: file.content.slice(0, 100),
            parentId: folder.id,
          });
        }
      });
    });

    headings.forEach(heading => {
      if (heading.text.toLowerCase().includes(query)) {
        results.push({
          type: 'heading',
          id: heading.id,
          title: heading.text,
          preview: `H${heading.level}`,
        });
      }
    });

    setSearchResults(results);
  }, [searchQuery, documentTabs, contextFiles, libraryFolders, headings]);

  // Document tab actions
  const setActiveTab = useCallback((id: string) => {
    setActiveTabIdState(id);
    setDocumentTabs(tabs =>
      tabs.map(tab => ({ ...tab, isActive: tab.id === id }))
    );
  }, []);

  const addTab = useCallback((pageId?: string) => {
    const newTab: DocumentTab = {
      id: uuidv4(),
      title: 'Untitled',
      type: 'md',
      content: '',
      isActive: true,
      pageId,
    };
    setDocumentTabs(tabs => [...tabs.map(t => ({ ...t, isActive: false })), newTab]);
    setActiveTabIdState(newTab.id);
    return newTab;
  }, []);

  const closeTab = useCallback((id: string) => {
    setDocumentTabs(tabs => {
      const tabIndex = tabs.findIndex(t => t.id === id);
      const newTabs = tabs.filter(t => t.id !== id);

      if (newTabs.length === 0) {
        const newTab: DocumentTab = {
          id: uuidv4(),
          title: 'Untitled',
          type: 'md',
          content: '',
          isActive: true,
        };
        setActiveTabIdState(newTab.id);
        return [newTab];
      }

      if (activeTabId === id) {
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        newTabs[newActiveIndex].isActive = true;
        setActiveTabIdState(newTabs[newActiveIndex].id);
      }

      return newTabs;
    });

    setPages(p => p.map(page => ({
      ...page,
      documents: page.documents.filter(d => d.tabId !== id),
    })));
  }, [activeTabId]);

  const updateTabTitle = useCallback((id: string, title: string) => {
    setDocumentTabs(tabs =>
      tabs.map(tab => (tab.id === id ? { ...tab, title } : tab))
    );
    setPages(p => p.map(page => ({
      ...page,
      documents: page.documents.map(d => d.tabId === id ? { ...d, name: title } : d),
    })));
  }, []);

  const updateTabContent = useCallback((id: string, content: string) => {
    setDocumentTabs(tabs =>
      tabs.map(tab => (tab.id === id ? { ...tab, content } : tab))
    );
  }, []);

  // Context file actions
  const addContextFile = useCallback((file: Omit<ContextFile, 'id'>) => {
    setContextFiles(files => [...files, { ...file, id: uuidv4() }]);
  }, []);

  const removeContextFile = useCallback((id: string) => {
    setContextFiles(files => files.filter(f => f.id !== id));
  }, []);

  const addToContext = useCallback((file: LibraryFile) => {
    const contextFile: ContextFile = {
      id: uuidv4(),
      filename: file.filename,
      filetype: file.filetype,
      metadata: file.metadata || '',
      content: file.content,
    };
    setContextFiles(files => [...files, contextFile]);
  }, []);

  // Library actions
  const addLibraryFolder = useCallback((name: string) => {
    setLibraryFolders(folders => [...folders, {
      id: uuidv4(),
      name,
      files: [],
      isExpanded: true,
    }]);
  }, []);

  const renameFolder = useCallback((id: string, name: string) => {
    setLibraryFolders(folders =>
      folders.map(f => f.id === id ? { ...f, name } : f)
    );
  }, []);

  const deleteFolder = useCallback((id: string) => {
    setLibraryFolders(folders => folders.filter(f => f.id !== id));
  }, []);

  const toggleFolderExpand = useCallback((id: string) => {
    setLibraryFolders(folders =>
      folders.map(f => f.id === id ? { ...f, isExpanded: !f.isExpanded } : f)
    );
  }, []);

  const addFileToFolder = useCallback((folderId: string, file: Omit<LibraryFile, 'id'>) => {
    setLibraryFolders(folders =>
      folders.map(f => f.id === folderId ? {
        ...f,
        files: [...f.files, { ...file, id: uuidv4() }],
      } : f)
    );
  }, []);

  const deleteFileFromFolder = useCallback((folderId: string, fileId: string) => {
    setLibraryFolders(folders =>
      folders.map(f => f.id === folderId ? {
        ...f,
        files: f.files.filter(file => file.id !== fileId),
      } : f)
    );
  }, []);

  const uploadFiles = useCallback(async (files: FileList, folderId?: string) => {
    let targetFolderId = folderId;

    if (!targetFolderId && libraryFolders.length === 0) {
      const newFolder: LibraryFolder = {
        id: uuidv4(),
        name: 'Uploads',
        files: [],
        isExpanded: true,
      };
      setLibraryFolders([newFolder]);
      targetFolderId = newFolder.id;
    } else if (!targetFolderId) {
      targetFolderId = libraryFolders[0].id;
    }

    for (const file of Array.from(files)) {
      const content = await file.text();
      const ext = file.name.split('.').pop() || '';

      const newFile: LibraryFile = {
        id: uuidv4(),
        filename: file.name,
        filetype: ext,
        content,
        metadata: `${(file.size / 1024).toFixed(1)} KB`,
      };

      setLibraryFolders(folders =>
        folders.map(f => f.id === targetFolderId ? {
          ...f,
          files: [...f.files, newFile],
        } : f)
      );
    }
  }, [libraryFolders]);

  // Page actions
  const addPage = useCallback((name: string) => {
    setPages(p => [...p, {
      id: uuidv4(),
      name,
      documents: [],
      isExpanded: true,
    }]);
  }, []);

  const renamePage = useCallback((id: string, name: string) => {
    setPages(p => p.map(page => page.id === id ? { ...page, name } : page));
  }, []);

  const deletePage = useCallback((id: string) => {
    const page = pages.find(p => p.id === id);
    if (page) {
      page.documents.forEach(doc => {
        setDocumentTabs(tabs => tabs.filter(t => t.id !== doc.tabId));
      });
    }
    setPages(p => p.filter(page => page.id !== id));
  }, [pages]);

  const togglePageExpand = useCallback((id: string) => {
    setPages(p => p.map(page => page.id === id ? { ...page, isExpanded: !page.isExpanded } : page));
  }, []);

  const addDocumentToPage = useCallback((pageId: string, name: string) => {
    const newTab = addTab(pageId);
    updateTabTitle(newTab.id, name);

    const doc: PageDocument = {
      id: uuidv4(),
      name,
      tabId: newTab.id,
    };

    setPages(p => p.map(page => page.id === pageId ? {
      ...page,
      documents: [...page.documents, doc],
    } : page));
  }, [addTab, updateTabTitle]);

  const removeDocumentFromPage = useCallback((pageId: string, docId: string) => {
    const page = pages.find(p => p.id === pageId);
    const doc = page?.documents.find(d => d.id === docId);

    if (doc) {
      closeTab(doc.tabId);
    }

    setPages(p => p.map(page => page.id === pageId ? {
      ...page,
      documents: page.documents.filter(d => d.id !== docId),
    } : page));
  }, [pages, closeTab]);

  const renameDocumentInPage = useCallback((pageId: string, docId: string, name: string) => {
    setPages(p => p.map(page => page.id === pageId ? {
      ...page,
      documents: page.documents.map(d => d.id === docId ? { ...d, name } : d),
    } : page));

    const page = pages.find(p => p.id === pageId);
    const doc = page?.documents.find(d => d.id === docId);
    if (doc) {
      updateTabTitle(doc.tabId, name);
    }
  }, [pages, updateTabTitle]);

  const openDocumentFromPage = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, [setActiveTab]);

  // Scroll to heading
  const scrollToHeading = useCallback((id: string) => {
    if (editorScrollRef.current) {
      const element = editorScrollRef.current.querySelector(`[data-heading-id="${id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  const setProjectTitle = useCallback((title: string) => {
    setProjectTitleState(title);
  }, []);

  const setRoleDefinition = useCallback((role: RoleDefinition) => {
    setRoleDefinitionState(role);
  }, []);

  const setAIConfig = useCallback((config: AIConfig) => {
    setAIConfigState(config);
  }, []);

  // AI functions
  const callAI = useCallback(async (messages: { role: string; content: string }[], systemPrompt?: string): Promise<string> => {
    if (!aiConfig.apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch(`${aiConfig.baseUrl || 'https://api.anthropic.com'}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': aiConfig.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: aiConfig.model,
        max_tokens: 1024,
        system: systemPrompt || roleDefinition.thesis || 'You are a helpful writing assistant.',
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'AI request failed');
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }, [aiConfig, roleDefinition]);

  const generateSeeds = useCallback(async () => {
    if (!aiConfig.apiKey) return;

    setIsAILoading(true);
    try {
      const activeTab = documentTabs.find(t => t.id === activeTabId);
      const currentContent = activeTab?.content || '';
      const contextText = contextFiles.map(f => `[${f.filename}]: ${f.content.slice(0, 500)}`).join('\n\n');

      const prompt = `Based on the document and context, generate 4 writing suggestions as JSON array. Types: similar (similar themes), related (adds depth), challenge (counterpoint), extend (expand thinking).

Document: ${currentContent.replace(/<[^>]*>/g, '').slice(0, 1000)}

Context: ${contextText || 'No context files'}

Return JSON: [{"type": "similar", "preview": "suggestion text", "filename": "source.md"}, ...]`;

      const response = await callAI([{ role: 'user', content: prompt }]);

      try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setSeeds(parsed.map((s: { type: string; preview: string; filename: string }) => ({
            id: uuidv4(),
            type: s.type as Seed['type'],
            preview: s.preview,
            filename: s.filename?.split('.')[0] || 'AI',
            filetype: s.filename?.split('.')[1] || 'md',
          })));
        }
      } catch {
        setSeeds([{
          id: uuidv4(),
          type: 'similar',
          preview: response.slice(0, 300),
          filename: 'AI',
          filetype: 'suggestion',
        }]);
      }
    } catch (error) {
      console.error('Failed to generate seeds:', error);
    } finally {
      setIsAILoading(false);
    }
  }, [aiConfig, documentTabs, activeTabId, contextFiles, callAI]);

  const insertSeed = useCallback((seed: Seed) => {
    const activeTab = documentTabs.find(t => t.id === activeTabId);
    if (activeTab) {
      updateTabContent(activeTab.id, activeTab.content + `<p>${seed.preview}</p>`);
    }
  }, [documentTabs, activeTabId, updateTabContent]);

  const replaceSeed = useCallback((seed: Seed) => {
    insertSeed(seed);
  }, [insertSeed]);

  const applyFramework = useCallback(async (framework: Framework, selectedText: string): Promise<string> => {
    if (!framework.prompt || !aiConfig.apiKey) return selectedText;

    setIsAILoading(true);
    try {
      return await callAI([{ role: 'user', content: `${framework.prompt}\n\nText:\n${selectedText}` }]);
    } finally {
      setIsAILoading(false);
    }
  }, [aiConfig, callAI]);

  const applyStyle = useCallback(async (style: Style, selectedText: string): Promise<string> => {
    if (!aiConfig.apiKey) return selectedText;

    setIsAILoading(true);
    try {
      return await callAI([{ role: 'user', content: `Rewrite:\n\n${selectedText}` }], style.systemPrompt);
    } finally {
      setIsAILoading(false);
    }
  }, [aiConfig, callAI]);

  const addFramework = useCallback((framework: Omit<Framework, 'id'>) => {
    setFrameworks(f => [...f, { ...framework, id: uuidv4() }]);
  }, []);

  const deleteFramework = useCallback((id: string) => {
    setFrameworks(f => f.filter(fw => fw.id !== id));
  }, []);

  const addStyle = useCallback((style: Omit<Style, 'id'>) => {
    setStyles(s => [...s, { ...style, id: uuidv4() }]);
  }, []);

  const deleteStyle = useCallback((id: string) => {
    setStyles(s => s.filter(st => st.id !== id));
  }, []);

  const generateGhostText = useCallback(async (context: string) => {
    if (!aiConfig.apiKey || !context.trim()) {
      setGhostText('');
      return;
    }

    try {
      const response = await callAI([
        { role: 'user', content: `Continue naturally with 1-2 sentences only:\n\n${context}` }
      ]);
      setGhostText(response.trim());
    } catch {
      setGhostText('');
    }
  }, [aiConfig, callAI]);

  const exportDocument = useCallback((format: 'md' | 'txt' | 'html') => {
    const activeTab = documentTabs.find(t => t.id === activeTabId);
    if (!activeTab) return;

    let content = activeTab.content;

    if (format === 'txt') {
      content = content.replace(/<[^>]*>/g, '');
    } else if (format === 'md') {
      content = content
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
        .replace(/<[^>]*>/g, '');
    }

    const blob = new Blob([content], { type: format === 'html' ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab.title}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [documentTabs, activeTabId]);

  const value: AppContextType = {
    documentTabs,
    activeTabId,
    setActiveTab,
    addTab,
    closeTab,
    updateTabTitle,
    updateTabContent,
    leftSidebarTab,
    setLeftSidebarTab,
    searchQuery,
    setSearchQuery,
    searchResults,
    contextFiles,
    addContextFile,
    removeContextFile,
    addToContext,
    libraryFolders,
    addLibraryFolder,
    renameFolder,
    deleteFolder,
    toggleFolderExpand,
    addFileToFolder,
    deleteFileFromFolder,
    uploadFiles,
    pages,
    addPage,
    renamePage,
    deletePage,
    togglePageExpand,
    addDocumentToPage,
    removeDocumentFromPage,
    renameDocumentInPage,
    openDocumentFromPage,
    projectTitle,
    setProjectTitle,
    headings,
    setHeadings,
    scrollToHeading,
    rightSidebarTab,
    setRightSidebarTab,
    seeds,
    setSeeds,
    generateSeeds,
    insertSeed,
    replaceSeed,
    frameworks,
    frameworkSearch,
    setFrameworkSearch,
    addFramework,
    deleteFramework,
    applyFramework,
    styles,
    addStyle,
    deleteStyle,
    applyStyle,
    roleDefinition,
    setRoleDefinition,
    aiConfig,
    setAIConfig,
    isAILoading,
    ghostText,
    setGhostText,
    generateGhostText,
    exportDocument,
    editorScrollRef,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
