import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef, } from 'react';
import detailsFunc from "./Details"
import {
    LoginButton,
    Text,
    Value,
    useSession,
    CombinedDataProvider,
    useDataset
  } from "@inrupt/solid-ui-react";
  
  
async function getProfile(webID, storageSetter) {
    const { PathFactory } = require('ldflex');
    const { default: ComunicaEngine } = require('@ldflex/comunica');
    const { namedNode } = require('@rdfjs/data-model');

    const context = {
        "@context": {
          "@vocab": "http://xmlns.com/foaf/0.1/",
          "friends": "knows",
          "label": "http://www.w3.org/2000/01/rdf-schema#label",
          "storage": "http://www.w3.org/ns/pim/space#storage",
          "user": webID
        }
      };
      


      // The query engine and its source
      const queryEngine = new ComunicaEngine(webID);
      // The object that can create new paths
      const path = new PathFactory({ context, queryEngine });
      //const storageRef= useRef(null)
      //storageRef.current = webID

      //const [storageLoc, setStorageLoc] = useState("")
      let changedId = false;

      const userNode = path.create({ subject: namedNode(webID) });

   // useEffect(()=> {
        let newStore = await userNode.storage
        .then( newStorage => {console.log("new storage: " + newStorage)
            storageSetter(`${newStorage}`) // This is a slighlt ridiculous way of doing this.
            }
        )
}

//trying again

function useStorageGetter(webID, storageSetter) {

  useEffect(() => {
  async function hookBody() {
    const { PathFactory } = require('ldflex');
      const { default: ComunicaEngine } = require('@ldflex/comunica');
      const { namedNode } = require('@rdfjs/data-model');

      const context = {
        "@context": {
          "@vocab": "http://xmlns.com/foaf/0.1/",
          "friends": "knows",
          "label": "http://www.w3.org/2000/01/rdf-schema#label",
          "storage": "http://www.w3.org/ns/pim/space#storage",
          "user": webID
        }
      };
        // The query engine and its source
        const queryEngine = new ComunicaEngine(webID);
        // The object that can create new paths
        const path = new PathFactory({ context, queryEngine });
        const userNode = path.create({ subject: namedNode(webID) });
        await userNode.storage
          .then( newStorage => {
              console.log("new storage: " + newStorage)
              storageSetter(`${newStorage}`) // This is a slighlt ridiculous way of doing this.
              }
          )
        }
        hookBody()
        }, [])
    

}

function useFrontierGetter(session, storageLoc, frontierSetter) {
  useEffect(() => {
  detailsFunc(storageLoc, session, frontierSetter)
  }, [storageLoc])
}


export default function Fileview() {
const {
    session,
    sessionRequestInProgress,
    fetch,
    login,
    logout,
} = useSession();
const [storageLoc, setStorageLoc] = useState("")
const [frontier, setFrontier] = useState("")
/*
useEffect(()=> {
    
    async function runProfile() {
        await getProfile(session.info.webId, setStorageLoc).then(storeLoc => {
            console.log("mango")
            console.log(storageLoc)
            detailsFunc(storageLoc, session, setFrontier)
            console.log("kiwi")
            console.log(frontier)
        })
    }
    runProfile()

    
})
*/

// So I have kind of been using useEffect wrong. I should try to build my own custom hooks to handle the profile and the detaisl

useStorageGetter(session.info.webId, setStorageLoc)
useFrontierGetter(session, storageLoc, setFrontier)

console.log("wahoo!!")
console.log(frontier)


return (<div className="mainScreen max-w-4xl flex-1">
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
              {storageLoc} 
            </h2>
          </div>
        </CombinedDataProvider>
      ) : (
        <div className="message logged-out">
          <span>You are not logged in. </span> <br></br>
          <NavLink to="/login"> <button className="loginButton">Log In</button></NavLink>
        </div>
           )}
    </div>
    </div>
);
}