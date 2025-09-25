import { QueryEngine } from '@comunica/query-sparql-solid';
import { useSession, } from "@inrupt/solid-ui-react";


//detailsFunc takes in a location, an authenticated session, and a setterFunction, and uses the setterFunc 
// on the list of all children in that location, returning the children and the type.
export default function detailsFunc(rootURL, session, frontier, setFrontier, nodePathArr) {
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
   
    // get an authenticated comunica session.
    const myEngine = new QueryEngine();
    const queryEngine = new ComunicaEngine(rootURL,{ engine: myEngine })
    const path = new PathFactory({ context, queryEngine });
    const pod = path.create({ subject: namedNode(rootURL) });

    (async document => {
      console.log("doing details search on: ")
      console.log(rootURL)
      const bindingsStream = await myEngine.queryBindings(await `SELECT ?subject ?type WHERE {
?subject rdf:type ?type.
}`, {
        // Set your profile as query source
        sources: [rootURL],
        // Pass your authenticated session
        '@comunica/actor-http-inrupt-solid-client-authn:session': session,
      })
        const bindings = await bindingsStream.toArray();
        let subjectsList = []
        for(let entNum = 0; entNum < bindings.length ; entNum++) {
          const actualEntries = bindings[entNum].entries._root.entries

          // using objects instead of that horrific array structure is cleaner but more fragile.
          // NEVER change the query bindings if you want everything ending in .subject or .type to break.

          const entryObj = {}

          for (let i = 0 ; i < actualEntries.length ; i ++) {
          const [queryName, queryVal] = actualEntries[i]
          //console.log(queryName + ": " + queryVal.id)
          entryObj[queryName] = queryVal.id

          }
          
          entryObj.searchPath = nodePathArr.concat(rootURL)
          subjectsList.push(entryObj)
        }
        
        function updateFrontier (frontier, listOfSubjects) {
          // removes current node from BFS frontier
          let newList = []
          for (let i = 0 ; i < frontier.length ; i++) {
            if (frontier[i].subject != rootURL) {
              // duplicates removal:

              let duplicateFound = false
              
              for (let j = 0 ; j < newList.length ; j ++){
                if ((newList[j].subject == frontier[i].subject && newList[j].type == frontier[i].type)) {
                  duplicateFound = true
                }
                }
              
              if (!duplicateFound) {
                  newList.push(frontier[i])
              }
            }
          }
          // now to add the new parts - this makes it BFS not DFS

          for (let i = 0 ; i < listOfSubjects.length ; i++) {
            if (listOfSubjects[i].subject != rootURL) {
              let dupCheck2 = false
              for (let j = 0 ; j < newList.length ; j ++){
                if ((newList[j].subject == listOfSubjects[i].subject && newList[j].type == listOfSubjects[i].type)) {
                  dupCheck2 = true
                }
              }

              if (!dupCheck2) {
                newList.push(listOfSubjects[i])
              }
            } 
          }
          console.log("new List: ", newList)
          return(newList)
        }

        setFrontier((frontier) => {
          console.log("updating frontier: ")
          console.log(frontier)
          let freshFrontier = updateFrontier(frontier, subjectsList)
          console.log("fresh frontier: ")
          console.log(freshFrontier)
          return(freshFrontier)
        })
    })(pod);

    
}
