import { Search, Plus, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useState } from 'react';

export function RightSidebar() {
  const {
    rightSidebarTab,
    seeds,
    frameworks,
    styles,
    roleDefinition,
    frameworkSearch,
    setFrameworkSearch,
  } = useApp();

  const [stylesExpanded, setStylesExpanded] = useState(false);
  const [exportExpanded, setExportExpanded] = useState(false);

  const getSeedTypeLabel = (type: string) => {
    switch (type) {
      case 'similar':
        return 'Similar';
      case 'related':
        return 'Related';
      case 'challenge':
        return 'Challenge';
      case 'extend':
        return 'Extend';
      default:
        return type;
    }
  };

  if (rightSidebarTab === 'seeds') {
    return (
      <aside className="w-80 bg-sidebar-bg border-l border-border flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {seeds.map(seed => (
            <div key={seed.id} className="bg-panel-bg rounded-lg p-3">
              <div className="text-xs text-text-muted mb-1">
                {getSeedTypeLabel(seed.type)}: {seed.filename}.{seed.filetype}
              </div>
              <p className="text-sm text-white leading-relaxed mb-3">
                {seed.preview}
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs bg-accent text-white rounded hover:bg-opacity-80">
                  + Insert
                </button>
                <button className="px-3 py-1 text-xs text-text-secondary hover:text-white border border-border rounded">
                  ↻ Replace
                </button>
                <button className="px-3 py-1 text-xs text-text-secondary hover:text-white border border-border rounded">
                  ○ Open
                </button>
                <div className="flex-1" />
                <button className="p-1 text-text-secondary hover:text-white">
                  <ThumbsUp size={14} />
                </button>
                <button className="p-1 text-text-secondary hover:text-white">
                  <ThumbsDown size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Styles section */}
        <div className="border-t border-border">
          <button
            onClick={() => setStylesExpanded(!stylesExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-panel-bg"
          >
            <span className="text-sm text-white">Styles</span>
            <ChevronDown
              size={16}
              className={`text-text-secondary transition-transform ${stylesExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Export section */}
        <div className="border-t border-border">
          <button
            onClick={() => setExportExpanded(!exportExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-panel-bg"
          >
            <span className="text-sm text-white">Export</span>
            <Plus size={16} className="text-text-secondary" />
          </button>
        </div>
      </aside>
    );
  }

  if (rightSidebarTab === 'frameworks') {
    return (
      <aside className="w-80 bg-sidebar-bg border-l border-border flex flex-col h-full overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={frameworkSearch}
                onChange={(e) => setFrameworkSearch(e.target.value)}
                placeholder="Find..."
                className="w-full bg-panel-bg text-white text-sm px-3 py-2 rounded outline-none placeholder-text-muted"
              />
            </div>
            <button className="p-2 text-text-secondary hover:text-white">
              <Search size={16} />
            </button>
            <button className="p-2 text-text-secondary hover:text-white">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Frameworks */}
          {frameworks.map(framework => (
            <div key={framework.id} className="bg-panel-bg rounded-lg p-3">
              <div className="text-sm text-white font-medium mb-1">
                {framework.name} {framework.subtitle && <span className="text-text-muted">({framework.subtitle})</span>}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                {framework.description}
              </p>
              <button className="px-3 py-1 text-xs text-text-secondary hover:text-white border border-border rounded">
                + Apply to selection
              </button>
            </div>
          ))}
        </div>

        {/* Styles section */}
        <div className="border-t border-border">
          <button
            onClick={() => setStylesExpanded(!stylesExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-panel-bg"
          >
            <span className="text-sm text-white">Styles</span>
            <ChevronDown
              size={16}
              className={`text-text-secondary transition-transform ${stylesExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          {stylesExpanded && (
            <div className="px-4 pb-4 space-y-3">
              {styles.map(style => (
                <div key={style.id} className="bg-panel-bg rounded-lg p-3">
                  <div className="text-sm text-text-muted mb-1">{style.authorName}</div>
                  <p className="text-sm text-white leading-relaxed mb-3">
                    {style.preview}
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-xs text-text-secondary hover:text-white border border-border rounded">
                      + Apply to selection
                    </button>
                    <button className="px-3 py-1 text-xs text-text-secondary hover:text-white border border-border rounded">
                      ✎ Edit Style
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export section */}
        <div className="border-t border-border">
          <button
            onClick={() => setExportExpanded(!exportExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-panel-bg"
          >
            <span className="text-sm text-white">Export</span>
            <Plus size={16} className="text-text-secondary" />
          </button>
        </div>
      </aside>
    );
  }

  // Role tab
  return (
    <aside className="w-80 bg-sidebar-bg border-l border-border flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="prose prose-invert prose-sm max-w-none">
          <h2 className="text-sm font-semibold text-white mb-2">## Role thesis</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {roleDefinition.thesis}
          </p>

          <h2 className="text-sm font-semibold text-white mb-2">## Operating model</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {roleDefinition.operatingModel}
          </p>

          <h2 className="text-sm font-semibold text-white mb-2">## Deliverables</h2>
          <div className="text-sm text-text-secondary leading-relaxed mb-4 whitespace-pre-line">
            {roleDefinition.deliverables}
          </div>

          <h2 className="text-sm font-semibold text-white mb-2">## Method stack</h2>
          <div className="text-sm text-text-secondary leading-relaxed mb-4 whitespace-pre-line">
            {roleDefinition.methodStack}
          </div>

          <h2 className="text-sm font-semibold text-white mb-2">## Influences as operational lenses</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {roleDefinition.influences}
          </p>
        </div>
      </div>

      {/* Styles section */}
      <div className="border-t border-border">
        <button
          onClick={() => setStylesExpanded(!stylesExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-panel-bg"
        >
          <span className="text-sm text-white">Styles</span>
          <ChevronDown
            size={16}
            className={`text-text-secondary transition-transform ${stylesExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Export section */}
      <div className="border-t border-border">
        <button
          onClick={() => setExportExpanded(!exportExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-panel-bg"
        >
          <span className="text-sm text-white">Export</span>
          <Plus size={16} className="text-text-secondary" />
        </button>
      </div>
    </aside>
  );
}
