import { useEffect, useState, useRef, } from 'react';
import { useSession, } from "@inrupt/solid-ui-react";
import Details from "./Details.js"





    function Profile(props) {
        const {
            session,
            sessionRequestInProgress,
            fetch,
            login,
            logout,
          } = useSession();


    const {webID} = props
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

      const [storageLoc, setStorageLoc] = useState("")
      let changedId = false;

      const userNode = path.create({ subject: namedNode(webID) });
        showPerson(userNode);

    async function showPerson(person) {
        console.log(`This person is ${await person.name}`);

        console.log(`${await person.name} is friends with:`);
        for await (const name of person.friends.name)
            console.log(`- ${name}`);
        console.log(`The root file storage is at: ${await person.storage}`)
    }

    useEffect(()=> {
        async function fetchStorage() {
        let newStore = await userNode.storage
        .then( newStorage => {console.log("new storage: ")
            setStorageLoc(`${newStorage}`) // This is a slighlt ridiculous way of doing this.
            }
        )
    }
    fetchStorage()
    }
    //, [userNode]
    )

    /*(async document => {
        for await (const subject of document.subjects)
          console.log(`${subject}`);
      })(ruben); */

      //<Details storageURL="https://jaccident.solidcommunity.net/private/"/>
      //<Details storageURL={storageLoc}/>
        return (<>
            <p>{storageLoc}</p>
            <Details storageURL={storageLoc}/>
            
            </>
        );
    //(<>
    //{await userNode.storage}
    //</>)
}


export default Profile