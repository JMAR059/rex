import './App.css'
import Navbar from './components/navbar';

const App: React.FC = () => {
  const onWikiClick = () => {
    window.location.href = 'https://github.com/JMAR059/rex/wiki';
  };

  return (
    <div>
      <Navbar></Navbar>
      <div>
        <button className="Execute">Execute Query</button>
      </div>
    </div>
  );
}

export default App;