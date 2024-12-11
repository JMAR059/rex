import './App.css'
import dinoASCII from '/dinoASCII.png';

function App() {
  const onWikiClick = () => {
    window.location.href = 'https://github.com/JMAR059/rex/wiki'
  };

  return (
    <div className = "Container"> 

     <div className = "Header">
      <h1 className = "Title">
        REX - Relational Algebra Explorer
      </h1>
      <button className = "Wiki" onClick={onWikiClick}>
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

      <div className = "cheatDino">
        <h4 className = "Cheat">
          <ul className = "List1">
            <p>Cheat-Sheet: </p>
            <li>\union -{'>'} "∨"</li>
            <li>\intersect -{'>'} "∧"</li>
            <li>\select -{'>'} "σ"</li>
            <li>\project -{'>'} "π"</li>
            <li>\cart -{'>'} "⨯"</li>
          </ul>
          <ul className = "List2">
            <li>\join -{'>'} “⨝”</li>
            <li>{'<'}= -{'>'}“≤”</li>         
            <li>{'>'}= -{'>'}“≥”</li>  
            <li>!= -{'>'}“≠”</li>               
            </ul>
        </h4>
        {/* <h5 className = "Dino">
                            
        </h5> */}
        <img src={dinoASCII} alt="Dino"  style={{ width: '225px', height: '125px' }}/>
      </div>
    </div>
  )
}

export default App
