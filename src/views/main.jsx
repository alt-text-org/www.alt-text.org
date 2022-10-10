import React, { useEffect, useState } from "react";
import { Space, Spin } from "antd";
import SearchBox from "../components/search-box";
import Searching from "../components/searching";
import SearchResults from "../components/search-results";
import ReportModal from "../components/report-modal";
import ErrorPage from "./error-page";

import {
  ts,
  fetchAltTextForUrl,
  fetchAltForImageBase64,
  searchFile,
  searchUrl,
  report,
} from "../actions/api.js";
import { blockSize } from "fast-sha256";

const Main = (props) => {
  const [visible, setVisible] = useState("searchForm");

  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [reportModal, setReportModal] = useState(null);

  const [searchType, setSearchType] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);

  const [error, setError] = useState(null);
  // const [reportModalVisible, setReportModalVisible] = useState(false);
  // const [toReport, setToReport] = useState(null);

  const displayResults = (results) => {
    setError(null);
    setSearchType(null);
    setFileBase64(null);
    setResults(results);
    setVisible("results");
  };

  const displayError = (errorResult) => {
    setError(errorResult);
    setSearchType(null);
    setFileBase64(null);
    setResults(null);
    setVisible("error");
  };

  const returnToSearch = () => {
    setError(null);
    setSearchType(null);
    setFileBase64(null);
    setResults(null);
    setVisible("search");
  };

  const submitUrl = (url) => {
    setSearching(true);

    searchUrl(url)
      .then((results) => {
        console.log("results", results);
        setSearching(false);
        setResults(results);
        setError(null);
      })
      .catch((err) => {
        console.log("err", err);
        setError(err);
      });

    // try {
    //   new URL(url);
    //   setSearchUrl(url);
    //   setError(null);
    //   setSearchType("url");
    //   setFileBase64(null);
    //   setResults(null);
    //   setVisible("searching");
    // } catch (err) {
    //   return displayError(
    //     `Couldn't parse '${url}' as a url. It should look ` +
    //       `something like 'https://example.com/picture.jpg'`
    //   );
    // }
  };

  const submitFile = (file) => {
    setSearching(true);

    searchFile(file)
      .then((results) => {
        console.log("results", results);
        setSearching(false);
        setResults(results);
        setError(null);
      })
      .catch((err) => {
        console.log("err", err);
        setError(err);
      });
  };

  const openReportModal = (author_uuid, sha256, language, alt_text) => {
    setReportModal({
      author_uuid,
      sha256,
      language,
      alt_text,
    });
  };

  const closeReportModal = () => {
    setReportModal(null);
    // console.log("Close: " + JSON.stringify(toReport));
    // setReportModalVisible(false);
    // setToReport(null);
  };

  const copyText = async (text) => {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(text);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = text;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise((res, rej) => {
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  };

  const sendReport = async (reason) => {
    if (!toReport) {
      console.log("report() called, but no alt text tagged for reporting");
      return;
    }

    const { author_uuid, sha256, language } = toReport;
    const reported = await props.altTextOrgClient.report(
      author_uuid,
      sha256,
      language,
      reason
    );

    if (!reported) {
      console.log("Report failed, continuing");
    }

    setToReport(null);
  };

  return (
    <div className="main">
      <div className="page-content">
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
            openReportModal={openReportModal}
            goBack={() => {
              setResults(null);
            }}
            copyText={copyText}
            // searchUrl={searchUrl}
            // fileDataUrl={fileDataUrl}
          />
        )}

        {reportModal && <ReportModal />}
      </div>
    </div>

    // <div className="page-wrapper">
    //   <div className="content">
    //     <div className="content-wrapper">
    //       {visible === "search" && (
    //         <SearchBox submitFile={submitFile} submitUrl={submitUrl} />
    //       )}

    //       {/* {visible === "searching" && (
    //         <Searching
    //           searchFile={searchFile}
    //           searchUrl={searchUrl}
    //           searchType={searchType}
    //           altTextOrgClient={props.altTextOrgClient}
    //           displayResults={displayResults}
    //           displayError={displayError}
    //         />
    //       )} */}

    //       {/* {visible === "results" && (
    //         <SearchResults
    //           results={results}
    //           searchUrl={searchUrl}
    //           fileDataUrl={fileDataUrl}
    //           copy={copyText.bind(this)}
    //           openReportModal={openReportModal.bind(this)}
    //           returnToSearch={returnToSearch.bind(this)}
    //         />
    //       )} */}

    //       {/* {visible === "error" && (
    //         <ErrorPage
    //           error={error}
    //           returnToSearch={returnToSearch.bind(this)}
    //         />
    //       )}

    //       {reportModalVisible && (
    //         <ReportModal
    //           altText={toReport.alt_text}
    //           report={sendReport.bind(this)}
    //           closeModal={closeReportModal.bind(this)}
    //         />
    //       )} */}
    //     </div>
    //   </div>
    // </div>
  );
};

export default Main;
