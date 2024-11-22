import './App.css';
export default function App() {
  return (
    <div className = "Container"> 

     <div className = "Header">
      <h1 className = "Title">
        REX - Relational Algebra Explorer
      </h1>
      <button className = "Wiki">
        wiki🌐
      </button>
     </div>
     <div className = "Calc">
        <h3 className = "Relations">
          Relations
        </h3>
        <textarea
          className="Query"
          placeholder="Type Query Here..."
        />
      </div>
      
      <div className = "Butt">
        <button className = "Execute">Execute Query</button> 
      </div>
    </div>
  );
}    
