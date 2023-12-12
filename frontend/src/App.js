import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home'

function App() {
  return (
      <div>
    <Router>
      <Routes>
        <Route path="/" element={<Signin/>}/>
        <Route path="/SignUp" element={<Signup/>}/>
        <Route path="Home" element={<Home/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;