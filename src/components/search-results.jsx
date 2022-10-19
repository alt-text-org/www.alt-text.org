import React, { useEffect, useState } from "react";
import SearchResult from "./search-result";
import ReportModal from "./report-modal";

export default function SearchResults(props) {
  const { results, goBack } = props;

  const { alt, img } = results;
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportModalContent, setReportModalContent] = useState(null);
  const [showReported, setShowReported] = useState(false);
  const [showImgError, setShowImgError] = useState(false);

  if (alt && (alt.exact.length + alt.fuzzy.length > 0 || alt.ocr)) {
    const resultArray = [];

    if (alt.ocr) {
      resultArray.push(
        <SearchResult altText={alt.ocr} score="Extracted Text" report={false} />
      );
    }

    alt.exact.forEach((result) => {
      resultArray.push(
        <SearchResult
          result={result}
          altText={result.alt_text}
          score="Exact Match"
          report={true}
          openReportModal={() => {
            setReportModalContent({
              author: result.author_uuid,
              sha: result.sha256,
              language: result.language,
              altText: result.alt_text,
            });
            setShowReportModal(true);
          }}
        />
      );
    });

    alt.fuzzy.forEach((result) => {
      if (result.score >= 0.98) {
        resultArray.push(
          <SearchResult
            altText={result.alt_text}
            score={`${Math.floor((result.score - 0.9) * 1000)}% Match`}
            report={true}
            reportModalContent={reportModalContent}
            openReportModal={() => {
              setReportModalContent({
                author: result.author_uuid,
                sha: result.sha256,
                language: result.language,
                altText: result.alt_text,
              });

              setShowReportModal(true);
            }}
          />
        );
      }
    });

    if (resultArray.length > 0) {
      //These are in a weird order to put the image at the end for screen reader users.
      return (
        <>
          {showReportModal && (
            <ReportModal
              reportModalContent={reportModalContent}
              close={() => {
                setReportModalContent(null);
                setShowReportModal(false);
                setShowReported(true);
              }}
              handleReportSuccess={() => setShowReported(true)}
            />
          )}
          <div className="search-results">
            <div className="results-preview">
              {img && !showImgError && (
                <img
                  className="searched-image"
                  alt="The searched image"
                  crossOrigin="Anonymous"
                  onError={() => setShowImgError(true)}
                  src={img}
                />
              )}

              {showImgError && <p>Preview image could not be loaded.</p>}

              <button onClick={goBack}>Search Another Image</button>
            </div>

            <div className="results-list">
              {resultArray}
              {showReported && (
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    backgroundColor: "#5fd397",
                    color: "white",
                    width: "300px",
                    margin: "15px auto",
                    padding: "5px",
                  }}
                >
                  Reported successfully.
                </p>
              )}
            </div>
          </div>
        </>
      );
    }
  }

  return (
    <div className="not-found-wrapper">
      {img && !showImgError && (
        <img
          className="searched-image"
          alt="The searched image"
          crossOrigin="Anonymous"
          onError={() => setShowImgError(true)}
          src={img}
        />
      )}

      {showImgError && <p>Preview image could not be loaded.</p>}

      <div className="not-found-message">
        Couldn't find any published alt text for that image.
      </div>
      <div className="not-found-controls">
        <button className="not-found-button" onClick={goBack}>
          Search Another Image
        </button>
      </div>
    </div>
  );
}
