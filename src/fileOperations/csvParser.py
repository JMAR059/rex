from typing import Dict
from src.relationalAlgebra.relationNodes import relationNode
import os
import pandas as pd

# Simple wrapper functionality 

def whiteSpaceHandler( line: str ) -> str:
    #print(line)
    cleaned = ""
    previousWasSpace = False
    for char in line:
        if not(previousWasSpace and char == ' '):
            cleaned += char
        previousWasSpace = True if char == ' ' else False

    return cleaned


def rexSplitLine( line: str ) -> [str]:
    line = line.replace(" ","")
    cleaned = whiteSpaceHandler(line)
    cleanedList = cleaned.split(sep='=')
    newClean = [i for i in cleanedList if i != ""]
    if len(newClean) == 1:
        if ".csv" in newClean:
            raise ValueError("Cannot assign ",newClean[0]," to a value")
        else:
            raise ValueError("Cannot assign ",newClean[0]," to a csv")
    else:
        return newClean


def csvParser(line: str , relations: list = None):
    #print("Line:" ,line)
    splitLine = rexSplitLine(line)
    #print("Split Line: ", splitLine)
    currentDirectory = os.getcwd()
    #print("Current Directory: ",currentDirectory)
    dataTableFolder = os.path.join(currentDirectory, 'dataTables')
    file = os.path.join(dataTableFolder,splitLine[1])
    #print(file)
    #print(pd.read_csv(file))
    if not os.path.isfile(file):
        raise ValueError("File does not exist:", file)
    newRelationNode = relationNode(userInput = splitLine[0])
    if splitLine[0] in relations:
        raise ValueError("Already assigned ",splitLine[0]," to a csv")
    newRelationNode.resultDF = pd.read_csv(file)
    relations[splitLine[0]] = pd.read_csv(file)
    #print(len(inputList))
    return relations


if __name__ == '__main__':
    csvs = {}
    test1 = "R =dinosaur.csv"
    print("TEST 1:\n")
    csvParser(line = test1,relations=csvs)
    print("\nTEST 2:\n")
    test2 = "S= pokedex.csv" # pokedex.csv may be spaced strangely
    csvParser(line = test2,relations=csvs)
    print("\nTEST 3:\n")
    test3 = "X = "
    #csvParser(line = test3,relations=csvs)
    print("\nTEST 4:\n")
    test4 = "sdfds.csv"
    #csvParser(line = test4,relations=csvs)
    print("\nTEST 5:\n")
    test5 = "R = pokedex.csv"
    #csvParser(line = test5,relations=csvs)
    print(csvs['R']) # Should be dinosaurs, since it was the first 'R' relation defined