import Sidebar from './components/Sidebar.jsx'
import Homepage from './components/Homepage.jsx'
import './App.css'
function App() {
  return (
    <>
      <div className="main">
        
        <Sidebar />
        <div className="homepage">
          <Homepage/>
          
        </div>
      </div>
    </>
  )
}

export default App
