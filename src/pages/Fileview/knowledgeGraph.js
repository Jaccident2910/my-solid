import {
    getSolidDataset,
    getFile
  } from "@inrupt/solid-client";


// This is the file for all future knowledge graph mining functions

function turtleTypeCheck(typeArray) {
    return (typeArray.includes("https://www.w3.org/ns/iana/media-types/text/turtle#Resource") || typeArray.includes("http://www.w3.org/ns/iana/media-types/text/turtle#Resource"))
}

async function getContentsOfTurtleFile(fileUrl, fetch) {
    return( await getSolidDataset(fileUrl, { fetch: fetch }))
}

function augmentPosts(postObj, turtleFile) {
    console.log("You gotta remember to delete all of these.")
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