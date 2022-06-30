import React from "react";
import Layout from "./Components/Layout";
import "./../Album.css";
import whiteImg from "../img/white-texture.jpg";
import RedCover from "../img/red-cover.png";
import Loader from "../img/AlbumLoader.gif";
import HTMLFlipBook from "react-pageflip";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faExpand,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { Redirect } from "react-router-dom";
import { validateAlbumCode } from "../actions/firestoreActions";
import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { _url } from "../globals";

export function AlbumPropLoader(props) {
  const [isValid, setValid] = useState(null);
  const [data, setData] = useState(null);
  const code = props.match.params.id;
  const auth = getAuth();

  useEffect(() => {
    validateAlbumCode(code).then(([_isValid, _data]) => {
      setValid(!!_isValid);
      if (_isValid) setData(_data);
    });
    // eslint-disable-next-line
  }, []);

  if (isValid && data) {
    const user = auth.currentUser;
    if (
      (data.passCode === 1 && user !== null && user.email === data.email) ||
      data.passCode === 0
    ) {
      return <Album data={data} code={code} />;
    } else {
      return <Redirect to={`/?c=${code}`} />;
    }
  } else if (isValid === false) {
    console.log("Redirecting 404");
    return <Redirect to="/404" />;
  } else {
    return <></>;
  }
}

function Album(props) {
  const flipBook = useRef();
  const url = `${_url}/api/sheets?containerName=${props.data.containerId}&name=`;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [flipbookPagesCount, setFlipbookPagesCount] = useState(0);
  const [sheets, setSheets] = useState(null);
  const [sheetDetails, setSheetDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [albumPositionTranslation, setAlbumPositionTranslation] =
    useState("-25%");

  useEffect(() => {
    document.title = `${props.data.title} | Gravity Studio`;

    fetch(`${_url}/api/sheets/names?containerName=${props.data.containerId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setSheets(res.sheetNames);
        setSheetDetails(res.sheetDetails);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
      });
    // eslint-disable-next-line
  }, []);

  const showFullScreen = (elem) => {
    if (elem.requestFullscreen) {
      elem
        .requestFullscreen()
        .then((r) => {})
        .catch((err) => console.log(err));
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  const nextButtonClick = () => {
    if (flipBook.current && flipBook.current.pageFlip()) {
      flipBook.current.pageFlip().flipNext();
    } else console.log("no");
  };

  const prevButtonClick = () => {
    if (flipBook.current && flipBook.current.pageFlip()) {
      flipBook.current.pageFlip().flipPrev();
    } else console.log("no");
  };

  const onPage = (e) => {
    setCurrentPage(e.data);
    if (e.data === 0) setAlbumPositionTranslation("-25%");
    else if (e.data === flipbookPagesCount - 1)
      setAlbumPositionTranslation("25%");
    else setAlbumPositionTranslation("0%");
  };

  const onInit = (e) => {
    if (flipBook.current && flipBook.current.pageFlip()) {
      setFlipbookPagesCount(flipBook.current.pageFlip().getPageCount());
    }
  };

  const pageFn = {
    getCover: () => {
      if (sheetDetails.cover) {
        return { url: `${url}cover.jpg` };
      }
      return {};
    },
    getFirstAndLastPage: (page) => {
      if (sheetDetails.firstPage || sheetDetails.lastPage) {
        return { url: `${url}${page}.jpg` };
      }
    },
    getInnerPages: function* () {
      for (var i = 1; i <= sheetDetails.innerSheetsCount; i++) {
        yield {
          type: "left",
          url: `${url}${i}.jpg`,
        };
        yield {
          type: "right",
          url: `${url}${i}.jpg`,
        };
      }
    },
  };

  const pageIterator = pageFn.getInnerPages(sheetDetails);

  return (
    <Layout>
      {loading && !error && (
        <div className="w-100 h-75 d-flex justify-content-center align-items-center flex-column">
          <div>
            <img src={Loader} alt="Loading..." style={{ width: "50vw" }} />
          </div>
          {/*<div
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
          </div>*/}
          <span className="m-5 text-light">Launching Your Album</span>
        </div>
      )}
      {error && (
        <div className="w-100 h-75 d-flex justify-content-center align-items-center flex-column">
          <span className="m-5 text-light">Album Loading Failed</span>
        </div>
      )}

      {sheetDetails !== null && sheets !== null && (
        <div
          className="container w-100 d-flex flex-column justify-content-center align-items-center Album-container"
          style={loading ? { visibility: "hidden" } : {}}
        >
          <h3 className="text-light mb-3 text-center">{props.data.title}</h3>
          <div className="message-turn text-light">
            To view album, Turn your phone
          </div>
          <HTMLFlipBook
            width={props.data.width / 2}
            height={props.data.height}
            size="stretch"
            minWidth={0}
            minHeight={0}
            maxShadowOpacity={1}
            mobileScrollSupport={true}
            showCover={true}
            className="Album-content"
            onFlip={(e) => {
              onPage(e);
            }}
            onInit={onInit}
            style={{ transform: `translateX(${albumPositionTranslation})` }}
            ref={flipBook}
          >
            <PageCover type="right" cover={true} {...pageFn.getCover()} />
            <PageCover type="left" />

            {/* first half Page */}
            <Page type="right" {...pageFn.getFirstAndLastPage("first")} />

            {/* inner covers */}
            {range(sheetDetails.innerSheetsCount * 2).map((n) => {
              return <Page {...pageIterator.next().value} />;
            })}
            {/* end of inner covers */}

            {/* last half Page */}
            <Page type="left" {...pageFn.getFirstAndLastPage("last")} />

            <PageCover type="right" />
            <PageCover type="left" cover={true} {...pageFn.getCover()} />
          </HTMLFlipBook>
          <div className="row navigation-row align-items-start mb-5">
            <button className="btn text-light"></button>
            <button className="btn text-light">
              <FontAwesomeIcon icon={faGoogleDrive} />
            </button>
            <button
              className="btn text-light w-auto mx-3 mx-md-5"
              onClick={prevButtonClick}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <div className="text-light my-auto">
              <span>{currentPage}</span> of <span>{flipbookPagesCount}</span>
            </div>
            <button
              className="btn text-light w-auto mx-3 mx-md-5"
              onClick={nextButtonClick}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button className="btn text-light">
              <FontAwesomeIcon icon={faShareAlt} />
            </button>
            <button
              className="btn text-light"
              onClick={() => {
                showFullScreen(document.getElementById("pageLayout"));
              }}
            >
              <FontAwesomeIcon icon={faExpand} />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

const PageCover = React.forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [style, setstyle] = useState({
    backgroundImage: `url(${props.cover ? RedCover : whiteImg})`,
    backgroundPosition: "center",
  });
  useEffect(() => {
    if (props.url) {
      fetch(props.url, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setstyle({
            backgroundImage: `url("${data.image}")`,
            backgroundPosition: props.type === "right" ? "100% 0%" : "0% 0%",
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(true);
          setstyle({ ...style, content: "Error While Loading this Picture" });
        });
    } else {
      setLoading(false);
    } // eslint-disable-next-line
  }, []);
  return (
    <div className="page cover overflow-hidden" ref={ref} data-density="hard">
      <div
        style={{
          ...style,
          height: "100%",
          width: "100%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {loading && (
          <div className="h-100 d-flex align-items-center justify-content-center">
            <div class="lds-ring lds-ring-black">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        {error && (
          <div className="h-100 d-flex align-items-center justify-content-center">
            Error Loading Page
          </div>
        )}
      </div>
    </div>
  );
});

const Page = React.forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [style, setstyle] = useState({});
  useEffect(() => {
    if (props.url) {
      fetch(props.url, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setstyle({
            backgroundImage: `url("${data.image}")`,
            backgroundPosition: props.type === "right" ? "100% 0%" : "0% 0%",
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(true);
          setstyle({ ...style, content: "Error While Loading this Picture" });
        });
    } else {
      setstyle({
        backgroundImage: `url("${whiteImg}")`,
        backgroundPosition: "center",
      });
      setLoading(false);
    } // eslint-disable-next-line
  }, []);
  return (
    <div className="page" ref={ref}>
      <div
        className={"img-" + props.type}
        style={{
          ...style,
          backgroundColor: "white",
          height: "100%",
          width: "100%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {loading && (
          <div className="h-100 d-flex align-items-center justify-content-center">
            <div class="lds-ring lds-ring-black">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        {error && (
          <div className="h-100 d-flex align-items-center justify-content-center">
            Error Loading Page
          </div>
        )}
      </div>
    </div>
  );
});

const range = (n) => {
  let arr = [...Array(n + 1).keys()];
  arr.shift();
  return arr;
};
