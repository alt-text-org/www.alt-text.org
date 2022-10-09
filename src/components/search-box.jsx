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
      <div className="tabs">
        <div className="tab" onClick={() => setSelectedTab("computer")}>
          On Your Computer
        </div>
        <div className="tab" onClick={() => setSelectedTab("web")}>
          On The Web
        </div>
      </div>
      <div className="search-box-form">
        {selectedTab === "computer" && (
          <div className="search-box-panel">
            <button
              type="button"
              className="btn btn-grey btn-sm"
              style={{
                height: "75px",
                width: "150px",
                position: "relative",
                color: "black",
              }}
            >
              Upload Image
              <input
                type="file"
                name="file"
                multiple="false"
                onChange={handleUploadImage}
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  opacity: 0,
                  padding: 0,
                  margin: 0,
                }}
              />
            </button>
          </div>
        )}

        {selectedTab === "web" && (
          <div className="search-box-panel">
            <form onSubmit={handleSubmitUrl}>
              <input
                defaultValue={"https://"}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  height: "30px",
                  width: "300px",
                  padding: "5px",
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
