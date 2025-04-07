import { QueryEngine } from '@comunica/query-sparql-solid';
import { useSession, } from "@inrupt/solid-ui-react";


//detailsFunc takes in a location, an authenticated session, and a setterFunction, and uses the setterFunc 
// on the list of all children in that location, returning the children and the type.
export default function detailsFunc(rootURL, session, setterFunc) {
  const { PathFactory } = require('ldflex');
  const { default: ComunicaEngine } = require('@ldflex/comunica');
  const { namedNode } = require('@rdfjs/data-model');

  const context = {
      "@context": {
        "@vocab": "http://xmlns.com/foaf/0.1/",
        "friends": "knows",
        "label": "http://www.w3.org/2000/01/rdf-schema#label",
        "storage": "http://www.w3.org/ns/pim/space#storage",
        "preferredObjectPronoun": "http://www.w3.org/ns/solid/terms#preferredObjectPronoun"
      }
    };
    /*
    // The query engine and its source
    const queryEngine = new ComunicaEngine(rootURL);
    // The object that can create new paths
    const path = new PathFactory({ context, queryEngine });
    const pod = path.create({ subject: namedNode(rootURL) });

    (async document => {
      for await (const subject of document.subjects)
        console.log(`${subject}`);
    })(pod);
    */
    // Jank to get an authenticated comunica session.
    const myEngine = new QueryEngine();
    const queryEngine = new ComunicaEngine(rootURL,{ engine: myEngine })
    const path = new PathFactory({ context, queryEngine });
    const pod = path.create({ subject: namedNode(rootURL) });

    (async document => {
      console.log("doing stuff")
      /*or await (const sub of document.subjects) {
        console.log(`${sub}`)
        console.log(await document.subjects.sparql)
      } */
      const bindingsStream = await myEngine.queryBindings(await `SELECT ?subject ?type WHERE {
?subject rdf:type ?type.
}`, {
        // Set your profile as query source
        sources: [rootURL],
        // Pass your authenticated session
        '@comunica/actor-http-inrupt-solid-client-authn:session': session,
      })
        console.log("pineapple")
        const bindings = await bindingsStream.toArray();
        console.log(bindings)
        let subjectsList = []
        for(let entNum = 0; entNum < bindings.length ; entNum++) {
          const actualEntries = bindings[entNum].entries._root.entries
          const entryList = []
          //console.log("mango")
          //console.log(actualEntries)
          for (let i = 0 ; i < actualEntries.length ; i ++) {
          const [queryName, queryVal] = actualEntries[i]
          //console.log(queryName + ": " + queryVal.id)
          entryList.push([queryName, queryVal.id])
          /*console.log(actualEntries)
          console.log(actualEntries[1].id) */
          }
          subjectsList.push(entryList)
        }
        //console.log(bindings[0].get('s').value);
        //console.log(bindings[0].get('s').termType);#


        console.log(subjectsList)
        console.log("applying setterFunc")

        
        function updateFrontier (frontier, listOfSubjects) {
          // TODO: remove duplicates from frontier!
          
          console.log("kazoo")
          // removes current node from BFS frontier
          let newList = []
          for (let i = 0 ; i < frontier.length ; i++) {
            if (frontier[i][0][1] != rootURL) {
              newList.push(frontier[i])
            }
          }
          // now to add the new parts - this makes it BFS not DFS

          for (let i = 0 ; i < listOfSubjects.length ; i++) {
            if (listOfSubjects[i][0][1] != rootURL) {
              newList.push(listOfSubjects[i])
            }
          }

          return(newList)
        }

        setterFunc(frontier => updateFrontier(frontier, subjectsList))
    })(pod);

    
}
