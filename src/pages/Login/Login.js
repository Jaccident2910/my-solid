import React, { useState } from "react";
import {
    LoginButton,
    Text,
    Value,
    useSession,
    CombinedDataProvider,
    useDataset
  } from "@inrupt/solid-ui-react";
  import { Route, Link, Routes, useLocation } from 'react-router-dom';

import Profile from "./Profile.js"


const authOptions = {
clientName: "mySolid",
};


function Login() {
    const {
      session,
      sessionRequestInProgress,
      fetch,
      login,
      logout,
    } = useSession();
  const [oidcIssuer, setOidcIssuer] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [profile, renderProfile] = useState("");
  

  
    const handleChange = (event) => {
      setRedirectUrl(useLocation)
      setOidcIssuer(event.target.value);
    };
  
    /*
    const TestFunc = () => {{
      let theItem = Value({property: "http://www.w3.org/ns/pim/space#storage"})
      console.log(theItem) 
    return(<>yay</>)}}
    */
  
    return (
      <div className="mainScreen max-w-4xl flex-1">
      <div className="app-container">
        {console.log("")}
        {console.log(session)}
        {
        session.info.isLoggedIn ? (
          <CombinedDataProvider
            datasetUrl={session.info.webId}
            thingUrl={session.info.webId}
          >
            <div className="message logged-in">
              <span>You are logged in as: </span>
              <Text properties={[
                  "http://www.w3.org/2006/vcard/ns#fn",
                  "http://xmlns.com/foaf/0.1/name",
                ]} />
              <h2>
                Your WebID is: {
                  session.info.webId
                } <br></br>
                Your pronouns are: <Text property="http://www.w3.org/ns/solid/terms#preferredObjectPronoun"/> <br></br>
                Your root of file storage should be at: 
                <Profile webID={session.info.webId} />
              </h2>
            </div>
          </CombinedDataProvider>
        ) : (
          <div className="message logged-out">
            <span>You are not logged in. </span> <br></br>
       <span>
              Log in with:
              <input
                className="oidc-issuer-input "
                type="text"
                name="oidcIssuer"
                list="providers"
                value={oidcIssuer}
                onChange={handleChange}
              />
            <datalist id="providers">
              <option value="https://solidcommunity.net/" />
              <option value="https://login.inrupt.com/" />
              <option value="https://inrupt.net/" />
            </datalist>
            </span> <br></br>
            <LoginButton
               oidcIssuer={oidcIssuer}
               redirectUrl={window.location.href}
               authOptions={authOptions}
             />
             </div>
             )}
      </div>
      </div>
    );
  }
  
  export default Login;