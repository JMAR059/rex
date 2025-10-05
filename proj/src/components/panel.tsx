import { useState, useEffect } from 'react';
import CheatSheet from './cheat';
import QueryBody from './query';
import Divider from './divider';
import ResultBody from './result';

const Panels = () => {
  const [panelWidths, setPanelWidths] = useState<number[]>([200, 400, 300]); // Initial widths of the panels
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startWidths, setStartWidths] = useState<number[]>([]);
  const [startIndex, setStartIndex] = useState<number | null>(null); // Index of the panel being resized

  const startResize = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidths([...panelWidths]);
    setStartIndex(index);
  };

  const stopResize = () => {
    setIsResizing(false);
  };

  const onResize = (e: MouseEvent) => {
    if (!isResizing || startIndex === null) return;

    const dx = e.clientX - startX;
    const newPanelWidths = [...startWidths];

    // Adjust widths based on the panel being resized
    if (startIndex === 0) {
      newPanelWidths[0] = Math.max(50, newPanelWidths[0] + dx); // Minimum width 50px
      newPanelWidths[1] = Math.max(50, newPanelWidths[1] - dx); // Minimum width 50px
    } else if (startIndex === 1) {
      newPanelWidths[1] = Math.max(50, newPanelWidths[1] + dx); // Minimum width 50px
      newPanelWidths[2] = Math.max(50, newPanelWidths[2] - dx); // Minimum width 50px
    } else if (startIndex === 2) {
      newPanelWidths[2] = Math.max(50, newPanelWidths[2] + dx); // Minimum width 50px
      newPanelWidths[1] = Math.max(50, newPanelWidths[1] - dx); // Minimum width 50px
    }

    setPanelWidths(newPanelWidths);
    setStartX(e.clientX);
  };

  // Effect to handle mouse move and mouse up events for resizing
  useEffect(() => {
    if (isResizing) {
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', onResize);
      window.addEventListener('mouseup', stopResize);
    } else {
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onResize);
      window.removeEventListener('mouseup', stopResize);
    }

    return () => {
      window.removeEventListener('mousemove', onResize);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [isResizing]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Divider 1 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <div
          style={{
            width: `${panelWidths[0]}px`,
            padding: '10px',
            boxSizing: 'border-box',
          }}
        >
          <CheatSheet></CheatSheet>
        </div>

        <Divider onMouseDown={startResize} index={0} />

        <div
          style={{
            width: `${panelWidths[1]}px`,
            padding: '10px',
            boxSizing: 'border-box',
          }}
        >
          <ResultBody></ResultBody>
        </div>

        <Divider onMouseDown={startResize} index={1} />

        <div className=""
          style={{
            width: `${panelWidths[2]}px`,
            padding: '10px',
            boxSizing: 'border-box',
          }}
        >
          <QueryBody></QueryBody>
        </div>
      </div>
    </div>
  );
};

export default Panels;
