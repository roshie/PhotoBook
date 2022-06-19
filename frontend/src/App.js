import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./bootstrap.css";
import "./App.css";

import Home from "./pages/Home";
import Error404 from "./pages/Error404";
// import AuthRoute from "./pages/AuthRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/album/:id" component={Home} />
          <Route exact path="/" component={Home} />
          <Route exact path="/404" component={Error404} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
