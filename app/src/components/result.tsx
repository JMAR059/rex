import {useState} from 'react';

//TODO: Move this somewhere else
export const replaceResult = (resp: {result:string}) =>{
  return null;
};

interface ResultProps {
    result: string
}

const ResultBody: React.FC<ResultProps> = ({result}) => {
    return (
    <div>
        {result}
    </div>
    );
};

export default ResultBody;