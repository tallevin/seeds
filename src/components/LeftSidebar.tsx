import { Search, X, Plus, ChevronRight, MoreVertical, Upload, FolderPlus, FileText } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useState, useRef } from 'react';

export function LeftSidebar() {
  const {
    leftSidebarTab,
    setLeftSidebarTab,
    searchQuery,
    setSearchQuery,
    searchResults,
    contextFiles,
    libraryFolders,
    pages,
    projectTitle,
    setProjectTitle,
    removeContextFile,
    togglePageExpand,
    toggleFolderExpand,
    addPage,
    addDocumentToPage,
    removeDocumentFromPage,
    renamePage,
    deletePage,
    openDocumentFromPage,
    addLibraryFolder,
    uploadFiles,
    deleteFolder,
    deleteFileFromFolder,
    addToContext,
    setActiveTab,
    scrollToHeading,
    headings,
  } = useApp();

  const [showSearch, setShowSearch] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [showNewPage, setShowNewPage] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [addingDocToPage, setAddingDocToPage] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ type: string; id: string; parentId?: string; x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleAddPage = () => {
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setShowNewPage(false);
    }
  };

  const handleAddDocument = (pageId: string) => {
    if (newDocName.trim()) {
      addDocumentToPage(pageId, newDocName.trim());
      setNewDocName('');
      setAddingDocToPage(null);
    }
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addLibraryFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, type: string, id: string, parentId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ type, id, parentId, x: e.clientX, y: e.clientY });
  };

  const handleSearchResultClick = (result: typeof searchResults[0]) => {
    if (result.type === 'document') {
      setActiveTab(result.id);
    } else if (result.type === 'heading') {
      scrollToHeading(result.id);
    }
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <aside className="w-60 bg-sidebar-bg border-r border-border flex flex-col h-full relative">
      {/* Context menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-panel-bg border border-border rounded-lg shadow-lg py-1 min-w-[120px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {contextMenu.type === 'page' && (
              <>
                <button
                  onClick={() => {
                    const name = prompt('New page name:');
                    if (name) renamePage(contextMenu.id, name);
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-sm text-left text-text-secondary hover:text-white hover:bg-accent"
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    deletePage(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-sm text-left text-red-400 hover:text-white hover:bg-red-500/20"
                >
                  Delete
                </button>
              </>
            )}
            {contextMenu.type === 'document' && contextMenu.parentId && (
              <button
                onClick={() => {
                  removeDocumentFromPage(contextMenu.parentId!, contextMenu.id);
                  setContextMenu(null);
                }}
                className="w-full px-3 py-1.5 text-sm text-left text-red-400 hover:text-white hover:bg-red-500/20"
              >
                Delete
              </button>
            )}
            {contextMenu.type === 'folder' && (
              <button
                onClick={() => {
                  deleteFolder(contextMenu.id);
                  setContextMenu(null);
                }}
                className="w-full px-3 py-1.5 text-sm text-left text-red-400 hover:text-white hover:bg-red-500/20"
              >
                Delete Folder
              </button>
            )}
            {contextMenu.type === 'libraryFile' && contextMenu.parentId && (
              <>
                <button
                  onClick={() => {
                    const folder = libraryFolders.find(f => f.id === contextMenu.parentId);
                    const file = folder?.files.find(f => f.id === contextMenu.id);
                    if (file) addToContext(file);
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-sm text-left text-text-secondary hover:text-white hover:bg-accent"
                >
                  Add to Context
                </button>
                <button
                  onClick={() => {
                    deleteFileFromFolder(contextMenu.parentId!, contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-sm text-left text-red-400 hover:text-white hover:bg-red-500/20"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Project title */}
      <div className="p-4 border-b border-border">
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="w-full bg-transparent text-white text-sm font-medium outline-none"
          placeholder="Project Title"
        />
      </div>

      {/* Tab switcher */}
      <div className="flex items-center border-b border-border">
        <button
          onClick={() => setLeftSidebarTab('context')}
          className={`flex-1 py-2 text-sm transition-colors ${
            leftSidebarTab === 'context'
              ? 'text-white'
              : 'text-text-secondary hover:text-white'
          }`}
        >
          Context
        </button>
        <button
          onClick={() => setLeftSidebarTab('library')}
          className={`flex-1 py-2 text-sm transition-colors ${
            leftSidebarTab === 'library'
              ? 'text-white bg-accent'
              : 'text-text-secondary hover:text-white'
          }`}
        >
          Library
        </button>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`p-2 transition-colors ${showSearch ? 'text-white' : 'text-text-secondary hover:text-white'}`}
        >
          <Search size={16} />
        </button>
      </div>

      {/* Search panel */}
      {showSearch && (
        <div className="p-2 border-b border-border">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-panel-bg text-white text-sm px-3 py-2 rounded outline-none"
            autoFocus
          />
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-48 overflow-y-auto">
              {searchResults.map(result => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full text-left px-2 py-1.5 hover:bg-panel-bg rounded"
                >
                  <div className="text-sm text-white truncate">{result.title}</div>
                  <div className="text-xs text-text-muted truncate">{result.type} • {result.preview}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {leftSidebarTab === 'context' ? (
          <div className="py-2">
            {contextFiles.length === 0 ? (
              <div className="px-4 py-8 text-center text-text-muted text-sm">
                <FileText size={24} className="mx-auto mb-2 opacity-50" />
                <p>No context files</p>
                <p className="text-xs mt-1">Add files from Library</p>
              </div>
            ) : (
              contextFiles.map((file) => (
                <div
                  key={file.id}
                  className="group flex items-center px-4 py-2 hover:bg-panel-bg cursor-pointer relative"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{file.filename}</div>
                    <div className="text-xs text-text-muted truncate">{file.metadata}</div>
                  </div>
                  <button
                    onClick={() => removeContextFile(file.id)}
                    className="p-1 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="py-2">
            {/* Upload and folder buttons */}
            <div className="flex items-center gap-1 px-4 py-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-white hover:bg-panel-bg rounded"
              >
                <Upload size={12} /> Upload
              </button>
              <button
                onClick={() => setShowNewFolder(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-white hover:bg-panel-bg rounded"
              >
                <FolderPlus size={12} /> Folder
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.md,.json,.html,.css,.js,.ts"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {showNewFolder && (
              <div className="px-4 py-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddFolder();
                    if (e.key === 'Escape') setShowNewFolder(false);
                  }}
                  onBlur={() => setShowNewFolder(false)}
                  placeholder="Folder name..."
                  className="w-full bg-panel-bg text-white text-sm px-2 py-1 rounded outline-none"
                  autoFocus
                />
              </div>
            )}

            {libraryFolders.length === 0 && !showNewFolder ? (
              <div className="px-4 py-8 text-center text-text-muted text-sm">
                <FolderPlus size={24} className="mx-auto mb-2 opacity-50" />
                <p>No folders yet</p>
                <p className="text-xs mt-1">Create a folder or upload files</p>
              </div>
            ) : (
              libraryFolders.map(folder => (
                <div key={folder.id}>
                  <button
                    onClick={() => toggleFolderExpand(folder.id)}
                    onContextMenu={(e) => handleContextMenu(e, 'folder', folder.id)}
                    className="w-full flex items-center px-4 py-2 hover:bg-panel-bg group"
                  >
                    <ChevronRight
                      size={14}
                      className={`text-text-secondary mr-2 transition-transform ${
                        folder.isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                    <span className="text-sm text-white flex-1 text-left">{folder.name}</span>
                    <span className="text-xs text-text-muted">{folder.files.length}</span>
                  </button>
                  {folder.isExpanded && folder.files.map(file => (
                    <div
                      key={file.id}
                      onContextMenu={(e) => handleContextMenu(e, 'libraryFile', file.id, folder.id)}
                      className="group flex items-center pl-8 pr-4 py-2 hover:bg-panel-bg cursor-pointer"
                    >
                      <span className="text-sm text-text-secondary truncate flex-1">{file.filename}</span>
                      <button
                        onClick={(e) => handleContextMenu(e, 'libraryFile', file.id, folder.id)}
                        className="p-1 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Headings section */}
      {leftSidebarTab === 'context' && headings.length > 0 && (
        <div className="border-t border-border max-h-40 overflow-y-auto">
          <div className="px-4 py-2 text-xs text-text-muted">Outline</div>
          {headings.map(heading => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className="w-full text-left px-4 py-1 text-sm text-text-secondary hover:text-white hover:bg-panel-bg truncate"
              style={{ paddingLeft: `${heading.level * 8 + 16}px` }}
            >
              {heading.text}
            </button>
          ))}
        </div>
      )}

      {/* Pages section */}
      <div className="border-t border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm text-text-secondary">Pages</span>
          <button
            onClick={() => setShowNewPage(true)}
            className="p-1 text-text-secondary hover:text-white"
          >
            <Plus size={14} />
          </button>
        </div>

        {showNewPage && (
          <div className="px-4 py-2">
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPage();
                if (e.key === 'Escape') setShowNewPage(false);
              }}
              onBlur={() => !newPageName && setShowNewPage(false)}
              placeholder="Page name..."
              className="w-full bg-panel-bg text-white text-sm px-2 py-1 rounded outline-none"
              autoFocus
            />
          </div>
        )}

        <div className="pb-2 max-h-48 overflow-y-auto">
          {pages.length === 0 && !showNewPage ? (
            <div className="px-4 py-4 text-center text-text-muted text-xs">
              No pages yet
            </div>
          ) : (
            pages.map(page => (
              <div key={page.id} className="group">
                <div
                  className={`flex items-center px-4 py-1.5 hover:bg-panel-bg ${
                    page.isExpanded ? 'bg-panel-bg' : ''
                  }`}
                >
                  <button
                    onClick={() => togglePageExpand(page.id)}
                    className="flex items-center flex-1 min-w-0"
                  >
                    <ChevronRight
                      size={12}
                      className={`text-text-secondary mr-2 transition-transform flex-shrink-0 ${
                        page.isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                    <span className="text-sm text-white truncate">{page.name}</span>
                  </button>
                  <button
                    onClick={() => setAddingDocToPage(page.id)}
                    className="p-1 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={(e) => handleContextMenu(e, 'page', page.id)}
                    className="p-1 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical size={12} />
                  </button>
                </div>

                {addingDocToPage === page.id && (
                  <div className="pl-8 pr-4 py-1">
                    <input
                      type="text"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddDocument(page.id);
                        if (e.key === 'Escape') setAddingDocToPage(null);
                      }}
                      onBlur={() => setAddingDocToPage(null)}
                      placeholder="Document name..."
                      className="w-full bg-panel-bg text-white text-sm px-2 py-1 rounded outline-none"
                      autoFocus
                    />
                  </div>
                )}

                {page.isExpanded && page.documents.map(doc => (
                  <div
                    key={doc.id}
                    onContextMenu={(e) => handleContextMenu(e, 'document', doc.id, page.id)}
                    className="group/doc flex items-center pl-8 pr-4 py-1.5 hover:bg-panel-bg cursor-pointer"
                  >
                    <button
                      onClick={() => openDocumentFromPage(doc.tabId)}
                      className="text-sm text-text-secondary truncate flex-1 text-left hover:text-white"
                    >
                      {doc.name}
                    </button>
                    <button
                      onClick={(e) => handleContextMenu(e, 'document', doc.id, page.id)}
                      className="p-1 text-text-secondary hover:text-white opacity-0 group-hover/doc:opacity-100"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
