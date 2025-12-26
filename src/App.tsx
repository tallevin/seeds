import { AppProvider } from './store/AppContext';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { Editor } from './components/Editor';
import { RightSidebar } from './components/RightSidebar';
import './index.css';

function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen bg-app-bg text-white overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <Editor />
          <RightSidebar />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
