import json 
from inspect import get_annotations

def convertToDict(itemObj):
    newDict = itemObj.dict()
    print("Loaded! The type is: ")
    print(type(itemObj))
    return(newDict)
    #print("the item:")
    #for key, value in newDict.items():
    #    print("key: \n")
    #    print(key)
    #    print("\n")
    #    print("value: \n")
    #    print(value)
    #    print("\n")
