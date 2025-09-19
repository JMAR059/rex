import dinoASCII from '/dinoASCII.png';

interface NavbarProps {
}

const wikiUrl = "https://github.com/JMAR059/rex/wiki"

const onWikiClick = () => {
    window.location.href = wikiUrl
}

const Navbar: React.FC<NavbarProps> = ({ 
}) => {
  return (
    <nav>
        <div className="bg-gray-500">
            <div className="flex items-center m-2" >
                <a href="/">
                    <img 
                    src={dinoASCII} 
                    alt="Dino" 
                    style={{ width: '225px', height: '125px' }} 
                    />
                </a>
                
                <h1>
                    REX - Relational Algebra Explorer
                </h1>
                <button className="Wiki ml-auto" onClick={onWikiClick}>
                    wiki🌐
                </button>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;