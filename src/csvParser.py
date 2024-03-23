import pandas as pd
import os
from union import union
from difference import difference
from projection import projection,selection
from join import join
from intersection import intersection
from typing import Dict
from relationClasses import relationNode
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
def validRelationChar( char: str ) -> bool:
    return char.isalnum()

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
    newRelationNode = relationNode()
    newRelationNode.resolve(splitLine[0],pd.read_csv(file))
    for node in relations:
        if node.getUserInput() == newRelationNode.getUserInput():
            raise ValueError("Already assigned ",node.getUserInput()," to a csv")
    relations.append(newRelationNode)
    #print(len(inputList))
    return relations

if __name__ == '__main__':
    csvs = []
    test1 = "R =dinosaur.csv"
    print("TEST 1:\n")
    csvParser(line = test1,relations=csvs)
    print("\nTEST 2:\n")
    test2 = "S= pokedex.csv"
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
    for i in csvs:
        i.printNode()
    #print(csvs)
    df1 = pd.DataFrame({
        'A': [7, 2, 8, 1, 3],
        'B': ['a', 'b', 'c', 'd', 'e'],
        'C': [10.5, 20.3, 30.1, 40.7, 50.9],
        'D': [True, False, True, False, True],
        'E': ['apple', 'banana', 'orange', 'grape', 'kiwi']
    })

    df2 = pd.DataFrame({
    'A': [4, 1, 5, 6, 9],
    'B': ['x', 'y', 'z', 'w', 'v'],
    'C': [15.2, 25.6, 35.8, 45.3, 55.1],
    'D': [False, True, False, True, False],
    'E': ['pineapple', 'mango', 'strawberry', 'blueberry', 'watermelon']
    })
    #print("Union: \n" ,union(df1,df2))
    #print("Difference: \n",difference(df1,df2))
    #print("Projection: \n",projection(df1, ['A','C','E']))
    #print(df1)
    #print("Selection: \n", selection(df1,"A > 2 or B < 'e' or E = True"))
    #print(parenthetic_contents("((a(d*c)+ab)b+(c+d*a))"))
    #print(list(parenthetic_contents("((R x S) x T) and (V x B)")))
    #print("Cartesian: \n",join.cartesianProduct(df1,df2))
    #print("Intersection: \n",intersection(df1,df2))
    #print("Natural Join: \n",join.naturalJoin(df1,df2))

