import * as React from 'react';
import Main from "./main";
import AltTextOrgClient from "./alt-text-org";

const altTextOrgClient = new AltTextOrgClient()

export default class App extends React.Component {
   
    render() {
        return <>
           <Main altTextOrgClient={altTextOrgClient}></Main>
        </>
    }
}