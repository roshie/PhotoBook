import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

export default function PrivateRoute(props) {
  const auth = getAuth();
  const [user, setUser] = useState("Loading");
  useEffect(() => {
    setUser(auth.currentUser);
    // eslint-disable-next-line
  }, []);

  if (user == null) {
    return <Redirect to={`/admin?page=${props.title}`} />;
  } else if (user === "Loading") {
    return <div className="m-auto text-light">Loading...</div>;
  } else {
    const Component = props.component;
    return <Component />;
  }
}
