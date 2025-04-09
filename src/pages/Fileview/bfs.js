



export default function bfs(frontier, validityCheck, getNodeVal ,searchFunc, maxIters) {
    // single iteration version: Use while loop and extra sanity check for full bfs!

    // This is actually an entire BFTS, with the for loop acting as an iterator through a queue that 
    // stops when the queue is empty. All expanded nodes have the results added to the end of the list, which
    // acts like adding them to the end of the queue

    // Note that this is a Breadth first *tree* search, so if there are loops in the file structure this will 
    // not terminate. However, this is a file structure - there shouldn't be loops anyway!

    let initLength = frontier.length
    console.log("Beginning BFS")
    for (let i = 0 ; i < initLength && i < maxIters ; i++) {
        //console.log("searching item: ")
        //console.log(frontier[i])
        if(validityCheck(frontier[i])) {
            searchFunc(frontier[i])
        }
    }



}