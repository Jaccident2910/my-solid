import json
import os
from sklearn import tree
import numpy.core.multiarray

# OPTIONS
#-----------------

inputName = "classifiedData1.json"
outputName = "classifiedData1.json"

# ----------------

def numberClasses(classesDict):
    tagsDict = dict()
    numberedDict = dict()
    for key, value in classesDict:
        if value in tagsDict.keys():
            numberedDict[key] = tagsDict[value]
        else:
            numOfTags = len(tagsDict.keys)
            # This should be 1 more than the last number we assigned!
            tagsDict[value] = numOfTags
            numberedDict[key] = tagsDict[value]
    return(numberedDict)
        


def decisionTreeCreator(preparedDict, classesDict):

    numberedClasses = numberClasses(classesDict)
    #X = [[0, 0], [1, 1]]

    #Y = [0, 1]

    X = []
    Y = []

    for key, value in preparedDict.items():
        thisArray = []
        for key1, value1 in value:
            thisArray.append(value1)
        X.append(thisArray)
        Y.append(numberedClasses[key])

    #should do some kind of train/test split at some point
    # Fairly happy with this though.

    clf = tree.DecisionTreeClassifier()

    clf = clf.fit(X, Y)


def typeCollate(valsDict):
    collatedTypes = []
    for key, value in valsDict.items():
        valTypes = value["types"]
        for theType in valTypes:
            if not (theType in collatedTypes):
                collatedTypes.append(theType)
    print("collated types: ")
    print(collatedTypes)
    return(collatedTypes)

def searchPathCollate(valsDict):
    collatedSearchPaths = []
    for key, value in valsDict.items():
        valTypes = value["searchPath"]
        for thePath in valTypes:
            if not (thePath in collatedSearchPaths):
                collatedSearchPaths.append(thePath)
    print("collated search paths: ")
    print(collatedSearchPaths)
    return(collatedSearchPaths)

def prepareDataForDT(valsDict):
    collatedTypes = typeCollate(valsDict)
    collatedSearchPaths = searchPathCollate(valsDict)
    preparedDataDict = dict()
    for key, value in valsDict.items():
        preparedItemDict = dict()
        for key1, value1 in value:
            if (key1 == "types"):
                for theType in collatedTypes:
                    if theType in value1:
                        preparedItemDict[theType] = 1
                    else:
                        preparedItemDict[theType] = -1
            elif (key1 == "searchPath"):
                for thePath in collatedSearchPaths:
                    if thePath in value1:
                        preparedItemDict[thePath] = 1
                    else:
                        preparedItemDict[thePath] = -1
            # There should be other ways of converting the given information into something useful
            #TODO: file extension analysis.
        preparedDataDict[key] = preparedItemDict
    return(preparedDataDict)
def interface(valsDict):    
    if os.path.isfile('./' + inputName):
        inputFile = open(inputName, "r+")
        inputDict = json.loads(inputFile.read())
    else: 
        inputDict = dict()

    classifiedDict = dict()
    for key in valsDict.keys():
        if(key in inputDict):
            classifiedDict[key] = inputDict[key]
        else:
            newClass = input("What should be the classification of " + key + "? classification: ")
            classifiedDict[key] = newClass

    outputFile = open(outputName, "w+")
    outputFile.write(json.dumps(classifiedDict, indent=4))

    preparedValsDict = prepareDataForDT(valsDict)
    decisionTree = decisionTreeCreator(preparedValsDict)

