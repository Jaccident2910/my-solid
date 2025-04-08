



export default function bfs(frontier, validityCheck, getNodeVal ,searchFunc, maxIters) {
    // single iteration version: Use while loop and extra sanity check for full bfs!
    let initLength = frontier.length
    console.log("Begining depth 1 BFS")
    for (let i = 0 ; i < initLength && i < maxIters ; i++) {
        //console.log("searching item: ")
        //console.log(frontier[i])
        if(validityCheck(frontier[i])) {
            searchFunc(frontier[i])
        }
    }



}