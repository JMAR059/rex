import {useState} from 'react';

//TODO: Move this somewhere else
export const replaceResult = (resp: {result:string}) =>{
  return null;
};

interface ResultProps {
}

const ResultBody: React.FC<ResultProps> = ({}) => {
    const [result, setResult] = useState<string>('Results appear here');
    return (
    <div>
        {result}
    </div>
    );
};

export default ResultBody;