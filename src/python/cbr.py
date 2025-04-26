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





metricDict = dict()

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

metricDict = setMetric(metricDict, constMetric, 1, None)
#---------------------------------



def getLabelledSimilarity(labelledDict, mainKey, mainValue):
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

    #---------------------------------------------

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
        