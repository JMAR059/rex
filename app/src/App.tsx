import './App.css'
import { useState } from 'react';
import Navbar from './components/navbar';
import QueryBody from './components/body';
import Footer from './components/footer';

const App: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showSymbols, setShowSymbols] = useState(true);

  // Simple handlers for result display (can be enhanced later)
  const replaceResult = (resp: {result: string}) => {
    console.log('Result:', resp.result);
  };

  const addToHistory = (query: string, resp: {result: string}) => {
    console.log('Query:', query);
    console.log('Result:', resp.result);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        showGuide={showGuide}
        onCloseGuide={() => setShowGuide(false)}
        onToggleGuide={() => setShowGuide((visible) => !visible)}
        showSymbols={showSymbols}
        onToggleSymbols={() => setShowSymbols((visible) => !visible)}
      />
      <QueryBody
        replaceResult={replaceResult}
        addToHistory={addToHistory}
        showSymbols={showSymbols}
        showGuide={showGuide}
      />
      <Footer></Footer>
    </div>
  );
}

export default App;