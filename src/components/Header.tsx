import { Plus, PanelLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function Header() {
  const {
    documentTabs,
    activeTabId,
    setActiveTab,
    addTab,
    rightSidebarTab,
    setRightSidebarTab,
  } = useApp();

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
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center h-full px-4 text-sm border-r border-border whitespace-nowrap transition-colors ${
              tab.id === activeTabId
                ? 'bg-app-bg text-white'
                : 'text-text-secondary hover:text-white hover:bg-panel-bg'
            }`}
          >
            {tab.title}
          </button>
        ))}
        <button
          onClick={addTab}
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
        <div className="flex items-center h-full px-4 border-l border-border">
          <span className="text-text-secondary text-sm">100%</span>
          <svg className="ml-1 w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}
