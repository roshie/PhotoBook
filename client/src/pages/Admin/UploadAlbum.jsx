import { useState, useEffect } from "react";
import Layout from "../Components/Layout";

export default function UploadAlbum() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passCode, setPasscode] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(false);
  const [requirePasscode, setRequirePasscode] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [droppedFilesLength, setDroppedFilesLength] = useState(0);
  const [previewImg, setPreviewImg] = useState(null);
  const [previewImgLoading, setPreviewImgLoading] = useState(false);

  const createAlbum = () => {
    setLoading(true);
    setLoading(false);
  };

  const removeImage = (index) => {
    setPreviewImgLoading(true);
    let remainingFiles = droppedFiles.filter((val, inx) => {
      return inx != index;
    });
    if (remainingFiles.length <= 0) {
      setDroppedFiles([]);
      setDroppedFilesLength(0);
    } else {
      setDroppedFiles(remainingFiles);
      setDroppedFilesLength(remainingFiles.length);
    }

    console.log(index, "Removed");
    console.log("Array", remainingFiles);
    setPreviewImgLoading(false);
  };

  const previewImage = (index) => {
    console.log(index, "Preview");
    const len = droppedFiles.length;
    setPreviewImgLoading(true);
    if (index > len - 1) {
      setPreviewImg(
        len <= 0 ? null : URL.createObjectURL(droppedFiles[index - 1])
      );
    } else setPreviewImg(URL.createObjectURL(droppedFiles[index]));
    setPreviewImgLoading(false);
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

  const uploadMultipleFiles = (e) => {
    setPreviewImgLoading(true);
    droppedFiles.push(...e.target.files);
    setDroppedFiles(droppedFiles);
    setDroppedFilesLength(droppedFiles.length);
    setPreviewImg(URL.createObjectURL(droppedFiles[droppedFiles.length - 1]));
  };

  return (
    <Layout>
      <div className="row my-5">
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
              <div className="col-12 col-md-5 border border-light rounded m-2 p-0 upload">
                <label for="imgDrop" className="w-100 h-100 p-0">
                  <input
                    type="file"
                    id="imgDrop"
                    style={{ minHeight: "100px" }}
                    className="text-black h-100"
                    accept="image/jpg, image/jpeg"
                    onChange={uploadMultipleFiles}
                    files={droppedFiles}
                    multiple
                  />
                </label>
              </div>
              <div className="col-12 col-md-6 border border-dark rounded m-2 text-center text-dark p-0 overflow-hidden d-flex justify-content-center align-items-center">
                {previewImg == null ? (
                  <div className="m-5">No images selected</div>
                ) : (
                  <img
                    src={previewImg}
                    alt="image"
                    style={{
                      maxWidth: "300px",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="h6 mt-3">
              {droppedFilesLength > 0
                ? `${droppedFilesLength} file${
                    droppedFilesLength > 1 ? "s" : ""
                  }`
                : "No File"}{" "}
              selected
            </div>
            <div className="col-12 border border-dark rounded my-2 p-1">
              <div className="row m-1 justify-content-center">
                {previewImgLoading ? (
                  <div class={`lds-ring my-5`}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  droppedFiles.map((file, index) => {
                    return (
                      <ImgCard
                        image={file}
                        imageName={file.name}
                        index={index}
                        cover={coverImage}
                        previewImage={previewImage}
                        removeImage={removeImage}
                        setPreviewImgLoading={setPreviewImgLoading}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <div className="form-group form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="cover"
                style={{ transform: "scale(1.5)" }}
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.checked);
                }}
              />
              <label className="form-check-label" for="cover">
                Make First Image as Cover Image
              </label>
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

const ImgCard = (props) => {
  const { setPreviewImgLoading } = props;
  return (
    <div
      className="border border-dark rounded shadow-on-hover m-1"
      style={{ minHeight: "100px", minWidth: "100px" }}
      onClick={() => {
        props.previewImage(props.index);
      }}
    >
      <div className="col-12 h-100">
        <span
          id="imgCard"
          onClick={() => {
            props.removeImage(props.index);
          }}
        >
          ⓧ
        </span>
        <span className="index">
          {props.cover
            ? props.index == 0
              ? "Cover"
              : props.index
            : props.index + 1}
        </span>
        <img
          style={{ maxWidth: "100px", marginTop: "10px" }}
          title={props.imageName}
          src={URL.createObjectURL(props.image)}
          onLoad={() => {
            setPreviewImgLoading(false);
          }}
        />
        <div
          style={{
            fontSize: "12px",
            textAlign: "center",
            marginTop: "8px",
            marginBottom: "8px",
          }}
        >
          <div className="text-truncate" style={{ maxWidth: "90px" }}>
            {props.imageName}
          </div>
        </div>
      </div>
    </div>
  );
};
