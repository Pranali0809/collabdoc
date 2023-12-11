import './App.css';
import {BrowserRouter as Router,Route} from "react-router-dom";
import Signin from './pages/Signin';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Route path="/" component={<Signin/>}/>
      <Route path="/SignUp" component={<Signup/>}/>
      <Route path="Home" component={Home}/>
    </Router>
  );
}

export default App;
