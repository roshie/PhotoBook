import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

export default function PrivateRoute(props) {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);

  if (user == null) {
    return <Redirect to={`/admin?page=${props.title}`} />;
  } else {
    const Component = props.component;
    return <Component />;
  }
}
