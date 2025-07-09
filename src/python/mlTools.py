import json
import os
from sklearn import tree
import pickle
#import numpy.core.multiarray

# OPTIONS
#-----------------

inputName = "classifiedData1.json"
outputName = "classifiedData1.json"
treeFileName = "decisionTree.pickle"
listCategoryName = "listCategories.json"

dumpedInputName = "dumpedInput.json"

testOutputName = "testOutput.txt"
cbrOutputName = "cbrTestOutput.txt"
# ----------------

def numberClasses(classesDict):
    tagsDict = dict()
    numberedDict = dict()
    for key, value in classesDict.items():
        if value in tagsDict.keys():
            numberedDict[key] = tagsDict[value]
        else:
            numOfTags = len(tagsDict.keys())
            # This should be 1 more than the last number we assigned!
            tagsDict[value] = numOfTags
            numberedDict[key] = tagsDict[value]
    reverseTags = dict()
    for key1, value1 in tagsDict.items():
        reverseTags[value1] = key1
    return(numberedDict, reverseTags)
        


def decisionTreeCreator(preparedDict, classesDict):

    (numberedClasses, classTags) = numberClasses(classesDict)
    #X = [[0, 0], [1, 1]]

    #Y = [0, 1]

    X = []
    Y = []

    for key, value in preparedDict.items():
        thisArray = []
        for key1, value1 in value.items():
            thisArray.append(value1)
        X.append(thisArray)
        Y.append(numberedClasses[key])

    #should do some kind of train/test split at some point
    # Fairly happy with this though.

    clf = tree.DecisionTreeClassifier()

    clf = clf.fit(X, Y)
    return (clf, classTags)


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

def getDataDict(item, collatedTypes, collatedSearchPaths):
    # This will need to change as we add more data
    preparedItemDict = dict()
    for key1, value1 in item.items():
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
        # TODO: file extension analysis.
    return(preparedItemDict)

def prepareDataForDT(valsDict):
    collatedTypes = typeCollate(valsDict)
    collatedSearchPaths = searchPathCollate(valsDict)
    preparedDataDict = dict()
    for key, value in valsDict.items():
        preparedItemDict = getDataDict(value, collatedTypes, collatedSearchPaths)
        preparedDataDict[key] = preparedItemDict
    return(preparedDataDict, collatedTypes, collatedSearchPaths)#

def prepareDataForClassification(valsDict, collatedTypes, collatedSearchPaths):
    preparedDataDict = dict()
    for key, value in valsDict.items():
        preparedItemDict = getDataDict(value, collatedTypes, collatedSearchPaths)
        preparedDataDict[key] = preparedItemDict
    return(preparedDataDict)




def decisionTreesInterface(valsDict):
    if os.path.isfile('./' + inputName):
        inputFile = open(inputName, "r+")
        inputDict = json.loads(inputFile.read())
    else: 
        inputDict = dict()

    mainOption = input("(t)rain the decision tree, (u)pdate the decision tree, or (c)lassify new items?")
    if mainOption == "t":
        classifiedDict = dict()
        for key in valsDict.keys():
            if(key in inputDict):
                classifiedDict[key] = inputDict[key]
            else:
                newClass = input("What should be the classification of " + key + "? classification: ")
                classifiedDict[key] = newClass

       

        outputFile = open(outputName, "w+")
        outputFile.write(json.dumps(classifiedDict, indent=4))

        (preparedValsDict, mainTypes, mainSearchPaths) = prepareDataForDT(valsDict)
        (decisionTree, classTags) = decisionTreeCreator(preparedValsDict, classifiedDict)
        treeFile = open(treeFileName, "wb+")
        pickle.dump(decisionTree, treeFile)
        categoryDict = dict()
        categoryDict["types"] = mainTypes
        categoryDict["searchPaths"] = mainSearchPaths
        categoryDict["classTags"] = classTags
        jsonFile = open(listCategoryName, "w+")
        jsonFile.write(json.dumps(categoryDict, indent=4))

    elif mainOption == "u":
        # I need some way to update the dict by only touching the training set
        classifiedDict = dict()
        # only take in inputs from the classified set.
        for key in valsDict.keys():
            if key in inputDict:
                classifiedDict[key] = inputDict[key]

        cutValsDict = dict()
        for key in valsDict.keys():
            if key in inputDict:
                cutValsDict[key] = valsDict[key]

        outputFile = open(outputName, "w+")
        outputFile.write(json.dumps(classifiedDict, indent=4))

        (preparedValsDict, mainTypes, mainSearchPaths) = prepareDataForDT(cutValsDict)
        (decisionTree, classTags) = decisionTreeCreator(preparedValsDict, classifiedDict)
        treeFile = open(treeFileName, "wb+")
        pickle.dump(decisionTree, treeFile)
        categoryDict = dict()
        categoryDict["types"] = mainTypes
        categoryDict["searchPaths"] = mainSearchPaths
        categoryDict["classTags"] = classTags
        jsonFile = open(listCategoryName, "w+")
        jsonFile.write(json.dumps(categoryDict, indent=4))

    elif mainOption == "c":
        unclassifiedDict = dict()
        for key in valsDict.keys():
            if not(key in inputDict.keys()):
                unclassifiedDict[key] = valsDict[key]
        treeFile = open(treeFileName, "rb")
        loadedTree = pickle.load(treeFile)
        jsonFile = open(listCategoryName, "r")
        categorisedElements = json.loads(jsonFile.read())

        testOutputFile = open(testOutputName, "a+")

        classTags = categorisedElements["classTags"]
        preparedDict = prepareDataForClassification(unclassifiedDict, categorisedElements["types"], categorisedElements["searchPaths"])
        for key2, value2 in preparedDict.items():
            thisArray = []
            for key3, value3 in value2.items():
                thisArray.append(value3)
            if len(preparedDict.keys()) == 1:
                newArray = []
                newArray.append(thisArray)
                thisArray = newArray
            print("predicting key: " + key2)
            print("Array: ")
            print([thisArray])
            print("prediction: ")
            prediction = loadedTree.predict([thisArray])[0]
            print(prediction)
            print(classTags[str(prediction)])

            testOutputFile.write("predicting key: " + key2 + ", predicted " + classTags[str(prediction)] +"\n")



def getLabelledData(valsDict):
    import copy
    # get values from classifiedData1.json for now
    inputFile = open(inputName, "r+")
    labelsDict = json.loads(inputFile.read())
    #then check to see which values in their are in valsdict
    mergedDict = dict()
    for labelItem in labelsDict.keys():
        if (labelItem in valsDict):
            mergedItem = copy.deepcopy(valsDict[labelItem])
            mergedItem["label"] = labelsDict[labelItem]
            mergedDict[labelItem] = mergedItem
    # return a merging of the vals and classes?
    return(mergedDict)


def caseBasedReasoningInterface(valsDict):
    from cbr import getLabelledSimilarity, getQNearestLabels, linearConsensusFunction
    labelledDict = getLabelledData(valsDict)
    unlabelledDict = dict()
    for key, value in valsDict.items():
        if not (key in labelledDict):
            unlabelledDict[key] = value
    similarityDict = dict()
    newLabelledDict = dict()
    cbrOutputFile = open(cbrOutputName, "a+")
    for key, value in unlabelledDict.items():
        print("evaluating similarity to " + key)
        labelledSimilarity = getLabelledSimilarity(labelledDict, key, value, valsDict)
        similarityDict[key] = labelledSimilarity
        q = 11
        qNearestLabels = getQNearestLabels(key, q, similarityDict, labelledDict)
        winningLabel = linearConsensusFunction(qNearestLabels)
        print("label for", key)
        print(winningLabel)
        cbrOutputFile.write("label for: " + key + ", prediction " + winningLabel + "\n")
        newLabelledDict[key] = value
        newLabelledDict[key]["label"] = winningLabel

    # can do extra run with merge of new labelled dict and more elaborate revision section if wanted
    #returning the new labels for now

    
    
    return(newLabelledDict)



def interface(valsDict):
    interfaceOption = "n"
    while(not (interfaceOption == "y" or interfaceOption == "n")):
        interfaceOption = input("Would you like to write this input to a file? y/n")
    if interfaceOption == "y":
        jsonFile = open(dumpedInputName, "w+")
        jsonFile.write(json.dumps(valsDict, indent=4))
    newLabelledDict = caseBasedReasoningInterface(valsDict)
    return(newLabelledDict)
