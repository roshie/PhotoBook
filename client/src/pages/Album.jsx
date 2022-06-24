import React from "react";
import Layout from "./Components/Layout";
import "./../Album.css";
import whiteImg from "../img/white-texture.jpg";
import Loader from "../img/AlbumLoader.gif";
import HTMLFlipBook from "react-pageflip";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { Redirect } from "react-router-dom";
import { validateAlbumCode } from "../actions/firestoreActions";
import { useState } from "react";
import { getAuth } from "firebase/auth";

const url = "http://localhost:3001/api/album?";

// On album loading, check for
// if the album id provided in route is valid
// if not valid, show 404 component,
// else,
// check if album id already stored in session, yes, directly show the album
// else,
// check if this album is password protected
// if yes, redirect to home page and prompt them to enter password
// if no, directly show the album

export function AlbumPropLoader(props) {
  const [isValid, setValid] = useState(null);
  const [data, setData] = useState(null);
  const code = props.match.params.id;
  const auth = getAuth();
  validateAlbumCode(code).then(([_isValid, _data]) => {
    setValid(!!_isValid);
    if (_isValid) setData(_data);
  });

  if (isValid && data) {
    const user = auth.currentUser;
    if (
      (data.passCode == 1 && user != null && user.email == data.email) ||
      data.passCode == 0
    ) {
      return <Album albumData={data} albumId={code} />;
    } else {
      return <Redirect to={`/?c=${code}`} />;
    }
  } else if (isValid == false) {
    console.log("Redirecting 404");
    return <Redirect to="/404" />;
  } else {
    return <></>;
  }
}

export default class Album extends React.Component {
  constructor(props) {
    super(props);

    this.album = props.albumData;
    this.id = props.albumId;
    this.url = url + "folderId=" + this.album.folderId + "&";
    this.imagesArray = getPagesArray(this.album);
    this.pages = (this.album.noOfPages - 2) * 2 + 2;

    this.state = {
      isInvalidAlbum: false,
      page: 0,
      totalPage: 0,
      moveAlbum: "-25%",
      albumStyle: { visibility: "hidden" },
      isLoaded: false,
      isError: false,
      noAlbumFound: false,
      loadedPages: 1,
      loadedPercentage: 0,
    };

    var img = new Image();
    img.src = this.url + "num=2&type=single&isLeftPage=false";
    img.onload = () => {
      this.albumWidth = img.naturalWidth;
      this.albumHeight = img.naturalHeight;
    };

    // gzG6lghbyRLMagaAqaHz  D5svdgG8
    this.handleLoad = this.handleLoad.bind(this);
  }

  nextButtonClick = () => {
    if (this.flipBook && this.flipBook.pageFlip()) {
      this.flipBook.pageFlip().flipNext();
    } else console.log("no");
  };

  prevButtonClick = () => {
    if (this.flipBook && this.flipBook.pageFlip()) {
      this.flipBook.pageFlip().flipPrev();
    } else console.log("no");
  };

  onPage = (e) => {
    var moveAlbum;
    this.setState({
      page: e.data,
    });
    if (this.state.page == 0) moveAlbum = "-25%";
    else if (this.state.page == this.state.totalPage - 1) moveAlbum = "25%";
    else moveAlbum = "0%";

    this.setState({
      moveAlbum: moveAlbum,
    });
  };

  onInit = (e) => {
    if (this.flipBook && this.flipBook.pageFlip()) {
      this.setState({
        totalPage: this.flipBook.pageFlip().getPageCount(),
      });
    }
  };

  componentDidMount() {
    document.title = this.album.displayName + " Album | Gravity Studio";
  }

  handleLoad = (e) => {
    const temp = this.state.loadedPages + 1;
    const pages = this.pages;
    this.setState({
      loadedPages: temp,
      loadedPercentage: (temp / pages) * 100 + "%",
    });

    console.log(
      e.target.getAttribute("page"),
      "Loaded. loadedPages=",
      this.state.loadedPages
    );
    if (this.state.loadedPercentage === "100%") {
      this.setState({
        albumStyle: {},
        isLoaded: true,
      });
    }
  };

  handleError = (e) => {
    e.target.alt = e.target.getAttribute("page") + " Loading failed";
    this.setState({
      isError: true,
    });
  };

  render() {
    var { moveAlbum, isLoaded, isError, isInvalidAlbum } = this.state;
    if (isInvalidAlbum) return <Redirect to="/404" />;
    return (
      <Layout>
        {!isLoaded && !isError && (
          <div className="w-100 h-75 d-flex justify-content-center align-items-center flex-column">
            <div>
              <img src={Loader} alt="Loading..." style={{ width: "50vw" }} />
            </div>
            <div
              class="progress"
              style={{
                width: "50%",
                backgroundColor: "gray",
                height: "0.7rem",
              }}
            >
              <div
                class="progress-bar progress-purple"
                role="progressbar"
                style={{ width: this.state.loadedPercentage }}
                aria-valuenow={this.state.loadedPages}
                aria-valuemin={0}
                aria-valuemax={this.pages}
              ></div>
            </div>
            <span className="m-5 text-light">Launching Your Album</span>
          </div>
        )}

        {isError && (
          <div className="w-100 h-75 d-flex justify-content-center align-items-center flex-column">
            <span className="m-5 text-light">Album Loading Failed</span>
          </div>
        )}

        <div
          className="container w-100 d-flex flex-column justify-content-center align-items-center Album-container"
          style={this.state.albumStyle}
        >
          <h3 className="text-light mb-3">
            {" "}
            {this.album.displayName} {this.album.albumType} Album
          </h3>
          <div className="message-turn text-light">
            {" "}
            To view album, Turn your phone
          </div>
          <HTMLFlipBook
            width={1000}
            height={740}
            size="stretch"
            minWidth={0}
            maxWidth={2800}
            minHeight={0}
            maxHeight={800}
            maxShadowOpacity={1}
            mobileScrollSupport={true}
            showCover={true}
            className="Album-content"
            onFlip={this.onPage.bind(this)}
            onInit={this.onInit}
            style={{ transform: `translateX(${moveAlbum})` }}
            ref={(component) => (this.flipBook = component)}
          >
            <PageCover type="right">
              <img
                className="img"
                src={this.url + "num=1&type=double&isLeftPage=false"}
                page="Front Cover"
                onError={this.handleError}
                onLoad={this.handleLoad}
              />
            </PageCover>
            <PageCover type="left">
              <img
                src={whiteImg}
                height={this.albumHeight}
                width={this.albumWidth}
                style={{ maxWidth: "100%", maxHeight: "95%" }}
              />
            </PageCover>

            {this.imagesArray.map((image, i) => {
              return (
                <Page type={image.type}>
                  <img
                    className="img"
                    src={this.url + image.src}
                    page={i}
                    onError={this.handleError}
                    onLoad={this.handleLoad}
                  />
                </Page>
              );
            })}

            <PageCover type="right">
              <img
                src={whiteImg}
                height={this.albumHeight}
                width={this.albumWidth}
                style={{ maxWidth: "100%", maxHeight: "95%" }}
              />
            </PageCover>
            <PageCover type="left">
              <img
                className="img"
                src={this.url + "num=1&type=double&isLeftPage=true"}
                page="Back Cover"
                onError={this.handleError}
                onLoad={this.handleLoad}
              />
            </PageCover>
          </HTMLFlipBook>
          <div className="row navigation-row align-items-start mb-5">
            <button className="btn text-light"></button>
            <button className="btn text-light"></button>
            <button
              className="btn text-light w-auto mx-5"
              onClick={this.prevButtonClick.bind(this)}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <div className="text-light my-auto">
              <span>{this.state.page}</span> of{" "}
              <span>{this.state.totalPage}</span>
            </div>
            <button
              className="btn text-light w-auto mx-5"
              onClick={this.nextButtonClick.bind(this)}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button className="btn text-light">
              <FontAwesomeIcon icon={faShareAlt} />
            </button>
            <button className="btn text-light">
              <FontAwesomeIcon icon={faGoogleDrive} />
            </button>
          </div>
        </div>
      </Layout>
    );
  }
}

const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="page cover overflow-hidden" ref={ref} data-density="hard">
      <div className={"img-" + props.type}>{props.children}</div>
    </div>
  );
});

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className={"img-" + props.type}>{props.children}</div>
    </div>
  );
});

const getPagesArray = (album) => {
  var res = [];
  res.push({ src: "num=2&type=single&isLeftPage=false", type: "right" });
  for (var i = 3; i < album.noOfPages; i++) {
    res.push({
      src: "num=" + i + "&type=double&isLeftPage=true",
      type: "left",
    });
    res.push({
      src: "num=" + i + "&type=double&isLeftPage=false",
      type: "right",
    });
  }
  res.push({
    src: "num=" + album.noOfPages + "&type=single&isLeftPage=true",
    type: "left",
  });
  return res;
};
