import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Signin from './pages/Signin';
import QuillSetup from './components/QuillSetup';
import Signup from './pages/Signup';
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin/>}/>
        <Route path="/signUp" element={<Signup/>}/>
        <Route path="home" element={<Home/>}/>
        <Route path="/quill-setup/:docId" element={<QuillSetup/>} />
      </Routes>
    </Router>
 
  );
}

export default App;