import * as React from 'react';
import AltTextOrgHeader from "./header";
import AltTextOrgFooter from "./footer";
import SearchBox from "./search-box";
import Searching from "./searching";
import SearchResults from "./search-results";
import ErrorPage from "./error-page";
import ReportModal from "./report-modal";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: "search",
            searchUrl: null,
            searchFile: null,
            searchType: null,
            fileBase64: null,
            results: null,
            error: null,
            reportModalVisible: false,
            toReport: null
        }

        this.displayResults = this.displayResults.bind(this);
        this.displayError = this.displayError.bind(this);
    }

    submitUrl(url) {
        try {
            new URL(url)
        } catch (err) {
            this.displayError(`Couldn't parse '${url}' as a url. It should look ` +
                `something like 'https://example.com/picture.jpg'`)
            return
        }

        this.setState({
            searchUrl: url,
            searchFile: null,
            searchType: "url",
            fileBase64: null,
            results: null,
            error: null,
            visible: "searching",
        })
    }

    submitFile(file) {
        this.setState({
            searchUrl: null,
            searchFile: file,
            searchType: "file",
            fileBase64: null,
            results: null,
            error: null,
            visible: "searching"
        })
    }

    displayError(error) {
        this.setState({
            searchUrl: null,
            searchFile: null,
            searchType: null,
            fileBase64: null,
            results: null,
            error: error,
            visible: "error"
        })
    }

    displayResults(results) {
        this.setState({
            searchUrl: null,
            searchFile: null,
            searchType: null,
            fileDataUrl: results.imageDataUrl,
            results: results.altText,
            error: null,
            visible: "results"
        })
    }

    returnToSearch() {
        this.setState({
            searchUrl: null,
            searchFile: null,
            searchType: null,
            fileBase64: null,
            results: null,
            visible: "search"
        })
    }

    openReportModal(author_uuid, sha256, language, alt_text) {
        this.setState({
            reportModalVisible: true,
            toReport: {author_uuid, sha256, language, alt_text}
        })
    }

    closeReportModal() {
        this.setState({
            reportModalVisible: false,
            toReport: null
        })
    }

    async sendReport(reason) {
        if (!this.state.toReport) {
            console.log("report() called, but no alt text tagged for reporting")
            return
        }

        const { author_uuid, sha256, language } = this.state.toReport
        const reported = await this.props.altTextOrgClient.report(author_uuid, sha256, language, reason)
        if (!reported) {
            console.log("Report failed, continuing")
        }

        this.setState({
            reportModalVisible: false,
            toReport: null
        })

    }

    render() {
        return <div className="page-wrapper">
            <AltTextOrgHeader/>
            <div className="content">
                <div className="content-wrapper">
                    {
                        this.state.visible === "search" ?
                            <SearchBox
                                submitFile={this.submitFile.bind(this)}
                                submitUrl={this.submitUrl.bind(this)}
                            /> :
                            ""
                    }
                    {
                        this.state.visible === "searching" ?
                            <Searching
                                searchFile={this.state.searchFile}
                                searchUrl={this.state.searchUrl}
                                searchType={this.state.searchType}
                                altTextOrgClient={this.props.altTextOrgClient}
                                displayResults={this.displayResults}
                                displayError={this.displayError}
                            /> :
                            ""
                    }
                    {
                        this.state.visible === "results" ?
                            <SearchResults
                                results={this.state.results}
                                searchUrl={this.state.searchUrl}
                                fileDataUrl={this.state.fileDataUrl}
                                report={this.openReportModal.bind(this)}
                                returnToSearch={this.returnToSearch.bind(this)}
                            /> :
                            ""
                    }
                    {
                        this.state.visible === "error" ?
                            <ErrorPage
                                error={this.state.error}
                                returnToSearch={this.returnToSearch.bind(this)}
                            /> :
                            ""
                    }
                    {
                        this.state.reportModalVisible ?
                            <ReportModal
                                altText={this.state.toReport.alt_text}
                                report={this.sendReport.bind(this)}
                                closeModal={this.closeReportModal.bind(this)}
                            /> :
                            ""
                    }
                </div>
            </div>
            <AltTextOrgFooter/>
        </div>
    }
}