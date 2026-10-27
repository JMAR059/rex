import dinoImg from '/dino.png';

interface NavbarProps {
  activeTab: 'calculator' | 'wiki';
  setActiveTab: (tab: 'calculator' | 'wiki') => void;
}

const guideUrl = "https://github.com/JMAR059/rex/guide"

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const onCalculatorClick = () => {
    setActiveTab('calculator');
  };

  const onGuideClick = () => {
    setActiveTab('wiki');
  };

  const onLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (window.confirm('This will refresh the page clear tables and history, are you sure you want to refresh?')) {
      window.location.reload();
    }
  };

  return (
    <nav>
        <div className="bg-gray-500">
            <div className="flex items-center py-2">
                <div className="flex items-center gap-4">
                    <a href="/" onClick={onLogoClick} className="w-64 shrink-0 flex justify-center">
                        <img 
                        src={dinoImg}
                        alt="Dino" 
                        style={{ width: '113px', height: '113px' }}
                        />
                    </a>
                    
                    <h1 className="text-2xl font-semibold">
                        R.E.X. - Relational Algebra Explorer
                    </h1>
                </div>
                <div className="flex gap-4 ml-8">
                    <button
                        onClick={onCalculatorClick}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'calculator'
                                ? 'bg-white text-gray-800 font-semibold'
                                : 'bg-gray-400 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Calculator
                    </button>
                    <button
                        onClick={onGuideClick}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'wiki'
                                ? 'bg-white text-gray-800 font-semibold'
                                : 'bg-gray-400 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Guide
                    </button>
                </div>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;