import { Search, X, Plus, ChevronRight, MoreVertical } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function LeftSidebar() {
  const {
    leftSidebarTab,
    setLeftSidebarTab,
    contextFiles,
    libraryFolders,
    pages,
    projectTitle,
    setProjectTitle,
    removeContextFile,
    togglePageExpand,
    toggleFolderExpand,
  } = useApp();

  return (
    <aside className="w-60 bg-sidebar-bg border-r border-border flex flex-col h-full">
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
        <button className="p-2 text-text-secondary hover:text-white">
          <Search size={16} />
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {leftSidebarTab === 'context' ? (
          <div className="py-2">
            {contextFiles.map((file, index) => (
              <div
                key={file.id}
                className="group flex items-center px-4 py-2 hover:bg-panel-bg cursor-pointer relative"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{file.filename}</div>
                  <div className="text-xs text-text-muted truncate">{file.metadata}</div>
                </div>
                {index === 0 && (
                  <button
                    onClick={() => removeContextFile(file.id)}
                    className="absolute right-2 top-2 p-1 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2">
            {libraryFolders.map(folder => (
              <div key={folder.id}>
                <button
                  onClick={() => toggleFolderExpand(folder.id)}
                  className="w-full flex items-center px-4 py-2 hover:bg-panel-bg"
                >
                  <ChevronRight
                    size={14}
                    className={`text-text-secondary mr-2 transition-transform ${
                      folder.isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                  <span className="text-sm text-white">{folder.name}</span>
                </button>
                {folder.isExpanded && folder.files.map(file => (
                  <div
                    key={file.id}
                    className="group flex items-center pl-8 pr-4 py-2 hover:bg-panel-bg cursor-pointer"
                  >
                    <span className="text-sm text-text-secondary truncate flex-1">{file.filename}</span>
                    <button className="p-1 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pages section */}
      <div className="border-t border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm text-text-secondary">Pages</span>
          <button className="p-1 text-text-secondary hover:text-white">
            <Plus size={14} />
          </button>
        </div>
        <div className="pb-2">
          {pages.map(page => (
            <div key={page.id}>
              <button
                onClick={() => togglePageExpand(page.id)}
                className={`w-full flex items-center px-4 py-1.5 hover:bg-panel-bg text-left ${
                  page.isExpanded ? 'bg-panel-bg' : ''
                }`}
              >
                <ChevronRight
                  size={12}
                  className={`text-text-secondary mr-2 transition-transform ${
                    page.isExpanded ? 'rotate-90' : ''
                  }`}
                />
                <span className="text-sm text-white">{page.name}</span>
              </button>
              {page.isExpanded && page.documents.map(doc => (
                <div
                  key={doc.id}
                  className="group flex items-center pl-8 pr-4 py-1.5 hover:bg-panel-bg cursor-pointer"
                >
                  <span className="text-sm text-text-secondary truncate flex-1">{doc.name}</span>
                  <button className="p-1 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100">
                    <MoreVertical size={14} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
