import {
    getSolidDataset,
    getFile
  } from "@inrupt/solid-client";
// This is the file for all future knowledge graph mining functions

function readTurtlePostFormat(turtleObj) {
    // This part is specific to the post format I used when creating my image posts. 
    // There is a .ttl file that specifies there being a thing called a post with specific attributes.
    // Time to process that!

    let processedTurtleObj = {}

    for (const [key0, value0] of Object.entries(turtleObj.graphs.default)) {
        //console.log(`${key}: ${value}`);

        // This should only be one item long!
        console.assert(Object.entries(turtleObj.graphs.default).length == 1)

        //
        processedTurtleObj.thingURL = key0

        for (const [key1, value1] of Object.entries(value0.predicates)) {
            processedTurtleObj[key1] = value1
        }
      }
      console.log("Processed turtle object: " + processedTurtleObj.thingURL )
      console.log(processedTurtleObj)
      return(processedTurtleObj)

}




function turtleTypeCheck(typeArray) {
    return (typeArray.includes("https://www.w3.org/ns/iana/media-types/text/turtle#Resource") || typeArray.includes("http://www.w3.org/ns/iana/media-types/text/turtle#Resource"))
}

async function getContentsOfTurtleFile(fileUrl, fetch) {
    return( await getSolidDataset(fileUrl, { fetch: fetch }))
}

function augmentPosts(postObj, turtleFile) {
    console.log("Augmenting turtle post with turtle file: ")
    console.log(turtleFile)

    let processedTurtleObj = readTurtlePostFormat(turtleFile)

    /* TODO: 
            - Finish processing on turtle posts - need caption and type and url info alone.
            - Apply this to the post being augmented!

    */
}

export function turtleFileConsumer(inputItems, setOutputItems, session) {
    const outputObj = {...inputItems}

    for (const [key, value] of Object.entries(inputItems)) {
        console.assert(Array.isArray(value.types))
        if(turtleTypeCheck(value.types)) {
            // read turtle file
            getContentsOfTurtleFile(key, session.fetch).then((fileContents) => {
                console.log("WAHOWZAH")
                console.log(fileContents)
                augmentPosts(outputObj, fileContents)
            })
        }
        /* else {
            
        } */
    }

}