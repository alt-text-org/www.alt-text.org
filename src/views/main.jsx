import React, { useState } from "react";
import { Spin } from "antd";
import SearchBox from "../components/search-box";
import SearchResults from "../components/search-results";

import { searchFile, searchUrl } from "../actions/api.js";

const Main = (props) => {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const submitUrl = (url) => {
    setSearching(true);

    searchUrl(url)
      .then((results) => {
        setSearching(false);
        setResults(results);
        setError(null);
      })
      .catch((err) => {
        setError(
          `Couldn't parse '${url}' as a url. It should look something like 'https://example.com/picture.jpg'`
        );
      });
  };

  const submitFile = (file) => {
    setSearching(true);
    searchFile(file)
      .then((results) => {
        setSearching(false);
        setResults(results);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <div className="main">
      <div className="page-content">
        {error && <div>{error}</div>}

        {!results && !searching && (
          <SearchBox submitFile={submitFile} submitUrl={submitUrl} />
        )}
        {searching && (
          <div
            className="searching"
            style={{
              height: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Spin size="large" />
            <div
              style={{ display: "block", marginTop: "10px", fontSize: "18px" }}
            >
              Searching...
            </div>
          </div>
        )}
        {results && (
          <SearchResults
            results={results}
            goBack={() => {
              setResults(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
