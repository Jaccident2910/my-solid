



export default function bfs(frontier, validityCheck, getNodeVal ,searchFunc, maxIters, setResult, setDoneFlag) {
    // single iteration version: Use while loop and extra sanity check for full bfs!

    // This is actually an entire BFTS, with the for loop acting as an iterator through a queue that 
    // stops when the queue is empty. All expanded nodes have the results added to the end of the list, which
    // acts like adding them to the end of the queue

    // Note that this is a Breadth first *tree* search, so if there are loops in the file structure this will 
    // not terminate. However, this is a file structure - there shouldn't be loops anyway!

    console.log("Beginning BFS with frontier: ")
    console.log(frontier)


    // Ok so I think what's going on here is that we want each call to bfs to be one step of that bfs.
    // Then, once the frontier updates from the last BFS, we run the next step.


    let i = 0;
    console.log(frontier)
    while(!validityCheck(frontier[i]) && i < maxIters && typeof(frontier[i]) != "undefined") {i++}
    if (i > frontier.length || i > maxIters || typeof(frontier[i]) == "undefined") {
        console.log("BFS Finished. Frontier empty of explorable nodes.")
        setDoneFlag(true)
        if(i > frontier.length || i > maxIters) {
            //nevermind
        }
    }
    else {
        searchFunc(frontier[i])
    }




    /*    
    for (let i = 0 ; i < frontier.length && i < maxIters ; i++) {
        console.log("searching item: " + i)
        console.log(frontier[i])
        if(validityCheck(frontier[i])) {
            searchFunc(frontier[i])
        }
    }
        */

    setResult(frontier)
    //setBfsDone(true)

}