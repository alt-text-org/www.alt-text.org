import React, { useState } from "react";

export default function SearchBox(props) {
  const { submitFile, submitUrl } = props;
  const [url, setUrl] = useState("");

  const [selectedTab, setSelectedTab] = useState("computer");

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    submitFile(file);
  };

  const handleSubmitUrl = (e) => {
    e.preventDefault();
    submitUrl(url);
  };

  return (
    <div className="search-box">
      <div className="page-intro">
        <h1>Search the library for an image description.</h1>
      </div>

      <div className="tabs">
        <div
          className={selectedTab === "computer" ? "tab active" : "tab"}
          onClick={() => setSelectedTab("computer")}
        >
          On Your Computer
        </div>
        <div
          className={selectedTab === "web" ? "tab active" : "tab"}
          onClick={() => setSelectedTab("web")}
        >
          On The Web
        </div>
      </div>
      <div className="search-box-form">
        {selectedTab === "computer" && (
          <div className="search-box-panel">
            <input
              type="file"
              name="file"
              multiple={false}
              onChange={handleUploadImage}
              style={{ borderRadius: "5px" }}
            />
          </div>
        )}

        {selectedTab === "web" && (
          <div className="search-box-panel">
            <form onSubmit={handleSubmitUrl}>
              <input
                defaultValue={"https://"}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: "350px",
                }}
              ></input>
              <button
                type="submit"
                style={{
                  cursor: "pointer",
                  height: "45px",
                  width: "100px",
                  padding: "5px",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
