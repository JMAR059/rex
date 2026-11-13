import dinoImg from '/dino.png';

interface NavbarProps {
  activeTab: 'calculator' | 'wiki';
  setActiveTab: (tab: 'calculator' | 'wiki') => void;
  showSymbols: boolean;
  onToggleSymbols: () => void;
}

const guideUrl = "https://github.com/JMAR059/rex/guide"

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, showSymbols, onToggleSymbols }) => {
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
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=VT323&display=swap');`}</style>
        <div className="bg-[#7A4A23] border-b-[5px] border-[#3A2814]">
            <div className="flex items-stretch">
                <a href="/" onClick={onLogoClick} className="w-72 shrink-0 flex items-center justify-center py-2 bg-[#666347] border-r-[5px] border-[#3A2814]">
                    <img
                    src={dinoImg}
                    alt="Dino"
                    style={{ width: '113px', height: '113px' }}
                    />
                </a>
                <div className="flex items-center gap-8 px-9">
                    <h1 className="font-['VT323',monospace] text-5xl uppercase tracking-widest text-[#FFFDB1] [text-shadow:3px_3px_0_#3A2814]">
                        R.E.X. - Relational Algebra Explorer
                    </h1>
                    <div className="flex gap-4 font-['Space_Mono',monospace] font-bold uppercase tracking-wider text-sm text-[#3A2814]">
                        <button
                            onClick={onCalculatorClick}
                            className={`px-5 py-2.5 border-[3px] border-[#3A2814] rounded-none shadow-[4px_4px_0_#3A2814] cursor-pointer transition-[transform,box-shadow] duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none ${
                                activeTab === 'calculator' ? 'bg-[#FFFDB1]' : 'bg-[#C4A76B] hover:bg-[#FFFDB1]'
                            }`}
                        >
                            Calculator
                        </button>
                        <button
                            onClick={onGuideClick}
                            className={`px-5 py-2.5 border-[3px] border-[#3A2814] rounded-none shadow-[4px_4px_0_#3A2814] cursor-pointer transition-[transform,box-shadow] duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none ${
                                activeTab === 'wiki' ? 'bg-[#FFFDB1]' : 'bg-[#C4A76B] hover:bg-[#FFFDB1]'
                            }`}
                        >
                            Guide
                        </button>
                        <button
                            type="button"
                            onClick={onToggleSymbols}
                            aria-pressed={showSymbols}
                            className={`px-5 py-2.5 border-[3px] border-[#3A2814] rounded-none shadow-[4px_4px_0_#3A2814] cursor-pointer transition-[transform,box-shadow] duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none ${
                                showSymbols ? 'bg-[#FFFDB1]' : 'bg-[#C4A76B] hover:bg-[#FFFDB1]'
                            }`}
                        >
                            Symbols
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;