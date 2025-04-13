import { useEffect, useState, useRef, } from 'react';


//JSON.stringify is misbehaving :(

function convertSubObjectToJSON(subObj) {
    console.log("working on: ", subObj) 
    console.log(subObj["thingURL"])
    for (const [key, value] of Object.entries(subObj)) {
        console.log("key: ", key, "value: ", value, "obj", subObj)
    }
}

function convertObjToJSON(valuesObj) {
    console.log("converting: ", valuesObj)
    let newJSON = "{"
    for (const [key, value] of Object.entries(valuesObj)) {
        console.log(valuesObj[key], "is value from ", key," thingURL:"  ,valuesObj[key]["thingURL"] ,"inside :", valuesObj)
        let stringVal = `"${key}": ` + JSON.stringify(value) + ","
        //convertSubObjectToJSON(valuesObj[key])
        //console.log(`Logging item ${key} as: `, stringVal)
        newJSON += stringVal
    }
    newJSON = newJSON.slice(0, -1) + "}"

    console.log("test parse: ", JSON.parse(newJSON))

    console.log("final JSON: ", newJSON)
}


export function useAPI(valuesObj, readyFlag, setAPIFunction) {


    const [returnedData, setReturnedData] = useState();
    useEffect(() => {
    const doAPIStuff = () => {
 
   // useEffect(() => {
        console.log("readyFlag: ", readyFlag, "object: ", valuesObj)
        if (readyFlag) {
            console.log("Using API on object: ", valuesObj)
            //console.log("Result of conversion: ", JSON.parse(convertObjToJSON(valuesObj)))
            console.log("API body: ", JSON.stringify(valuesObj))


            // POST request using fetch inside useEffect React hook
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(valuesObj)
                
            };
            fetch('http://localhost:8000/items/', requestOptions)
                .then(response => response.json())
                .then((data) => {
                    console.log("recieved value from API: ")
                    console.log(data)
                    setReturnedData(data)
                });
            //setApiReady(false)
        }
    //}, [valuesObj, readyFlag]);

         
  };

  setAPIFunction(() => doAPIStuff)
    }, [readyFlag,valuesObj])

}