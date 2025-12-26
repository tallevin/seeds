import { useState } from 'react';
import { AppProvider } from './store/AppContext';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { Editor } from './components/Editor';
import { RightSidebar } from './components/RightSidebar';
import { SettingsModal } from './components/SettingsModal';
import './index.css';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppProvider>
      <div className="flex flex-col h-screen bg-app-bg text-white overflow-hidden">
        <Header onOpenSettings={() => setSettingsOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <Editor />
          <RightSidebar />
        </div>
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </AppProvider>
  );
}

export default App;
