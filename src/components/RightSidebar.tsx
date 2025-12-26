import { Search, Plus, ThumbsUp, ThumbsDown, ChevronDown, RefreshCw, Loader2, Download, Trash2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useState } from 'react';

export function RightSidebar() {
  const {
    rightSidebarTab,
    seeds,
    frameworks,
    styles,
    roleDefinition,
    setRoleDefinition,
    frameworkSearch,
    setFrameworkSearch,
    generateSeeds,
    insertSeed,
    isAILoading,
    aiConfig,
    exportDocument,
    addFramework,
    deleteFramework,
    addStyle,
    deleteStyle,
  } = useApp();

  const [stylesExpanded, setStylesExpanded] = useState(true);
  const [exportExpanded, setExportExpanded] = useState(false);
  const [showAddFramework, setShowAddFramework] = useState(false);
  const [showAddStyle, setShowAddStyle] = useState(false);
  const [newFramework, setNewFramework] = useState({ name: '', subtitle: '', description: '', prompt: '' });
  const [newStyle, setNewStyle] = useState({ authorName: '', preview: '', systemPrompt: '' });
  const [editingRole, setEditingRole] = useState(false);

  const getSeedTypeLabel = (type: string) => {
    switch (type) {
      case 'similar': return 'Similar';
      case 'related': return 'Related';
      case 'challenge': return 'Challenge';
      case 'extend': return 'Extend';
      default: return type;
    }
  };

  const filteredFrameworks = frameworks.filter(f =>
    f.name.toLowerCase().includes(frameworkSearch.toLowerCase()) ||
    f.description.toLowerCase().includes(frameworkSearch.toLowerCase())
  );

  const handleAddFramework = () => {
    if (newFramework.name && newFramework.description) {
      addFramework(newFramework);
      setNewFramework({ name: '', subtitle: '', description: '', prompt: '' });
      setShowAddFramework(false);
    }
  };

  const handleAddStyle = () => {
    if (newStyle.authorName && newStyle.preview) {
      addStyle(newStyle);
      setNewStyle({ authorName: '', preview: '', systemPrompt: '' });
      setShowAddStyle(false);
    }
  };

  if (rightSidebarTab === 'seeds') {
    return (
      <aside className="w-80 bg-sidebar-bg border-l border-border flex flex-col h-full overflow-hidden">
        {/* Generate seeds button */}
        <div className="p-4 border-b border-border">
          <button
            onClick={generateSeeds}
            disabled={!aiConfig.apiKey || isAILoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAILoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {isAILoading ? 'Generating...' : 'Generate Seeds'}
          </button>
          {!aiConfig.apiKey && (
            <p className="text-xs text-text-muted mt-2 text-center">Configure API key in Settings</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {seeds.length === 0 ? (
            <div className="text-center text-text-muted py-8">
              <p className="text-sm">No seeds yet</p>
              <p className="text-xs mt-1">Generate seeds based on your content and context</p>
            </div>
          ) : (
            seeds.map(seed => (
              <div key={seed.id} className="bg-panel-bg rounded-lg p-3">
                <div className="text-xs text-text-muted mb-1">
                  {getSeedTypeLabel(seed.type)}: {seed.filename}.{seed.filetype}
                </div>
                <p className="text-sm text-white leading-relaxed mb-3">
                  {seed.preview}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => insertSeed(seed)}
                    className="px-3 py-1 text-xs bg-accent text-white rounded hover:bg-opacity-80"
                  >
                    + Insert
                  </button>
                  <button className="px-3 py-1 text-xs text-text-secondary hover:text-white border border-border rounded">
                    ↻ Replace
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
            ))
          )}
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
            <ChevronDown
              size={16}
              className={`text-text-secondary transition-transform ${exportExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          {exportExpanded && (
            <div className="px-4 pb-3 flex gap-2">
              <button
                onClick={() => exportDocument('md')}
                className="flex-1 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-border rounded flex items-center justify-center gap-1"
              >
                <Download size={12} /> .md
              </button>
              <button
                onClick={() => exportDocument('txt')}
                className="flex-1 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-border rounded flex items-center justify-center gap-1"
              >
                <Download size={12} /> .txt
              </button>
              <button
                onClick={() => exportDocument('html')}
                className="flex-1 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-border rounded flex items-center justify-center gap-1"
              >
                <Download size={12} /> .html
              </button>
            </div>
          )}
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
            <button
              onClick={() => setShowAddFramework(true)}
              className="p-2 text-text-secondary hover:text-white"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Add framework form */}
        {showAddFramework && (
          <div className="p-4 border-b border-border bg-panel-bg space-y-2">
            <input
              type="text"
              value={newFramework.name}
              onChange={(e) => setNewFramework({ ...newFramework, name: e.target.value })}
              placeholder="Framework name"
              className="w-full bg-sidebar-bg text-white text-sm px-3 py-2 rounded outline-none"
            />
            <input
              type="text"
              value={newFramework.subtitle}
              onChange={(e) => setNewFramework({ ...newFramework, subtitle: e.target.value })}
              placeholder="Subtitle (optional)"
              className="w-full bg-sidebar-bg text-white text-sm px-3 py-2 rounded outline-none"
            />
            <textarea
              value={newFramework.description}
              onChange={(e) => setNewFramework({ ...newFramework, description: e.target.value })}
              placeholder="Description"
              rows={2}
              className="w-full bg-sidebar-bg text-white text-sm px-3 py-2 rounded outline-none resize-none"
            />
            <textarea
              value={newFramework.prompt}
              onChange={(e) => setNewFramework({ ...newFramework, prompt: e.target.value })}
              placeholder="AI prompt (optional)"
              rows={2}
              className="w-full bg-sidebar-bg text-white text-sm px-3 py-2 rounded outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddFramework}
                className="flex-1 px-3 py-1.5 text-xs bg-accent text-white rounded"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddFramework(false)}
                className="px-3 py-1.5 text-xs text-text-secondary border border-border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredFrameworks.map(framework => (
            <div key={framework.id} className="bg-panel-bg rounded-lg p-3 group">
              <div className="flex items-start justify-between">
                <div className="text-sm text-white font-medium mb-1">
                  {framework.name} {framework.subtitle && <span className="text-text-muted">({framework.subtitle})</span>}
                </div>
                <button
                  onClick={() => deleteFramework(framework.id)}
                  className="p-1 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
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
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddStyle(true);
                  setStylesExpanded(true);
                }}
                className="p-1 text-text-secondary hover:text-white"
              >
                <Plus size={14} />
              </button>
              <ChevronDown
                size={16}
                className={`text-text-secondary transition-transform ${stylesExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </button>
          {stylesExpanded && (
            <div className="px-4 pb-4 space-y-3">
              {showAddStyle && (
                <div className="bg-panel-bg rounded-lg p-3 space-y-2">
                  <input
                    type="text"
                    value={newStyle.authorName}
                    onChange={(e) => setNewStyle({ ...newStyle, authorName: e.target.value })}
                    placeholder="Author/Style name"
                    className="w-full bg-sidebar-bg text-white text-sm px-3 py-2 rounded outline-none"
                  />
                  <textarea
                    value={newStyle.preview}
                    onChange={(e) => setNewStyle({ ...newStyle, preview: e.target.value })}
                    placeholder="Style description"
                    rows={2}
                    className="w-full bg-sidebar-bg text-white text-sm px-3 py-2 rounded outline-none resize-none"
                  />
                  <textarea
                    value={newStyle.systemPrompt}
                    onChange={(e) => setNewStyle({ ...newStyle, systemPrompt: e.target.value })}
                    placeholder="System prompt for AI"
                    rows={2}
                    className="w-full bg-sidebar-bg text-white text-sm px-3 py-2 rounded outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddStyle} className="flex-1 px-3 py-1.5 text-xs bg-accent text-white rounded">
                      Add
                    </button>
                    <button onClick={() => setShowAddStyle(false)} className="px-3 py-1.5 text-xs text-text-secondary border border-border rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {styles.map(style => (
                <div key={style.id} className="bg-panel-bg rounded-lg p-3 group">
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-text-muted mb-1">{style.authorName}</div>
                    <button
                      onClick={() => deleteStyle(style.id)}
                      className="p-1 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-sm text-white leading-relaxed mb-3">
                    {style.preview}
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-xs text-text-secondary hover:text-white border border-border rounded">
                      + Apply to selection
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
            <ChevronDown
              size={16}
              className={`text-text-secondary transition-transform ${exportExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          {exportExpanded && (
            <div className="px-4 pb-3 flex gap-2">
              <button onClick={() => exportDocument('md')} className="flex-1 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-border rounded">
                .md
              </button>
              <button onClick={() => exportDocument('txt')} className="flex-1 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-border rounded">
                .txt
              </button>
              <button onClick={() => exportDocument('html')} className="flex-1 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-border rounded">
                .html
              </button>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // Role tab
  return (
    <aside className="w-80 bg-sidebar-bg border-l border-border flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <span className="text-sm text-white font-medium">Role Definition</span>
        <button
          onClick={() => setEditingRole(!editingRole)}
          className="text-xs text-text-secondary hover:text-white"
        >
          {editingRole ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {editingRole ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted block mb-1">Role Thesis</label>
              <textarea
                value={roleDefinition.thesis}
                onChange={(e) => setRoleDefinition({ ...roleDefinition, thesis: e.target.value })}
                rows={4}
                className="w-full bg-panel-bg text-white text-sm px-3 py-2 rounded outline-none resize-none"
                placeholder="Define the core role..."
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Operating Model</label>
              <textarea
                value={roleDefinition.operatingModel}
                onChange={(e) => setRoleDefinition({ ...roleDefinition, operatingModel: e.target.value })}
                rows={4}
                className="w-full bg-panel-bg text-white text-sm px-3 py-2 rounded outline-none resize-none"
                placeholder="How does this role operate..."
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Deliverables</label>
              <textarea
                value={roleDefinition.deliverables}
                onChange={(e) => setRoleDefinition({ ...roleDefinition, deliverables: e.target.value })}
                rows={4}
                className="w-full bg-panel-bg text-white text-sm px-3 py-2 rounded outline-none resize-none"
                placeholder="What outputs are expected..."
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Method Stack</label>
              <textarea
                value={roleDefinition.methodStack}
                onChange={(e) => setRoleDefinition({ ...roleDefinition, methodStack: e.target.value })}
                rows={4}
                className="w-full bg-panel-bg text-white text-sm px-3 py-2 rounded outline-none resize-none"
                placeholder="Methods and processes..."
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Influences</label>
              <textarea
                value={roleDefinition.influences}
                onChange={(e) => setRoleDefinition({ ...roleDefinition, influences: e.target.value })}
                rows={4}
                className="w-full bg-panel-bg text-white text-sm px-3 py-2 rounded outline-none resize-none"
                placeholder="Key influences and references..."
              />
            </div>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            {roleDefinition.thesis ? (
              <>
                <h2 className="text-sm font-semibold text-white mb-2">## Role thesis</h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">
                  {roleDefinition.thesis}
                </p>
              </>
            ) : null}

            {roleDefinition.operatingModel ? (
              <>
                <h2 className="text-sm font-semibold text-white mb-2">## Operating model</h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">
                  {roleDefinition.operatingModel}
                </p>
              </>
            ) : null}

            {roleDefinition.deliverables ? (
              <>
                <h2 className="text-sm font-semibold text-white mb-2">## Deliverables</h2>
                <div className="text-sm text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">
                  {roleDefinition.deliverables}
                </div>
              </>
            ) : null}

            {roleDefinition.methodStack ? (
              <>
                <h2 className="text-sm font-semibold text-white mb-2">## Method stack</h2>
                <div className="text-sm text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">
                  {roleDefinition.methodStack}
                </div>
              </>
            ) : null}

            {roleDefinition.influences ? (
              <>
                <h2 className="text-sm font-semibold text-white mb-2">## Influences</h2>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {roleDefinition.influences}
                </p>
              </>
            ) : null}

            {!roleDefinition.thesis && !roleDefinition.operatingModel && !roleDefinition.deliverables && (
              <div className="text-center text-text-muted py-8">
                <p className="text-sm">No role defined yet</p>
                <p className="text-xs mt-1">Click Edit to define your role</p>
              </div>
            )}
          </div>
        )}
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
          <ChevronDown
            size={16}
            className={`text-text-secondary transition-transform ${exportExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        {exportExpanded && (
          <div className="px-4 pb-3 flex gap-2">
            <button onClick={() => exportDocument('md')} className="flex-1 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-border rounded">
              .md
            </button>
            <button onClick={() => exportDocument('txt')} className="flex-1 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-border rounded">
              .txt
            </button>
            <button onClick={() => exportDocument('html')} className="flex-1 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-border rounded">
              .html
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
