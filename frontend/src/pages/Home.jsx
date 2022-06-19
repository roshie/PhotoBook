import React from "react";
import { useState } from "react";
import Layout from "./Layout";
import { validateAlbumCode } from "../actions/firestoreActions";

export default function Home() {
  const [albumCode, setAlbumCode] = useState("");
  const [password, setPassword] = useState("");
  const [albumCodeVerified, setAlbumCodeVerified] = useState(false);
  const [isPasswordRequired, setPasswordRequired] = useState(false);
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState(null);

  const goToAlbum = (e) => {
    //
    setPasswordError(false);
  };

  const verifyCode = (e) => {
    setLoading(true);
    if (albumCode !== "") {
      // On album loading, check for
      // if the album id provided in route is valid
      // if not valid, show 404 component,
      // else,
      // check if album id already stored in session, yes, directly show the album
      // else,
      // check if this album is password protected
      // if yes, redirect to home page and prompt them to enter password
      // if no, directly show the album

      // Validating the album code
      validateAlbumCode(albumCode.trim()).then(([isValid, data]) => {
        if (isValid) {
          setAlbumCodeVerified(true);
          if (data.passCode === 1) {
            setPasswordRequired(true);
          } else {
            // Move to next page (Album)
          }
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      });
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="row mt-5">
        <div className="col-12 col-lg-6">
          <div className="m-xl-5 pl-lg-5 m-md-3 text-center text-lg-left">
            <div className="ml-lg-5 text-dark">GRAVITY STUDIO</div>
            <div className="ml-lg-5 py-1 h1 font-weight-bold text-light gradient-text overflow-visible">
              View Your <br />
              Photobook Online.
            </div>
            <div className="mx-5 text-gray">
              We host your Photo Books <br />
              that can be viewed from <br />
              <span className="text-light">Anywhere and at Any device</span>.
            </div>
            <div className="mx-5 mt-3">
              <a class="btn btn-outline-light">Coming Soon</a>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 my-auto pr-lg-5">
          <div className="m-5 mr-lg-5 mt-5 mx-lg-5 px-md-5 px-lg-0">
            <div className="border border-dark rounded p-5 mx-2 mx-md-5 mx-lg-1 text-gray light-shadow">
              <h3>Open With a Photobook Code</h3>
              Enter your Photobook code here
              <br />
              <div className="text-small text-gray my-2">
                Find the Code on backside of your album. If Not Found, Please
                contact your Photography Company.
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  albumCodeVerified && isPasswordRequired
                    ? goToAlbum()
                    : verifyCode();
                }}
              >
                <input
                  type="text"
                  name="code"
                  id="code"
                  className="form-control mt-3 mb-2 bg-dark text-light"
                  onChange={(e) => {
                    e.target.value !== "" && setError(false);
                    setAlbumCode(e.target.value);
                  }}
                />
                <small
                  class={`form-text mb-3 text-muted ${error ? "" : "d-none"}`}
                >
                  Please Enter a Valid Album Code.
                </small>

                {isPasswordRequired && (
                  <>
                    <div className="mt-4">
                      Seems Like this Album Requires a password. Please enter
                      the password.
                    </div>

                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control mt-3 mb-2 bg-dark text-light"
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
                  </>
                )}
              </form>
              {albumCodeVerified && isPasswordRequired ? (
                <button
                  onClick={goToAlbum}
                  class={`btn btn-pink text-light my-2 w-auto ${
                    loading ? "d-none" : ""
                  }`}
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={verifyCode}
                  class={`btn btn-pink text-light my-2 w-auto ${
                    loading ? "d-none" : ""
                  }`}
                >
                  View Photobook
                </button>
              )}
              <div class={`lds-ring ${loading ? "" : "d-none"}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const randomStr = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
