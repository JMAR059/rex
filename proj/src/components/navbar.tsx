import dinoASCII from '/dinoASCII.png';

interface NavbarProps {
  activeTab: 'calculator' | 'Guide';
  setActiveTab: (tab: 'calculator' | 'Guide') => void;
}

const guideUrl = "https://github.com/JMAR059/rex/guide"

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const onCalculatorClick = () => {
    setActiveTab('calculator');
  };

  const onGuideClick = () => {
    setActiveTab('Guide');
  };

  return (
    <nav>
        <div className="bg-gray-500">
            <div className="flex items-center m-2" >
                <div className="flex items-center gap-4">
                    <a href="/">
                        <img 
                        src={dinoASCII} 
                        alt="Dino" 
                        style={{ width: '225px', height: '125px' }} 
                        />
                    </a>
                    
                    <h1 className="text-2xl font-semibold">
                        REX - Relational Algebra Explorer
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
                            activeTab === 'Guide'
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