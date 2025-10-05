import {useState} from 'react';
//TODO: Move this somewhere else
export const addToHistory = (query:string, resp: {result:string}) =>{
  return null;
};


interface HistoyProps {
}

const HistoryBody: React.FC<HistoyProps> = ({}) => {
    const [history, setHistory] = useState<string>('History appear here');
    return (
    <div>
        {history}
    </div>
    );
};

export default HistoryBody;