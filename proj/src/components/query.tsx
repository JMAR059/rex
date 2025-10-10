import { useState } from 'react';

interface QueryProps {
  replaceResult: (resp: {result: string}) => void;
  addToHistory: (query: string, resp:{result: string}) => void;
  
}

const executeQuery = (query: string) => {
  //Right now this just echos back the query, in the future it should call some api
  return {"result": query};
}

const handleOnClick = (query: string, replaceResult: QueryProps['replaceResult'], addToHistory: QueryProps['addToHistory']) => {
  //Ok so we want to execute the query, then receive the response 
  const resp = executeQuery(query);
  // and store it in the results
  replaceResult(resp);
  //We then want to save the query as a new element in the left bar, the history
  addToHistory(query, resp);
};

const QueryBody: React.FC<QueryProps> = ({ replaceResult, addToHistory }) => {
  const [query, setQuery] = useState<string>('');
  return (
    <div className="flex flex-col">
        <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)} 
        className="w-full h-36 p-2 border rounded-md">
            Input here
        </textarea>
        <button 
        onClick={() => handleOnClick(query, replaceResult, addToHistory)}
        type="button"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md self-end hover:bg-blue-700">
            Submit
        </button>
    </div>
  );
};

export default QueryBody;