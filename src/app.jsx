import * as React from 'react';
import { BrowserRouter, Routes as ReactRoutes, Route  } from 'react-router-dom';

import Main from "./main";
import SignUp from './sign-up'
import AltTextOrgClient from "./alt-text-org";


const altTextOrgClient = new AltTextOrgClient()

export default class App extends React.Component {
   
    render() {
        return <BrowserRouter>
                    <ReactRoutes>
                        <Route
                            exact
                            path="/"
                            element={<Main altTextOrgClient={altTextOrgClient}></Main>}
                        />
                        <Route
                            exact
                            path="/sign-up"
                            element={<SignUp></SignUp>}
                        />
                    </ReactRoutes>
               </BrowserRouter>
    }
}