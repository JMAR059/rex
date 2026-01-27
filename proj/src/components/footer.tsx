const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-3 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-sm">
          <h4 className="font-medium">R.E.X: Relational Algebra Explorer &copy; 2025</h4>
        </div>
        <div className="flex gap-6 text-sm items-center">
          <a href="https://rcos.io" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-300 transition-colors">
            An RCOS Project
          </a>
          <span className="text-gray-400">|</span>
          <a href="https://github.com/JMAR059/rex" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-300 transition-colors">
            Github
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
