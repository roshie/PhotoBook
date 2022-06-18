import React from "react";
import { Redirect } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Album from "./Album";
import Layout from "./Layout";

export default class AuthRoute extends React.Component {
    constructor(props) {
        super(props)

        this.db = firebase.firestore();
        this.state = {
            isLoaded: false,
            AuthDone: false,
            id: "",
            messageWarning: { display: "none" },
        };
    }
    componentDidMount() {

        var { id } = this.props.match.params;

        this.db.collection("Albums").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.id == id) {
                    console.log("Album Exists");
                    this.setState({
                        album: doc.data(),
                        id: id,
                        isLoaded: true,
                    }); 
                    if (doc.data().passCode == "NO") {
                        var authCode = randomStr(10);
                        sessionStorage.authCode = authCode;
                        this.setState({
                            AuthDone: true,
                        });
                        this.db.collection("Albums").doc(this.state.id).set({
                            lastAuthId: authCode
                        }, { merge: true });
                    }
                }
            });
        }).then(() => {
            if (this.state.album && sessionStorage.authCode === this.state.album.lastAuthId) {
                this.setState({
                    AuthDone: true,
                });
            }
        })
    }

    handleAuth = (e) => {
        var passcode = document.getElementById('passCode').value;
        if (this.state.album.passCode == passcode) {
            var authCode = randomStr(10);
            sessionStorage.authCode = authCode;
            this.setState({
                AuthDone: true,
            });
            this.db.collection("Albums").doc(this.state.id).set({
                lastAuthId: authCode
            }, { merge: true });
        } else {
            this.setState({
                messageWarning: {},
            });
        }
        
    }
    
    render() {
        const { isLoaded, album, id, AuthDone, messageWarning } = this.state;
    
        if(!isLoaded) {
            return(
                <div className="d-flex justify-content-center align-items-center"
                        style={{ height: "100vh", width: "100vw" }}>
                    <div className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        } else {
            if(album) {
                if (AuthDone) {
                    return <Album albumData={album} albumId={id}/>;
                } else {
                    return (
                        <Layout msg="alignChildrenCenter"> 
                            <div className="h-50 w-75 card bg-dark border-light">
                                <div className="card-body ">
                                    <div className="d-flex flex-column">
                                        <h3 className="row m-2 text-light">{album.displayName + " " + album.albumType + " Album"}</h3>
                                        <h6 className="row mx-2 text-light">This Album Requires a PassCode.</h6>
                                        <input className="form-control m-2 bg-dark text-light" type="password" id="passCode" placeholder="Enter the PassCode"/>
                                        <small style={messageWarning} className="text-danger m-2"> Seems like a Wrong passcode :( </small>
                                        <div className="row justify-content-center">
                                            <button type="button" className="btn btn-primary mx-2 my-3 w-50" onClick={this.handleAuth}>View Album</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Layout>
                    );
                }
            } else {
                return <Redirect to={{pathname:"/404"}} />;
            }
        }
    }
    
}


const randomStr = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}