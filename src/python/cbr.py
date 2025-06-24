class Metric:
    def __init__(self, name, evaluationFunction):
        self.name = name
        self.score = evaluationFunction

class MetricInterface:
    def __init__(self, metric, optionalWeights):
        self.metric = metric
        self.optionalWeights = optionalWeights



    def getScore(self, item, linearWeight):
        metricScore = self.metric.score(item, self.optionalWeights)
        return(metricScore * linearWeight)

# We can then have a dict where for each item you store the linearWeight, MetricInterface pair

# We will also have a dict where we store for each metric, the linear weight for that metric, 
# any optional weights, and the metric itself







def setMetric(theDict, metric, linearWeight, optionalWeights):
    theDict[metric.name] = {
    "metric": metric,
    "linearWeight": linearWeight,
    "optionalWeights": optionalWeights
    }
    # I have no idea if python passes by value or by reference.
    return(theDict)


# -------- TEST METRIC --------
def constEval(item):
    return 1

constMetric = Metric("Test Metric", constEval)
#metricDict[constMetric.name] = {
#    "metric": constMetric,
#    "linearWeight": 1,
#    "optionalWeights": None
#}

#metricDict = setMetric(metricDict, constMetric, 1, None)
#---------------------------------



def getLabelledSimilarity(labelledDict, mainKey, mainValue):
    metricDict = dict()

    # -------- TEST METRIC --------
    def constEval(item, optionalWeightings):
        return 1

    constMetric = Metric("Test Metric", constEval)
    #metricDict[constMetric.name] = {
    #    "metric": constMetric,
    #    "linearWeight": 1,
    #    "optionalWeights": None
    #}

    metricDict = setMetric(metricDict, constMetric, 1, None)
    # ---------------------------------
    # ---------- TYPE SIMILARITY METRIC ----------
    collatedTypes = []
    for key, value in labelledDict.items():
        valTypes = value["types"]
        for theType in valTypes:
            if not (theType in collatedTypes):
                collatedTypes.append(theType)
    # Let's just go for number of similar types:
    def typeMeasure(item, optionalWeightings):
        commonTypeCount = 0
        for theType in item["types"]:
            if theType in mainValue["types"]:
                commonTypeCount += 1
        return(commonTypeCount)
    typeMetric = Metric("Common Type Metric", typeMeasure)
    metricDict = setMetric(metricDict, typeMetric, 1, None)

    # -------------------------------------------- 
    # NEXT METRIC
    # --------------------------------------------
    # --------- LINEAR LOCATION METRIC -----------
    def linearFileMeasure(item, optionalWeightings):
        commonLocationCount = 0
        for location in item["searchPath"]:
            if location in mainValue["searchPath"]:
                commonLocationCount += 1
        return(commonLocationCount)
    linearFileMetric = Metric("Linear File Metric", linearFileMeasure)
    metricDict = setMetric(metricDict, linearFileMetric, 1, None)
    # --------------------------------------------
    # --------- FALLOFF LOCATION METRIC ----------
    def falloffFileMeasure(item, optionalWeightings):
        commonLocationCount = 0
        for location in item["searchPath"]:
            if location in mainValue["searchPath"]:
                commonLocationCount += 1
        # Exponent Amount is the value unrelated to the common locations in the formula, e.g. used for quadratic falloff
        exponentAmount = optionalWeightings["exponentAmount"]
        # Exponent Factor used to include common loc count in the formula, e.g. used for exponential falloff
        exponentFactor = optionalWeightings["exponentFactor"]
        # Base Amount is the constant amount multiplied by in the base of the exponent
        baseAmount = optionalWeightings["baseAmount"]
        # Base Factor is the common loc count included in the base of the exponent
        baseFactor = optionalWeightings["baseFactor"]

        #baselineDepth is the amount you should get if you have a complete match for most things, i.e. the average depth of an item
        baselineDepth = optionalWeightings["baselineDepth"]

        itemVal = (baseAmount + baseFactor * (commonLocationCount))**(exponentAmount + exponentFactor* (commonLocationCount))
        baselineVal = (baseAmount + baseFactor * (baselineDepth))**(exponentAmount + exponentFactor* (baselineDepth))
        return(itemVal/baselineVal)
    falloffFileMetric = Metric("Linear File Metric", falloffFileMeasure)
    quadraticFalloffDict = {
        "exponentAmount": 2,
        "exponentFactor": 0,
        "baseAmount": 0,
        "baseFactor": 1,
        "baselineDepth": 3
    }
    metricDict = setMetric(metricDict, falloffFileMetric, 2, quadraticFalloffDict)
    exponentialFalloffDict = {
        "exponentAmount": 0,
        "exponentFactor": 1,
        "baseAmount": 2,
        "baseFactor": 0,
        "baselineDepth": 3
    }
    metricDict = setMetric(metricDict, falloffFileMetric, 2, exponentialFalloffDict)

    # Generating metric interfaces

    interfacesDict = dict()
    for key3, value3 in metricDict.items():
        newInterface = MetricInterface(value3["metric"], value3["optionalWeights"])
        interfacesDict[key3] = {
            "interface": newInterface,
            "linearWeight": value3["linearWeight"],
        }
    ## Applying metrics
    similarityDict = dict()
    for key2, value2 in labelledDict.items():
        metricValuesDict = dict()
        for key4, interfaceObj in interfacesDict.items():
            metricValuesDict[key4] = interfaceObj["interface"].getScore(value2, interfaceObj["linearWeight"])
        similarityDict[key2] = metricValuesDict

    # This may be a bit more involved later, or just unnecessarily complicated

    scoresDict = dict()
    for key5, value5 in similarityDict.items():
        score = 0
        for key6, value6 in value5.items():
            score += value6
        scoresDict[key5] = score
    
    return(scoresDict)

    # Now we need to do the q-nearest neighbours stuff!
        
def getQNearestLabels(item, q, scoresDict, labelledDict):
    qNearestLabels = []
    lowestScore = 0
    for key, value in scoresDict[item].items():
        # value should just be the score
        #print("value: ", value)
        #print("q nearest labels: ")
        #for item in qNearestLabels:
        #    print(item)
        if value >= lowestScore or (value < lowestScore and len(qNearestLabels) < q):
            i = 0
            if(len(qNearestLabels) > 0):
                (item, score) = qNearestLabels[i]
                while(i < len(qNearestLabels) and score > value):
                    i += 1
                    if(i < len(qNearestLabels)):
                        (item, score) = qNearestLabels[i]
            #print("insertion point: ", i)
            qNearestLabels.insert(i, (key, value))
            qNearestLabels = qNearestLabels[:q]
            #print("lowestScore: " , qNearestLabels[len(qNearestLabels)-1])
            lowestScore = qNearestLabels[len(qNearestLabels)-1][1]
    print("q nearest labels: ")
    for item in qNearestLabels:
        print(item)
    qLabelsDict = dict()
    for key1, score1 in qNearestLabels:
        qLabelsDict[key1] = labelledDict[key1]
        qLabelsDict[key1]["score"] = score1
    return(qLabelsDict)

def linearConsensusFunction(annotatedDict):
    # assume each item has a dict with key score

    # doing basic popularity consensus:
    labelScoreDict = dict()
    for key, value in annotatedDict.items():
        if value["label"] in labelScoreDict:
            labelScoreDict[value["label"]] = labelScoreDict[value["label"]] + 1
        else:
            labelScoreDict[value["label"]] = 1
     
    # find winning label
    winnerLabel = None
    winnerScore = 0
    for key1, value1 in labelScoreDict.items():
        if value1 > winnerScore:
            winnerLabel = key1
            winnerScore  = value1
    return(winnerLabel)