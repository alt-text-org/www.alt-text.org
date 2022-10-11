import * as React from "react";
import Footer from "../components/footer";
import Header from "../components/header";

async function redirectToTwitter() {
  const redirUrl = await fetch(
    "https://api.alt-text.org/library/v1/twitter-sign-up"
  )
    .then(async (resp) => {
      if (resp.ok) {
        const json = await resp.json();
        return json.auth_url;
      } else {
        console.log(`Couldn't get auth URL: ${resp.status} ${resp.statusText}`);
        return null;
      }
    })
    .catch((err) => {
      console.log("Failed to fetch auth URL");
      console.log(err);
      return null;
    });

  if (redirUrl) {
    window.open(redirUrl, "_blank");
  }
}

export default function SignUp() {
  return (
    <div>
      <Header />
      <div className="page-content">
        <div className="sign-up-wrapper">
          <div className="sign-up-headline">Help Fill The Library</div>
          <div className="sign-up-explanation">
            Would you like all the image descriptions you write to be
            automatically saved in the alt-text.org database? Click "Sign Up"
            and give us permission, and we'll start right away! You don't need
            to do anything else!
            <div>
              <b>
                *Note: This currently will not work on some mobile devices,
                Twitter is working on it*
              </b>
            </div>
          </div>
          <div className="sign-up-controls">
            <button className="big-button" onClick={redirectToTwitter}>
              Sign Up
            </button>
            <br />
            <button
              className="std-button"
              onClick={() => (document.location.href = "/")}
            >
              Return To Search
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
