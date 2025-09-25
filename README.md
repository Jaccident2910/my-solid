# MySolid
MySolid aims to provide a way of categorising social media data stored in a SoLiD pod, so that this data can be presented to users in a more intuitive way than its storage location inside the SoLiD pod. It does so using either Decision Trees or Case-Based Reasoning as the basis of its classification, and also does a breadth-first-search of the knowledge graph which underpins a SoLiD pod to find all the items to be categorised, annotating each item with the relevant semantics from the knowledge graph.

## Running the program
run ``npm start`` in the main project directory, and then in another terminal run ``fastapi dev api.js`` inside ``/src/python/`` to run the python side of the script

## Further Context
This was done as the basis for my third year project doing CS at Oxford University, and after a tumultuous third year it is significantly less polished than I would have liked. Still, I am making this git repository public to showcase the work I have done. 
