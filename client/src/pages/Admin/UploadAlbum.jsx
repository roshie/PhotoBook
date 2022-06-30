import { useState, useEffect } from "react";
import Layout from "../Components/Layout";
import { createAlbumDoc } from "../../actions/firestoreActions";
import { appUrl, _url } from "../../globals";

export default function UploadAlbum() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [passCode, setPasscode] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(false);
  const [startsWithHalfImage, setStartsWithHalfImage] = useState(false);
  const [requirePasscode, setRequirePasscode] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [droppedFilesLength, setDroppedFilesLength] = useState(0);
  const [previewImg, setPreviewImg] = useState(null);
  const [previewImgLoading, setPreviewImgLoading] = useState(false);
  const [albumId, setAlbumId] = useState(null);

  const createAlbum = () => {
    setLoading(true);
    const albumData = {
      containerId: "", // get containerId from server
      cover: coverImage ? 1 : 0,
      email,
      height,
      width,
      passCode: requirePasscode ? 1 : 0,
      startsWithHalfPage: startsWithHalfImage ? 1 : 0,
      title: name,
    };

    var formData = new FormData();
    formData.append("title", name);
    for (var i = 0; i < droppedFiles.length; i++)
      formData.append(
        "imgFiles",
        droppedFiles[i],
        getLabel({
          index: i,
          cover: coverImage,
          halfImage: startsWithHalfImage,
          length: droppedFiles.length,
          fileName: true,
        })
      );

    sendData(formData)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.message === "success") {
          albumData.containerId = res.containerId;
          createAlbumDoc(albumData, passCode).then((id) => {
            setLoading(false);
            setAlbumId(id);
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const sendData = async (formData) => {
    return fetch(`${_url}/api/sheets`, {
      method: "POST",
      body: formData,
    });
  };

  const removeImg = (index) => {
    return new Promise((resolve, reject) => {
      let remainingFiles = droppedFiles.filter((val, inx) => {
        return inx !== index;
      });
      if (remainingFiles.length <= 0) {
        setDroppedFiles([]);
        setDroppedFilesLength(0);
        setPreviewImg(null);
        resolve(true);
      } else {
        setDroppedFiles(remainingFiles);
        console.log("Array", remainingFiles);
        setDroppedFilesLength(remainingFiles.length);
        setPreviewImg(
          URL.createObjectURL(remainingFiles[remainingFiles.length - 1])
        );
        resolve(true);
      }
    });
  };

  const removeImage = (index) => {
    setPreviewImgLoading(true);
    removeImg(index).then((res) => {
      if (res) {
        setPreviewImgLoading(false);
      }
    });
  };

  const setImage = (index) => {
    return new Promise((resolve, reject) => {
      setPreviewImgLoading(true);
      setPreviewImg(URL.createObjectURL(droppedFiles[index]));
      resolve(true);
    });
  };

  const previewImage = (index) => {
    setImage(index).then((res) => {
      if (res) {
        setPreviewImgLoading(false);
      }
    });
  };

  useEffect(() => {
    if (requirePasscode) setPasscode("");
    if (
      name !== "" &&
      email !== "" &&
      width !== 0 &&
      height !== 0 &&
      droppedFiles.length > 0 &&
      (!requirePasscode || (requirePasscode && passCode !== ""))
    )
      setDisabled(false);
    else setDisabled(true);
  }, [name, email, passCode, requirePasscode, width, height, droppedFiles]);

  const uploadMultipleFiles = (e) => {
    setPreviewImgLoading(true);
    for (var i = e.target.files.length - 1; i >= 0; i--)
      droppedFiles.push(e.target.files[i]);
    setDroppedFiles(droppedFiles);
    setDroppedFilesLength(droppedFiles.length);
    setPreviewImg(URL.createObjectURL(droppedFiles[droppedFiles.length - 1]));
    setPreviewImgLoading(false);
  };

  return (
    <Layout>
      <div className="row my-5">
        {albumId !== null ? (
          <div className="m-auto p-5 text-light">
            <div className="h1 m-5">Success!</div>
            <div className="mt-5 text-center">
              View Album{" "}
              <a
                target="_blank"
                rel="noreferrer"
                className="btn btn-pink text-light m-2"
                href={`${appUrl}/album/${albumId}`}
              >
                Here
              </a>
            </div>
            {requirePasscode && (
              <div>
                <div className="h6 mt-3">PassCode</div>
                <input
                  type="password"
                  readOnly
                  className="form-control mt-3 mb-2 bg-dark text-light"
                  value={passCode}
                />
              </div>
            )}
          </div>
        ) : (
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
                value={name}
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <div className="h6 mt-3">Album Size</div>
              <div className="row justify-content-center">
                <div className="col-12 col-md-4 m-1">
                  <input
                    type="number"
                    name="width"
                    id="width"
                    placeholder="Width (in Pixels)"
                    className="form-control bg-dark text-light"
                    value={width}
                    onChange={(e) => {
                      setWidth(e.target.value);
                    }}
                  />
                </div>
                <div className="col-12 col-md-4 m-1">
                  <input
                    type="number"
                    name="height"
                    id="height"
                    placeholder="Height (in Pixels)"
                    className="form-control bg-dark text-light"
                    value={height}
                    onChange={(e) => {
                      setHeight(e.target.value);
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
                  {previewImg === null ? (
                    <div className="m-5">No images selected</div>
                  ) : previewImgLoading ? (
                    <div class={`lds-ring my-5`}>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    <img
                      src={previewImg}
                      alt="Preview"
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
                  {droppedFiles.map((file, index) => {
                    return (
                      <ImgCard
                        image={file}
                        imageName={file.name}
                        index={index}
                        cover={coverImage}
                        length={droppedFiles.length}
                        halfImage={startsWithHalfImage}
                        previewImage={previewImage}
                        removeImage={removeImage}
                      />
                    );
                  })}
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
              <div className="form-group form-check mt-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="firstpage"
                  style={{ transform: "scale(1.5)" }}
                  value={startsWithHalfImage}
                  onChange={(e) => {
                    setStartsWithHalfImage(e.target.checked);
                  }}
                />
                <label className="form-check-label" for="cover">
                  Mark Second and last images for First and Last Half pages
                </label>
              </div>

              <button
                onClick={createAlbum}
                type="button"
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
        )}
      </div>
    </Layout>
  );
}

const getLabel = ({ index, cover, halfImage, length, fileName = false }) => {
  if (cover && index === 0) {
    return fileName ? "cover.jpg" : "Cover";
  } else if (
    (cover && halfImage && index === 1) ||
    (halfImage && index === 0)
  ) {
    return fileName ? "first.jpg" : "F";
  } else if (halfImage && index === length - 1) {
    return fileName ? "last.jpg" : "L";
  } else if (cover && halfImage) {
    return fileName ? `${index - 1}.jpg` : index - 1;
  } else if (cover || halfImage) {
    return fileName ? `${index}.jpg` : index;
  } else {
    return fileName ? `${index + 1}.jpg` : index + 1;
  }
};

const ImgCard = (props) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div
      className="border border-dark rounded shadow-on-hover m-1"
      style={{ minHeight: "100px", minWidth: "100px" }}
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
          {getLabel({
            index: props.index,
            cover: props.cover,
            halfImage: props.halfImage,
            length: props.length,
          })}
        </span>
        <img
          style={{
            maxWidth: "100px",
            marginTop: "10px",
            display: loading ? "none" : "block",
          }}
          alt="Thumbnail"
          title={props.imageName}
          src={URL.createObjectURL(props.image)}
          onLoad={() => {
            setLoading(false);
          }}
          onClick={() => {
            props.previewImage(props.index);
          }}
        />
        <div class={`lds-ring ${loading ? "" : "d-none"}`}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

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
