import './App.css'
import Navbar from './components/navbar';
import QueryBody from './components/query';
import Footer from './components/footer';

const App: React.FC = () => {
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
      <Navbar></Navbar>
      <QueryBody replaceResult={replaceResult} addToHistory={addToHistory}></QueryBody>
      <Footer></Footer>
    </div>
  );
}

export default App;