import { MarkGithubIcon } from "@primer/octicons-react";
import RcosLogo from "./rcosLogo";

const Footer = () => {
  return (
      <footer className="bg-header text-footer-fg py-3 px-8 mt-auto border-t-[length:var(--border-heavy)] border-ink">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm">
            <h4 className="font-medium">R.E.X. - Relational Algebra Explorer &copy; 2026</h4>
          </div>
          <div className="flex gap-6 text-sm items-center">
            {/* The logo is an inline SVG that uses currentColor, so it changes color
              together with the text when the link is hovered (no second image needed). */}
            <a href="https://rcos.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline hover:text-footer-link transition-colors">
              An <RcosLogo className="h-5 w-auto" /> Project
            </a>
            <span className="text-footer-divider">|</span>
            <a href="https://github.com/JMAR059/rex" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline hover:text-footer-link transition-colors">
              Github <MarkGithubIcon size={16} />
            </a>
          </div>
        </div>
      </footer>
  );
};

export default Footer;