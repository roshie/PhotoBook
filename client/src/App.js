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
import Error404 from "./pages/Components/Error404";
import Admin from "./pages/Admin/Admin";
import UploadAlbum from "./pages/Admin/UploadAlbum";
import ModifyAlbum from "./pages/Admin/ModifyAlbum";
import PrivateRoute from "./pages/Admin/PrivateRoute";
import routes from "./pages/routes";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path={routes.Home} component={Home} title="Home" />
          <Route
            exact
            path={routes.Album}
            component={AlbumPropLoader}
            title="Album"
          />
          <Route exact path={routes.Admin} component={Admin} title="Admin" />
          <PrivateRoute
            exact
            path={routes.UploadAlbum}
            component={UploadAlbum}
            title="UploadAlbum"
          />
          <PrivateRoute
            exact
            path={routes.ModifyAlbum}
            component={ModifyAlbum}
            title="ModifyAlbum"
          />
          <Route
            exact
            path={routes.Error404}
            component={Error404}
            title="Error404"
          />
          <Redirect to={routes.Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
