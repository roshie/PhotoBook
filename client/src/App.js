import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./bootstrap.css";
import "./App.css";

import { AlbumPropLoader } from "./pages/Album";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import CreateAlbum from "./pages/CreateAlbum";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/album/:id" component={AlbumPropLoader} />
          <Route exact path="/" component={Home} />
          <Route exact path="/admin/upload-album" component={CreateAlbum} />
          <Route exact path="/404" component={Error404} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
