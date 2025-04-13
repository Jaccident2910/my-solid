import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef} from 'react';
import detailsFunc from "./Details"
import bfs from "./bfs"
import groupWithTypes from "./groupWithTypes";
import { turtleFileConsumer } from "./knowledgeGraph";
import { useAPI } from "./apiUse";
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
    .then(newStorage => {
      console.log("new storage: " + newStorage)
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
        .then(newStorage => {
          console.log("new storage: " + newStorage)
          storageSetter(`${newStorage}`) // This is a slighlt ridiculous way of doing this.
        }
        )
    }
    hookBody()
    console.log("root URL obtained.")
  }, [webID, storageSetter])


}

function useFrontierGetter(session, storageLoc, frontierSetter, nodePathArr) {
  useEffect(() => {
    detailsFunc(storageLoc, session, [], frontierSetter, nodePathArr)
    
    console.log("Initial frontier obtained.")
  }, [storageLoc, frontierSetter])
}

function useBFSInit(initFrontier, frontierSetter) {
  useEffect(() => {
    console.log("setting frontier to: ")
    console.log(initFrontier)
    frontierSetter(initFrontier)
  }, [initFrontier])
}



function containerCheck(node) {
  const containerURL = "https://www.w3.org/ns/ldp#Container"
  const containerURL2 = "http://www.w3.org/ns/ldp#Container"
  //console.log("checking containerness of:")
  //console.log(node)
  if (typeof node == "undefined") {return false}
  else {
    console.log(node.type == containerURL)
    return (node.type == containerURL || node.type == containerURL2)
  }
}



function getNodeVal(searchNode) {
  return (searchNode.subject)
}

function useBFS(session, frontier, setFrontier, setBfsDone) {


  useEffect(() => {
    console.log("Doing BFS with frontier: ")
    console.log(frontier)
    /*
    let newFrontier = {...initFrontier}
    let setNewFrontier = (newerFrontier) => {
      newFrontier = newerFrontier
      console.log("nectarine!")
      console.log(newFrontier)
    }
      */
    
    function nodeExpansion(searchNode) {
      console.log("Searching on " + searchNode.subject)
      console.log("phlegm")
      console.log(searchNode)
      detailsFunc(getNodeVal(searchNode), session, frontier, setFrontier, searchNode.searchPath)
    }
    
    bfs(frontier, containerCheck, getNodeVal, nodeExpansion, 10000, setFrontier, setBfsDone)
    console.log("meh")
    console.log(frontier)
    //setFrontier(newFrontier)

  }, [frontier, setFrontier])
}

function useTypeGrouping(frontier, bfsDoneFlag, setThingsWithTypes, setThingsGrouped) {

  
  useEffect(() => {
    if(bfsDoneFlag) {
      let newFrontier = frontier
      console.log("YIPPEEEE")
      let groupingObj = {}
      groupingObj = groupWithTypes(newFrontier, groupingObj)
      console.log(groupingObj)
      setThingsWithTypes(groupingObj)
      console.log("Type grouping set")
      setThingsGrouped(true)
    }
  }, [bfsDoneFlag, frontier, setThingsWithTypes])
}

function useTurtleFiles(thingsWithTypes, setAugmentedPosts, session, thingsGrouped, setTurtlesUsed) {
  useEffect(() => {
    if (thingsGrouped) {
      console.log("using turtle files from: ")
      console.log(thingsWithTypes)
      turtleFileConsumer(thingsWithTypes, setAugmentedPosts, session)
      setTurtlesUsed(true)
    }
  }, [thingsWithTypes, setAugmentedPosts])
}


function useAugmentedPosts(augmentedPosts, setReady, turtlesUsed) {
  useEffect(() => {
    if(turtlesUsed) {
      console.log("final, augmented posts: ")
      console.log(augmentedPosts)
      setReady(true)
    }
  }, [augmentedPosts])
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

  //state for initial frontier:
  const [initFrontier, setInitFrontier] = useState("")

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

  //state for bfs having finished:
  const [bfsDone, setBfsDone] = useState(false)
  //const [processingStarted, setProcessingStarted] = useState(false)

  //state for thing grouping:
  const [thingsGrouped, setThingsGrouped] = useState(false)

  //state for turtle files used:
  const [turtlesUsed, setTurtlesUsed] = useState(false)

  //state for post augmentation:
  const [postsAuged, setpostsAuged] = useState(false)

  //state for API readiness:
  const [apiReady, setApiReady] = useState(false)

console.log("Rendering Fileview again.")
  // So I have kind of been using useEffect wrong. I should try to build my own custom hooks to handle the profile and the detaisl

  useStorageGetter(session.info.webId, setStorageLoc)
  //setFrontier(frontier => [])
  //useFrontierGetter(session, storageLoc, setFrontier , [])
  useFrontierGetter(session, storageLoc, setInitFrontier, [])

  /*
  console.log(frontier)
  console.log("wahoo!!")
  console.log(frontier)
  */
  // We may need some way of tracking when each hook is done with its task fully - currently each one runs each time
  // the previous hook updates anything.

  // Load initial frontier into BFS frontier:
  useBFSInit(initFrontier, setFrontier)

  // Breadth-first search:
  useBFS(session, frontier, setFrontier, setBfsDone)

  // Group items into a dictionary
  useTypeGrouping(frontier, bfsDone, setThingsWithTypes, setThingsGrouped)

  useTurtleFiles(thingsWithTypes, setAugmentedPosts, session, thingsGrouped, setTurtlesUsed)

  useAugmentedPosts(augmentedPosts, setApiReady, turtlesUsed)

  const [sendToAPI, setSendToAPI] = useState("")

  
  useAPI(augmentedPosts, apiReady, setSendToAPI)
  //useAPI(augmentedPosts, apiReady, setApiReady)

  console.log("sendToAPI: ", sendToAPI)


  return (<div className="mainScreen max-w-4xl flex-1">
    <div className="app-container">
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
                Your pronouns are: <Text property="http://www.w3.org/ns/solid/terms#preferredObjectPronoun" /> <br></br>
                Your root of file storage should be at:
                {storageLoc}
              </h2>

              <button
                onClick={() => {
                  console.log("Button pressed!")
                  //console.log(typeof(sendToAPI))
                  sendToAPI()
                }}
              > WOOO</button>
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