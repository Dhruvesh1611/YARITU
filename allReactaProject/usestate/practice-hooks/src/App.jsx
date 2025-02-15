import { useState } from 'react'
import './App.css' 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>  
        <h1>hello</h1>
      </div>
      <div className='practice'>
      <div >the count is {count}<br />
      <button onClick={()=>{setCount(count+1)}}>add</button>
      <button onClick={()=>{setCount(count-1)}}>minus</button>
      </div>
      </div>
    </>
  )
}

export default App
