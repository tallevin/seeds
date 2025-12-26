import { X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { aiConfig, setAIConfig } = useApp();
  const [localConfig, setLocalConfig] = useState(aiConfig);

  if (!isOpen) return null;

  const handleSave = () => {
    setAIConfig(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-sidebar-bg border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-white rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              API Key
            </label>
            <input
              type="password"
              value={localConfig.apiKey}
              onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
              placeholder="sk-ant-..."
              className="w-full bg-panel-bg text-white px-3 py-2 rounded outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="text-xs text-text-muted mt-1">
              Your Anthropic API key for AI features
            </p>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Model
            </label>
            <select
              value={localConfig.model}
              onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
              className="w-full bg-panel-bg text-white px-3 py-2 rounded outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fast)</option>
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Balanced)</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus (Powerful)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">
              API Base URL (optional)
            </label>
            <input
              type="text"
              value={localConfig.baseUrl || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
              placeholder="https://api.anthropic.com"
              className="w-full bg-panel-bg text-white px-3 py-2 rounded outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="text-xs text-text-muted mt-1">
              Leave blank to use default Anthropic API
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-accent text-white rounded hover:bg-opacity-80"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
