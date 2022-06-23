import {
  getAuth,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { AdminEmail } from "../globals";
import Layout from "./Layout";

export default function CreateAlbum() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;

    if (user != null && user.email == AdminEmail) {
      console.log(user);
      setAuthenticated(true);
    }
  }, []);

  const login = () => {
    setLoading(true);
    setAuthenticated(false);
    setError(false);
    setPasswordError(false);
    if (email.trim() == AdminEmail) {
      setPersistence(auth, browserSessionPersistence).then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            setAuthenticated(true);
            setLoading(false);
            const user = userCredential.user;
            console.log("Success");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setPasswordError(true);
            setAuthenticated(false);
            setLoading(false);
            console.log(errorMessage);
          });
      });
    } else {
      setError(true);
      setLoading(false);
    }
  };

  if (!authenticated) {
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
    return (
      <Layout>
        <UploadAlbum />
      </Layout>
    );
  }
}

const UploadAlbum = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passCode, setPasscode] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [requirePasscode, setRequirePasscode] = useState(false);

  const createAlbum = () => {
    setLoading(true);
    setLoading(false);
  };

  useEffect(() => {
    if (requirePasscode) setPasscode("");
    if (
      name != "" &&
      email != "" &&
      (!requirePasscode || (requirePasscode && passCode != ""))
    )
      setDisabled(false);
    else setDisabled(true);
  }, [name, email, passCode, requirePasscode]);

  return (
    <div className="row min-vh-100">
      <div className="m-auto p-4 border border-dark rounded light-shadow text-light w-75">
        <h4 className="font-weight-bold">Upload Album</h4>
        <form>
          <div className="h6 mt-3">Album Name</div>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="eg. John Doe + Marie's Wedding Album"
            className="form-control mt-3 mb-2 bg-dark text-light"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <div className="h6 mt-3">Customer Email</div>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="email"
            className="form-control mt-3 mb-2 bg-dark text-light"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <div className="form-group form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              style={{ transform: "scale(1.5)" }}
              value={requirePasscode}
              onChange={(e) => {
                setRequirePasscode(e.target.checked);
              }}
            />
            <label className="form-check-label" for="exampleCheck1">
              Require Passcode
            </label>
          </div>
          {requirePasscode && (
            <>
              <div className="h6 mt-3">Album Passcode</div>
              <input
                type="password"
                name="name"
                id="password"
                placeholder=""
                className="form-control mt-3 mb-2 bg-dark text-light"
                onChange={(e) => {
                  setPasscode(e.target.value);
                }}
              />
            </>
          )}
          <button
            onClick={createAlbum}
            disabled={disabled}
            class={`btn btn-pink text-light my-2 w-auto ${
              loading ? "d-none" : ""
            }`}
          >
            Create
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
  );
};
