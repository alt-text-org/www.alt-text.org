import React, { useEffect, useState } from "react";
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

const Main = (props) => {
  const [visible, setVisible] = useState("search");
  const [searchUrl, setSearchUrl] = useState(null);
  const [searchFile, setSearchFile] = useState(null);
  const [searchType, setSearchType] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [toReport, setToReport] = useState(null);

  const displayResults = (results) => {
    setError(null);
    setSearchFile(null);
    setSearchType(null);
    setFileBase64(null);
    setResults(results);
    setVisible("results");
  };

  const displayError = (errorResult) => {
    setError(errorResult);
    setSearchFile(null);
    setSearchType(null);
    setFileBase64(null);
    setResults(null);
    setVisible("error");
  };

  const returnToSearch = () => {
    setError(null);
    setSearchFile(null);
    setSearchType(null);
    setFileBase64(null);
    setResults(null);
    setVisible("search");
  };

  const submitUrl = (url) => {
    try {
      new URL(url);
      setSearchUrl(url);
      setError(null);
      setSearchFile(null);
      setSearchType("url");
      setFileBase64(null);
      setResults(null);
      setVisible("searching");
    } catch (err) {
      return displayError(
        `Couldn't parse '${url}' as a url. It should look ` +
          `something like 'https://example.com/picture.jpg'`
      );
    }
  };

  const submitFile = (file) => {
    setError(null);
    setSearchFile(file);
    setSearchType("file");
    setFileBase64(null);
    setResults(null);
    setVisible("searching");
  };

  const openReportModal = (author_uuid, sha256, language, alt_text) => {
    setToReport({
      author_uuid,
      sha256,
      language,
      alt_text,
    });
    setReportModalVisible(true);
  };

  const closeReportModal = () => {
    console.log("Close: " + JSON.stringify(toReport));
    setReportModalVisible(false);
    setToReport(null);
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
    <div className="page-wrapper">
      <div className="content">
        <div className="content-wrapper">
          {visible === "search" && (
            <SearchBox submitFile={submitFile} submitUrl={submitUrl} />
          )}

          {/* {visible === "searching" && (
            <Searching
              searchFile={searchFile}
              searchUrl={searchUrl}
              searchType={searchType}
              altTextOrgClient={props.altTextOrgClient}
              displayResults={displayResults}
              displayError={displayError}
            />
          )} */}

          {/* {visible === "results" && (
            <SearchResults
              results={results}
              searchUrl={searchUrl}
              fileDataUrl={fileDataUrl}
              copy={copyText.bind(this)}
              openReportModal={openReportModal.bind(this)}
              returnToSearch={returnToSearch.bind(this)}
            />
          )} */}

          {/* {visible === "error" && (
            <ErrorPage
              error={error}
              returnToSearch={returnToSearch.bind(this)}
            />
          )}

          {reportModalVisible && (
            <ReportModal
              altText={toReport.alt_text}
              report={sendReport.bind(this)}
              closeModal={closeReportModal.bind(this)}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Main;
