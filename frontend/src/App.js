import './App.css';
import {BrowserRouter as Router,Route} from "react-router-dom";

function App() {
  return (
    <Router>
      <Route path="/" component={SignIn}/>
      <Route path="/SignUp" component={SignUp}/>
      <Route path="Home" component={Home}/>
    </Router>
  );
}

export default App;
