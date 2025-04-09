// thingsWithTypes should have the shape:
/*
    object{thingURL} = {
      types: []
      searchPath: [] --- This should be the list from thing.searchPath, which SHOULD be the same for all instances 
      }
*/

export default function groupWithTypes(frontier, obj) {
    for (let i = 0 ; i < frontier.length ; i++) {
        if (obj.hasOwnProperty(frontier[i].subject)) {
            /*
            console.log(frontier[i].subject)
            console.log(frontier[i].type)
            console.log(obj[frontier[i].subject])
            console.log(obj[frontier[i].subject].types.concat([frontier[i].type]))
            */

            obj[frontier[i].subject].types = obj[frontier[i].subject].types.concat([frontier[i].type])
        }
        else {
            // beginning of list induction
            // ASSUMPTION - for a given subject, searchPath is constant across instances
            obj[frontier[i].subject] = {
                types: [frontier[i].type],
                searchPath: frontier[i].searchPath
            }
            /*
            console.log(frontier[i].subject)
            console.log(obj[frontier[i].subject])
            */
        }
    }
    console.log("melon :)")
    console.log(obj)
    return(obj)
}