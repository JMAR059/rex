import { MarkGithubIcon } from "@primer/octicons-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-3 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-sm">
          <h4 className="font-medium">R.E.X: Relational Algebra Explorer &copy; 2026</h4>
        </div>
        <div className="flex gap-6 text-sm items-center">
          <a href="https://rcos.io" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 hover:underline hover:text-blue-300 transition-colors">
            An <img src="/rcos.png" alt="RCOS logo" className="h-5 w-auto group-hover:hidden" /><img src="/hyperlinkrcos.png" alt="" aria-hidden="true" className="h-5 w-auto hidden group-hover:inline" /> Project

          </a>
          <span className="text-gray-400">|</span>
          <a href="https://github.com/JMAR059/rex" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline hover:text-blue-300 transition-colors">
            Github <MarkGithubIcon size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
