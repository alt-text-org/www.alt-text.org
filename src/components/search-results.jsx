import * as React from "react";
import SearchResult from "./search-result";

export default function SearchResults(props) {
  const { results, openReportModal, copyText, returnToSearch, goBack } = props;

  const { alt, img } = results;

  if (alt && (alt.exact.length + alt.fuzzy.length > 0 || alt.ocr)) {
    const resultArray = [];
    let bg = true;

    if (alt.ocr) {
      console.log("alt ocr");
      resultArray.push(
        <SearchResult
          altText={alt.ocr}
          score="Extracted Text"
          report={false}
          copyText={() => copyText(alt.ocr)}
          bgClass={bg ? "result-zebra-dark" : "result-zebra-light"}
        />
      );
      resultArray.push(<hr className="result-hr" />);
      bg = !bg;
    }

    alt.exact.forEach((result) => {
      resultArray.push(
        <SearchResult
          result={result}
          altText={result.alt_text}
          score="Exact Match"
          report={true}
          openReportModal={() => {
            openReportModal(
              result.author_uuid,
              result.sha256,
              result.language,
              result.alt_text
            );
          }}
          //   report={() =>
          //     openReportModal(
          //       result.author_uuid,
          //       result.sha256,
          //       result.language,
          //       result.alt_text
          //     )
          //   }
          copyText={() => copyText(result.alt_text)}
          bgClass={bg ? "result-zebra-dark" : "result-zebra-light"}
        />
      );
      resultArray.push(<hr className="result-hr" />);
      bg = !bg;
    });

    alt.fuzzy.forEach((result) => {
      if (result.score >= 0.98) {
        resultArray.push(
          <SearchResult
            altText={result.alt_text}
            score={`${Math.floor((result.score - 0.9) * 1000)}% Match`}
            report={true}
            openReportModal={() => {
              openReportModal(
                result.author_uuid,
                result.sha256,
                result.language,
                result.alt_text
              );
            }}
            copyText={() => copyText(result.alt_text)}
            bgClass={bg ? "result-zebra-dark" : "result-zebra-light"}
          />
        );
        resultArray.push(<hr className="result-hr" />);
        bg = !bg;
      }
    });

    if (resultArray.length > 0) {
      resultArray.pop(); // pull off last <hr/>
      console.log("resultArray:" + JSON.stringify(resultArray));
      //These are in a weird order to put the image at the end for screen reader users.
      return (
        <div className="result-outer-wrapper">
          <span className="result-right-wrapper">
            <div className="result-inner-wrapper">{resultArray}</div>
          </span>
          <span className="result-left-wrapper">
            <div className="result-image-wrapper">
              <img
                className="searched-image"
                alt="The searched image"
                crossOrigin="Anonymous"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "images/load-failed.svg";
                }}
                src={img}
              />
            </div>
            <div className="return-button-wrapper">
              <button className="std-button" onClick={returnToSearch}>
                Search Another Image
              </button>
            </div>
          </span>
          <span className="result-divider"></span>
        </div>
      );
    }
  }

  return (
    <div className="not-found-wrapper">
      <img
        className="searched-image"
        alt="The searched image"
        crossOrigin="Anonymous"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = "images/load-failed.svg";
        }}
        src={img}
      />
      <div className="not-found-message">
        Couldn't find any published alt text for that image.
      </div>
      <div className="not-found-controls">
        <button className="not-found-button std-button" onClick={goBack}>
          Search Another Image
        </button>
      </div>
    </div>
  );
}
