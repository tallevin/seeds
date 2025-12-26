import { Plus, PanelLeft, X, Settings } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useState } from 'react';

export function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
  const {
    documentTabs,
    activeTabId,
    setActiveTab,
    addTab,
    closeTab,
    updateTabTitle,
    rightSidebarTab,
    setRightSidebarTab,
  } = useApp();

  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleDoubleClick = (id: string, title: string) => {
    setEditingTabId(id);
    setEditValue(title);
  };

  const handleEditSubmit = (id: string) => {
    if (editValue.trim()) {
      updateTabTitle(id, editValue.trim());
    }
    setEditingTabId(null);
  };

  return (
    <header className="flex items-center h-12 bg-sidebar-bg border-b border-border">
      {/* Left side - Logo and toggle */}
      <div className="flex items-center h-full px-4 border-r border-border">
        <button className="p-1 hover:bg-accent rounded">
          <PanelLeft size={18} className="text-text-secondary" />
        </button>
        <span className="ml-3 text-white font-medium">Seeds</span>
      </div>

      {/* Document tabs */}
      <div className="flex items-center h-full flex-1 overflow-x-auto">
        {documentTabs.map(tab => (
          <div
            key={tab.id}
            className={`group flex items-center h-full border-r border-border ${
              tab.id === activeTabId
                ? 'bg-app-bg'
                : 'hover:bg-panel-bg'
            }`}
          >
            {editingTabId === tab.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleEditSubmit(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditSubmit(tab.id);
                  if (e.key === 'Escape') setEditingTabId(null);
                }}
                className="h-full px-4 bg-transparent text-white text-sm outline-none w-32"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setActiveTab(tab.id)}
                onDoubleClick={() => handleDoubleClick(tab.id, tab.title)}
                className={`h-full px-4 text-sm whitespace-nowrap transition-colors ${
                  tab.id === activeTabId
                    ? 'text-white'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {tab.title}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="pr-2 text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addTab()}
          className="flex items-center justify-center h-full px-3 text-text-secondary hover:text-white hover:bg-panel-bg transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Right side - View tabs */}
      <div className="flex items-center h-full">
        <div className="flex items-center h-full border-l border-border">
          {(['seeds', 'frameworks', 'role'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setRightSidebarTab(tab)}
              className={`h-full px-4 text-sm capitalize transition-colors ${
                rightSidebarTab === tab
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {tab === 'seeds' ? 'Seeds' : tab === 'frameworks' ? 'Frameworks' : 'Role'}
            </button>
          ))}
        </div>
        <button
          onClick={onOpenSettings}
          className="flex items-center h-full px-3 border-l border-border text-text-secondary hover:text-white transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
