import { useState, useEffect } from "react";
import Layout from "../Components/Layout";

export default function UploadAlbum() {
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

  const uploadMultipleFiles = () => {};

  return (
    <Layout>
      <div className="row mt-5">
        <div className="m-auto p-5 border border-dark rounded light-shadow text-light w-75">
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
            <div className="h6 mt-3">Album Size</div>
            <div className="row justify-content-center">
              <div className="col-12 col-md-4 m-1">
                <input
                  type="number"
                  name="email"
                  id="email"
                  placeholder="Width (in Pixels)"
                  className="form-control bg-dark text-light"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="col-12 col-md-4 m-1">
                <input
                  type="number"
                  name="email"
                  id="email"
                  placeholder="Height (in Pixels)"
                  className="form-control bg-dark text-light"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>

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

            <div className="h6 mt-3">Upload Album Images</div>
            <div className="row d-flex justify-content-center">
              <div className="col-12 col-md-5 border border-light rounded m-2 p-0">
                <label for="imgDrop" className="w-100 h-100 p-0">
                  <input
                    type="file"
                    id="imgDrop"
                    className="h-100 text-black m-5"
                    accept="image/jpg, image/jpeg"
                    onChange={uploadMultipleFiles}
                    multiple
                  />
                </label>
              </div>
              <div className="col-12 col-md-6 border border-dark rounded m-2 text-center text-dark">
                <div className="m-5">No images selected</div>
              </div>
            </div>
            <div className="col-12 border border-dark rounded my-2 p-5">
              image Sequence
            </div>

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
    </Layout>
  );
}
