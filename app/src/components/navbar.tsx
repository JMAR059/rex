import dinoImg from '/dino.png';
import * as React from "react";

interface NavbarProps {
  showGuide: boolean;
  onCloseGuide: () => void;
  onToggleGuide: () => void;
  showSymbols: boolean;
  onToggleSymbols: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ showGuide, onToggleGuide, showSymbols, onToggleSymbols }) => {
  const onLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (window.confirm('This will refresh the page clear tables and history, are you sure you want to refresh?')) {
      window.location.reload();
    }
  };

  return (
    <nav>
        <div className="bg-header border-b-[length:var(--border-heavy)] border-ink">
            <div className="flex items-stretch">
                <a href="/" onClick={onLogoClick} className="w-72 shrink-0 flex items-center justify-center py-2 bg-olive border-r-[length:var(--border-heavy)] border-ink">
                    <img
                    src={dinoImg}
                    alt="Dino"
                    style={{ width: '113px', height: '113px' }}
                    />
                </a>
                <div className="flex items-center gap-8 px-9">
                    <h1 className="font-display text-5xl uppercase tracking-widest text-header-fg [text-shadow:3px_3px_0_var(--color-ink)] minimal:[text-shadow:none]">
                        R.E.X. - Relational Algebra Explorer
                    </h1>
                    <div className="flex gap-4 font-body font-bold uppercase tracking-wider text-sm text-ink">
                        <button
                            type="button"
                            onClick={onToggleGuide}
                            aria-pressed={showGuide}
                            aria-controls="guide-panel"
                            className={`px-5 py-2.5 border-[length:var(--border-w)] border-ink rounded-theme shadow-hard cursor-pointer transition-[transform,box-shadow] duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none ${
                                showGuide ? 'bg-paper' : 'bg-panel hover:bg-paper'
                            }`}
                        >
                            Guide
                        </button>
                        <button
                            type="button"
                            onClick={onToggleSymbols}
                            aria-pressed={showSymbols}
                            className={`px-5 py-2.5 border-[length:var(--border-w)] border-ink rounded-theme shadow-hard cursor-pointer transition-[transform,box-shadow] duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none ${
                                showSymbols ? 'bg-paper' : 'bg-panel hover:bg-paper'
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