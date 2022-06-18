import React from "react";
import Layout from "./Layout";

export default function Home() {
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
              <a class="btn btn-outline-light">Get Started</a>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 my-auto pr-lg-5">
          <div className="m-5 mr-lg-5 mt-5 mx-lg-5 px-md-5 px-lg-0">
            {/* <div className="my-3 text-light ml-lg-1 text-center text-lg-left">
              Or,
            </div> */}
            <div className="border border-dark rounded p-5 mx-2 mx-md-5 mx-lg-1 text-gray light-shadow">
              <h3>Open With a Photobook Code</h3>
              Enter your Photobook code here
              <form>
                <input
                  type="text"
                  name="code"
                  id="code"
                  className="form-control my-3 bg-dark text-light"
                />
              </form>
              <a class="btn btn-pink text-light my-2">View Photobook</a>
            </div>
          </div>
        </div>
      </div>
      <div className="ele"></div>
    </Layout>
  );
}
