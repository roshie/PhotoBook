import {
  getAuth,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { AdminEmail } from "../../globals";
import Layout from "../Components/Layout";
import routes from "../routes";

export default function Admin(props) {
  const [user, setUser] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [PreviousPage, setPreviousPage] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    document.title = "Admin | Gravity Studio";
    const _user = auth.currentUser;
    setUser(_user);
    setPreviousPage(new URLSearchParams(props.location.search).get("page"));
    // eslint-disable-next-line
  }, []);

  const login = () => {
    setLoading(true);
    setError(false);
    setPasswordError(false);
    if (email.trim() === AdminEmail) {
      setPersistence(auth, browserSessionPersistence).then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            setLoading(false);
            const user = userCredential.user;
            setUser(user);
            console.log("Success");
          })
          .catch((error) => {
            const errorMessage = error.message;
            setPasswordError(true);
            setUser(null);
            setLoading(false);
            console.log(errorMessage);
          });
      });
    } else {
      setError(true);
      setLoading(false);
    }
  };

  if (user == null) {
    return (
      <Layout>
        <div className="row h-75">
          <div className="m-auto border border-dark rounded text-gray light-shadow p-5">
            <h4 className="font-weight-bold">Authentication</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
            >
              <div className="h6 mt-3">Email</div>
              <input
                type="email"
                name="code"
                id="email"
                className="form-control mt-1 mb-2 bg-dark text-light"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <small
                class={`form-text mb-3 text-muted ${error ? "" : "d-none"}`}
              >
                Invalid Email
              </small>

              <div className="h6 mt-3">Password</div>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control mt-1 mb-2 bg-dark text-light"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <small
                class={`form-text mb-3 text-muted ${
                  passwordError ? "" : "d-none"
                }`}
              >
                The Password is incorrect.
              </small>
              <button
                type="submit"
                class={`btn btn-pink text-light my-2 w-auto ${
                  loading ? "d-none" : ""
                }`}
              >
                Login
              </button>
              <div class={`lds-ring ${loading ? "" : "d-none"}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    );
  } else {
    if (PreviousPage != null) {
      return <Redirect to={routes[PreviousPage]} />;
    } else return <AdminHome />;
  }
}

const AdminHome = () => {
  const history = useHistory();

  const redirect = (page) => {
    history.push(routes[page]);
  };

  return (
    <Layout>
      <div className="row mt-5">
        <div className="col-8 mx-auto">
          <h4 className="font-weight-bold text-light text-center">
            Welcome Back!{" "}
          </h4>
          <div className="row my-5 d-flex justify-content-center">
            <div
              className="col-12 col-md-4 m-5 border border-dark rounded light-shadow p-3 text-gray gradient-on-hover text-center"
              onClick={() => {
                redirect("UploadAlbum");
              }}
            >
              Upload Album
            </div>
            <div
              className="col-12 col-md-4 m-5 border border-dark rounded light-shadow p-3 text-gray gradient-on-hover text-center"
              onClick={() => {
                redirect("ModifyAlbum");
              }}
            >
              Modify Album (Disabled)
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
