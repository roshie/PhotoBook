import { useEffect } from "react";

export default function Error404() {
  useEffect(() => {
    document.title = "Page Not Found!";
  }, []);
  return (
    <div className="text-light m-auto">
      {" "}
      <h3>Oops! This link has broken</h3>
      <a href="/">Go to Home</a>{" "}
    </div>
  );
}
