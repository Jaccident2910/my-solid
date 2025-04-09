import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef, } from 'react';
import detailsFunc from "./Details"
import bfs from "./bfs"
import groupWithTypes from "./groupWithTypes";
import { turtleFileConsumer } from "./knowledgeGraph";
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
/* Putting this here in case I need it later??
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
        }, [webID, storageSetter])
    

}

function useFrontierGetter(session, storageLoc, frontierSetter, nodePathArr) {
  useEffect(() => {
  detailsFunc(storageLoc, session, frontierSetter, nodePathArr)
  }, [session, storageLoc, frontierSetter, nodePathArr])
}

function containerCheck(node) {
  const containerURL = "https://www.w3.org/ns/ldp#Container"
  const containerURL2 = "http://www.w3.org/ns/ldp#Container"
  console.log("checking containerness of:")
  console.log(node)
  console.log(node.type == containerURL)
  return(node.type == containerURL || node.type == containerURL2)
}



function getNodeVal(searchNode) {
  return(searchNode.subject)
}

function useBFS(frontier, session, setFrontier) {
  useEffect(() => {
    function nodeExpansion(searchNode) {
      console.log("Searching on " +searchNode.subject)
      console.log("phlegm")
      console.log(searchNode)
      detailsFunc(getNodeVal(searchNode), session, setFrontier, searchNode.searchPath)
    }


    bfs(frontier, containerCheck, getNodeVal, nodeExpansion, 10000)
    console.log("meh")
    console.log(frontier)
  }, [frontier, session, setFrontier])
}

function useTypeGrouping(frontier, setThingsWithTypes) {
  useEffect(() => {
    let groupingObj = {}
    groupingObj = groupWithTypes(frontier, groupingObj)
    console.log(groupingObj)
    setThingsWithTypes(groupingObj)
  }, [frontier, setThingsWithTypes])
}

function useTurtleFiles(thingsWithTypes, setAugmentedPosts, session) {
  useEffect(() => {
    let newObj = turtleFileConsumer(thingsWithTypes, setAugmentedPosts, session)
    console.log("peach")
    console.log(newObj)
    setAugmentedPosts(newObj)
  })
}

export default function Fileview() {
const {
    session,
    sessionRequestInProgress,
    fetch,
    login,
    logout,
} = useSession();
// state for location of root storage
const [storageLoc, setStorageLoc] = useState("")

//state for frontier of BFS
const [frontier, setFrontier] = useState("")

// state for dictionary of each item in pod.

// thingsWithTypes should have the shape:
/*
    object{thingURL} = {
      types: []
      searchPath: [] --- This should be the list from thing.searchPath, which SHOULD be the same for all instances 
      }
*/
const [thingsWithTypes, setThingsWithTypes] = useState("")

// state for posts augmented by turtle files. 
const [augmentedPosts, setAugmentedPosts] = useState("")





// So I have kind of been using useEffect wrong. I should try to build my own custom hooks to handle the profile and the detaisl

useStorageGetter(session.info.webId, setStorageLoc)
//setFrontier(frontier => [])
//useFrontierGetter(session, storageLoc, setFrontier , [])
useFrontierGetter(session, storageLoc, setFrontier , [])


console.log(frontier)
console.log("wahoo!!")
console.log(frontier)

// We may need some way of tracking when each hook is done with its task fully - currently each one runs each time
// the previous hook updates anything.

// Breadth-first search:
useBFS(frontier, session, setFrontier)

// Group items into a dictionary
useTypeGrouping(frontier, setThingsWithTypes)

useTurtleFiles(thingsWithTypes, setAugmentedPosts, session)



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