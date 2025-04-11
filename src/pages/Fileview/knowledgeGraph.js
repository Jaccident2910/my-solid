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


        if (Object.entries(turtleObj.graphs.default).length > 1) {
            return(turtleObj)
        }

        else {
        // This should only be one item long!
        console.assert(Object.entries(turtleObj.graphs.default).length == 1, turtleObj)

        //
        processedTurtleObj.thingURL = key0

        for (const [key1, value1] of Object.entries(value0.predicates)) {
            //processedTurtleObj[key1] = value1

            if(Object.hasOwn(value1, "namedNodes")) {
                if(value1.namedNodes.length == 1) {
                    processedTurtleObj[key1] = value1.namedNodes[0]
                }
                else if (value1.namedNodes.length > 1) {
                    processedTurtleObj[key1] = value1.namedNodes
                }
            }
            else if (Object.hasOwn(value1, "literals")) {
                for (const [key2, value2] of Object.entries(value1.literals)) {
                    // should only be 1 item long:
                    console.assert(Object.entries(value1.literals).length == 1, "literals was not of length 1", value1.literals)

                    processedTurtleObj[key1] = value2[0]
                }
            }
            else {
                processedTurtleObj[key1] = value1
            }
        }
      }
      //console.log("Processed turtle object: " + processedTurtleObj.thingURL )
      //console.log(processedTurtleObj)
      return(processedTurtleObj)
    }
}




function turtleTypeCheck(typeArray) {
    return (typeArray.includes("https://www.w3.org/ns/iana/media-types/text/turtle#Resource") || typeArray.includes("http://www.w3.org/ns/iana/media-types/text/turtle#Resource"))
}

async function getContentsOfTurtleFile(fileUrl, fetch) {
    return( await getSolidDataset(fileUrl, { fetch: fetch }))
}

function augmentPosts(postObj, turtleFile) {
    //console.log("Augmenting turtle post with turtle file: ")
    //console.log(turtleFile)

    let processedTurtleObj = readTurtlePostFormat(turtleFile)

    /* TODO: 
            - Finish processing on turtle posts - need caption and type and url info alone.
            - Apply this to the post being augmented!

    */
    if (Object.hasOwn(processedTurtleObj, "https://schema.org/contentURL")) {
        if(Object.hasOwn(postObj, processedTurtleObj["https://schema.org/contentURL"])) {
            //postObj[processedTurtleObj["https://schema.org/contentURL"]]

            for (const [key, value] of Object.entries(processedTurtleObj)) {
                if (key != "https://schema.org/contentURL") {
                    if(key == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" || key == "https://www.w3.org/1999/02/22-rdf-syntax-ns#type")
                        {
                            postObj[processedTurtleObj["https://schema.org/contentURL"]].types = postObj[processedTurtleObj["https://schema.org/contentURL"]].types.concat([value])   
                        }
                    else {
                        postObj[processedTurtleObj["https://schema.org/contentURL"]][key] = value
                    }
                }    
            }

        }
    }


}

export function turtleFileConsumer(inputItems, setOutputItems, session) {

    console.log("processing turtle files of:")
    const outputObj = {...inputItems}
    console.log(outputObj)
    // The current implementation does not consume the turtle files. I am unsure if this is what we want.

    for (const [key, value] of Object.entries(inputItems)) {
        console.assert(Array.isArray(value.types))
        if(turtleTypeCheck(value.types)) {
            // read turtle file
            getContentsOfTurtleFile(key, session.fetch).then((fileContents) => {
                //console.log("WAHOWZAH")
                //console.log(fileContents)
                augmentPosts(outputObj, fileContents)
            })
        }
        /* else {
            
        } */
    }

    setOutputItems(outputObj)

}