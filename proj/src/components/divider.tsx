interface DividerProps {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
  index: number;
}

const Divider: React.FC<DividerProps> = ({ onMouseDown, index }) => {
  return (
    <div
      className="w-2 cursor-ew-resize"
      style={{
        background: '#888',
      }}
      onMouseDown={(e) => onMouseDown(index, e)}
    />
  );
};

export default Divider;
