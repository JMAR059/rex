import './App.css'
import { useState } from 'react';
import Navbar from './components/navbar';
import QueryBody from './components/body';
import Wiki from './components/wiki';
import Footer from './components/footer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'wiki'>('calculator');

  // Simple handlers for result display (can be enhanced later)
  const replaceResult = (resp: {result: string}) => {
    console.log('Result:', resp.result);
  };

  const addToHistory = (query: string, resp: {result: string}) => {
    console.log('Query:', query);
    console.log('Result:', resp.result);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab}></Navbar>
      {activeTab === 'calculator' ? (
        <QueryBody replaceResult={replaceResult} addToHistory={addToHistory}></QueryBody>
      ) : (
        <Wiki />
      )}
      <Footer></Footer>
    </div>
  );
}

export default App;