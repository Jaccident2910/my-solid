import { QueryEngine } from '@comunica/query-sparql-solid';
import { useSession, } from "@inrupt/solid-ui-react";


function Details(props) {
    const {storageURL} = props
    const { PathFactory } = require('ldflex');
    const { default: ComunicaEngine } = require('@ldflex/comunica');
    const { namedNode } = require('@rdfjs/data-model');

    const {
      session,
      sessionRequestInProgress,
      fetch,
      login,
      logout,
    } = useSession();

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
      const queryEngine = new ComunicaEngine(storageURL);
      // The object that can create new paths
      const path = new PathFactory({ context, queryEngine });
      const pod = path.create({ subject: namedNode(storageURL) });

      (async document => {
        for await (const subject of document.subjects)
          console.log(`${subject}`);
      })(pod);
      */
      // Jank to get an authenticated comunica session.
      const myEngine = new QueryEngine();
      const queryEngine = new ComunicaEngine(storageURL,{ engine: myEngine })
      const path = new PathFactory({ context, queryEngine });
      const pod = path.create({ subject: namedNode(storageURL) });

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
          sources: [storageURL],
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
      })(pod);

      

      //TODO: Find a way to show all of these subjects, and allow the user to navigate to their subjects

    return(<p>
        Logged contents of {storageURL}!
    </p>)
}

export default Details