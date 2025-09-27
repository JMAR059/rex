import './App.css'
import Navbar from './components/navbar';
import SideBar from './components/sidebar';
import QueryBody from './components/query';
import Panels from './components/panel';
const App: React.FC = () => {

  return (
    <div>
      <Navbar></Navbar>
      <Panels></Panels>
    </div>
  );
}

export default App;