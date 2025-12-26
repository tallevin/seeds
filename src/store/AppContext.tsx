import { createContext, useContext, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  DocumentTab,
  ContextFile,
  LibraryFolder,
  Page,
  Seed,
  Framework,
  Style,
  RoleDefinition,
  RightSidebarTab,
  LeftSidebarTab,
} from '../types';

interface AppState {
  // Document tabs
  documentTabs: DocumentTab[];
  activeTabId: string | null;

  // Left sidebar
  leftSidebarTab: LeftSidebarTab;
  contextFiles: ContextFile[];
  libraryFolders: LibraryFolder[];
  pages: Page[];
  projectTitle: string;

  // Right sidebar
  rightSidebarTab: RightSidebarTab;
  seeds: Seed[];
  frameworks: Framework[];
  styles: Style[];
  roleDefinition: RoleDefinition;
  frameworkSearch: string;

  // Editor
  editorContent: string;
  ghostText: string;
}

interface AppContextType extends AppState {
  // Document tab actions
  setActiveTab: (id: string) => void;
  addTab: () => void;
  closeTab: (id: string) => void;
  updateTabTitle: (id: string, title: string) => void;
  updateTabContent: (id: string, content: string) => void;

  // Left sidebar actions
  setLeftSidebarTab: (tab: LeftSidebarTab) => void;
  removeContextFile: (id: string) => void;
  togglePageExpand: (id: string) => void;
  toggleFolderExpand: (id: string) => void;
  setProjectTitle: (title: string) => void;

  // Right sidebar actions
  setRightSidebarTab: (tab: RightSidebarTab) => void;
  setFrameworkSearch: (search: string) => void;

  // Editor actions
  setEditorContent: (content: string) => void;
  setGhostText: (text: string) => void;
}

const defaultContextFiles: ContextFile[] = Array(8).fill(null).map(() => ({
  id: uuidv4(),
  filename: 'Filename.filetype',
  filetype: 'filetype',
  metadata: 'Useful metadata',
}));

const defaultLibraryFolders: LibraryFolder[] = [
  {
    id: uuidv4(),
    name: 'Folder Name 1',
    isExpanded: true,
    files: Array(10).fill(null).map(() => ({
      id: uuidv4(),
      filename: 'Filename.filetype',
      filetype: 'filetype',
    })),
  },
  {
    id: uuidv4(),
    name: 'Folder Name 2',
    isExpanded: false,
    files: [],
  },
  {
    id: uuidv4(),
    name: 'Folder Name 3',
    isExpanded: false,
    files: [],
  },
];

const defaultPages: Page[] = [
  {
    id: uuidv4(),
    name: 'Page Name 1',
    isExpanded: true,
    documents: [
      { id: uuidv4(), name: 'Document Tab Name' },
      { id: uuidv4(), name: 'Document Tab Name' },
    ],
  },
  {
    id: uuidv4(),
    name: 'Page Name 2',
    isExpanded: false,
    documents: [],
  },
  {
    id: uuidv4(),
    name: 'Page Name 3',
    isExpanded: false,
    documents: [],
  },
];

const defaultSeeds: Seed[] = [
  {
    id: uuidv4(),
    type: 'similar',
    filename: 'Filename',
    filetype: 'md',
    preview: 'The concept of... lorem ipsum dolor sit amet consectetur. In amet tincidunt ultricies condimentum tincidunt ut iaculis vel. Enim quis cras quis sed nunc tincidunt commodo risus nulla.',
  },
  {
    id: uuidv4(),
    type: 'related',
    filename: 'Filename',
    filetype: 'pdf',
    preview: 'Related passage from XYZ... lorem ipsum dolor sit amet consectetur. In amet tincidunt ultricies condimentum tincidunt ut iaculis vel. Enim quis cras quis sed nunc tincidunt commodo risus nulla.',
  },
  {
    id: uuidv4(),
    type: 'challenge',
    filename: 'Filename',
    filetype: 'txt',
    preview: 'XYZ argues... lorem ipsum dolor sit amet consectetur. In amet tincidunt ultricies condimentum tincidunt ut iaculis vel. Enim quis cras quis sed nunc tincidunt commodo risus nulla.',
  },
  {
    id: uuidv4(),
    type: 'extend',
    filename: 'Filename',
    filetype: 'txt',
    preview: 'Consider exploring... lorem ipsum dolor sit amet consectetur. In amet tincidunt ultricies condimentum tincidunt ut iaculis vel. Enim quis cras quis sed nunc tincidunt commodo risus nulla.',
  },
];

const defaultFrameworks: Framework[] = [
  {
    id: uuidv4(),
    name: "McLuhan's Tetrad",
    subtitle: 'Laws of Media',
    description: 'Four questions for any medium/technology: What does it enhance? What does it obsolesce? What does it retrieve from the past? What does it reverse into when pushed to extremes?',
  },
  {
    id: uuidv4(),
    name: 'Six Thinking Hats',
    subtitle: '',
    description: 'Parallel thinking using different perspectives (facts, emotions, caution, benefits, creativity, process)',
  },
];

const defaultStyles: Style[] = [
  {
    id: uuidv4(),
    authorName: 'Emily Segal (Nemesis)',
    preview: 'Lorem ipsum dolor sit amet consectetur. Ultricies et tellus enim lorem placerat habitasse risus integer blandit. Duis amet tristique volutpat proin lectus arcu aliquet.',
  },
  {
    id: uuidv4(),
    authorName: 'Jay Springett',
    preview: 'Lorem ipsum dolor sit amet consectetur. Arcu ut feugiat aliquam eget dui etiam vel. Laoreet diam ipsum ipsum mi ac morbi.',
  },
  {
    id: uuidv4(),
    authorName: 'Matt Dryhurst',
    preview: 'Lorem ipsum dolor sit amet consectetur. Arcu ut feugiat aliquam eget dui etiam vel. Laoreet diam ipsum ipsum mi ac morbi.',
  },
];

const defaultRoleDefinition: RoleDefinition = {
  thesis: `I operate as a cultural strategist who turns messy signals into clear narrative systems. The role is less about trend-reporting and more about building a usable frame that changes the client's decisions, language, and outputs. The work privileges insight density, interpretive leverage, and production-ready guidance over academic completeness. The core concern is how media and technical infrastructure shape culture, consciousness, and value formation.`,
  operatingModel: `I start with signal intake (library + client context), extract patterns, then translate them into strategic moves and language. The emphasis is on fast iteration with visible artifacts: short memos, frameworks, and copy that can be used immediately. The end state is a shared map that reduces decision friction. The analysis prioritizes second-order effects, platform economics, and the emergence of networked subcultures and memetics.`,
  deliverables: `- Narrative frame and positioning map tied to target culture.
- Messaging system: language rules, metaphors, and do/don'ts.
- Strategic brief or memo that anchors direction.
- Deck copy or editorial arc that makes the strategy legible.
- Reference slate that evidences the frame with sources.
- System map linking infrastructure, protocols, and cultural outcomes.
- Cited research scaffold that supports downstream writing and decks.`,
  methodStack: `- Ingest and annotate signals from the library.
- Build an excerpt layer for evidence and reusable artifacts.
- Synthesize into a primary lens and a supporting lens.
- Convert lenses into concrete outputs: briefs, decks, writing.
- Loop through critique for clarity, tension, and usefulness.
- Track authorship, attribution, and value formation dynamics.`,
  influences: `These are not biographies; they are working lenses that change how outputs are built.`,
};

const defaultTabs: DocumentTab[] = [
  { id: uuidv4(), title: 'new-framework.md', type: 'md', content: '', isActive: true },
  { id: uuidv4(), title: 'Editable Title Here', type: 'md', content: '', isActive: false },
  { id: uuidv4(), title: 'longfile-name-2025.pdf', type: 'pdf', content: '', isActive: false },
  { id: uuidv4(), title: 'filename.txt', type: 'txt', content: '', isActive: false },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [documentTabs, setDocumentTabs] = useState<DocumentTab[]>(defaultTabs);
  const [activeTabId, setActiveTabId] = useState<string | null>(defaultTabs[0].id);
  const [leftSidebarTab, setLeftSidebarTab] = useState<LeftSidebarTab>('context');
  const [contextFiles, setContextFiles] = useState<ContextFile[]>(defaultContextFiles);
  const [libraryFolders, setLibraryFolders] = useState<LibraryFolder[]>(defaultLibraryFolders);
  const [pages, setPages] = useState<Page[]>(defaultPages);
  const [projectTitle, setProjectTitle] = useState('Editable Title Here');
  const [rightSidebarTab, setRightSidebarTab] = useState<RightSidebarTab>('seeds');
  const [seeds] = useState<Seed[]>(defaultSeeds);
  const [frameworks] = useState<Framework[]>(defaultFrameworks);
  const [styles] = useState<Style[]>(defaultStyles);
  const [roleDefinition] = useState<RoleDefinition>(defaultRoleDefinition);
  const [frameworkSearch, setFrameworkSearch] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [ghostText, setGhostText] = useState('');

  const setActiveTab = (id: string) => {
    setActiveTabId(id);
    setDocumentTabs(tabs =>
      tabs.map(tab => ({ ...tab, isActive: tab.id === id }))
    );
  };

  const addTab = () => {
    const newTab: DocumentTab = {
      id: uuidv4(),
      title: 'Untitled',
      type: 'md',
      content: '',
      isActive: true,
    };
    setDocumentTabs(tabs => [...tabs.map(t => ({ ...t, isActive: false })), newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id: string) => {
    const tabIndex = documentTabs.findIndex(t => t.id === id);
    const newTabs = documentTabs.filter(t => t.id !== id);

    if (newTabs.length === 0) {
      addTab();
      return;
    }

    if (activeTabId === id) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].isActive = true;
      setActiveTabId(newTabs[newActiveIndex].id);
    }

    setDocumentTabs(newTabs);
  };

  const updateTabTitle = (id: string, title: string) => {
    setDocumentTabs(tabs =>
      tabs.map(tab => (tab.id === id ? { ...tab, title } : tab))
    );
  };

  const updateTabContent = (id: string, content: string) => {
    setDocumentTabs(tabs =>
      tabs.map(tab => (tab.id === id ? { ...tab, content } : tab))
    );
  };

  const removeContextFile = (id: string) => {
    setContextFiles(files => files.filter(f => f.id !== id));
  };

  const togglePageExpand = (id: string) => {
    setPages(p =>
      p.map(page => (page.id === id ? { ...page, isExpanded: !page.isExpanded } : page))
    );
  };

  const toggleFolderExpand = (id: string) => {
    setLibraryFolders(folders =>
      folders.map(folder =>
        folder.id === id ? { ...folder, isExpanded: !folder.isExpanded } : folder
      )
    );
  };

  const value: AppContextType = {
    documentTabs,
    activeTabId,
    leftSidebarTab,
    contextFiles,
    libraryFolders,
    pages,
    projectTitle,
    rightSidebarTab,
    seeds,
    frameworks,
    styles,
    roleDefinition,
    frameworkSearch,
    editorContent,
    ghostText,
    setActiveTab,
    addTab,
    closeTab,
    updateTabTitle,
    updateTabContent,
    setLeftSidebarTab,
    removeContextFile,
    togglePageExpand,
    toggleFolderExpand,
    setProjectTitle,
    setRightSidebarTab,
    setFrameworkSearch,
    setEditorContent,
    setGhostText,
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
