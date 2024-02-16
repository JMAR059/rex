
from REsymbols import symbols
from typing import Dict
from relationClasses import relationNode, setOperationNode
import pandas as pd


def whiteSpaceHandler( line: str ) -> str:

    cleaned = ""

    previousWasSpace = False
    for char in line:

        if not(previousWasSpace and char == ' '):
            cleaned += char

        previousWasSpace = True if char == ' ' else False

    return cleaned


def rexSplitLine( line: str ) -> [str]:

    cleaned = whiteSpaceHandler(line)

    return cleaned.split(sep=' ')

def symbolize( line: str ) -> str:

    result = line

    for symbol in symbols:
        result = result.replace(symbol, symbols[symbol])

    return result


def validRelationChar( char: str ) -> bool:
    return char.isalnum()


def relationalParser( line: str , relations: Dict[str, pd.DataFrame] ) -> pd.DataFrame:

    line = ""
    headRelationNode = None
    
    lhsNode = None
    rhsNode = None
    op = ""
    condition = ""
    opType = ""
    

    index = 0
    mode = "start"
    while(index < len(line) + 1):

        if index == len(line):
            break
        char = line[index]
        if char == " ":
            index += 1
            continue

        if mode == "build":
            # do stuff and set mode back to finding op
            continue

        # relationFIND
        if validRelationChar(char) and (mode == "start" or mode == "relation"):
            
            # Case for parenthesis ignore looping below

            relation = ""
            while(index < len(line) and validRelationChar(char)):

                char = line[index]
                relation += char
                index += 1
            
            if relation == "":
                raise ValueError(f"Expected relation at index {index} with line: {line}")
            if relations != None and relation not in relations:
                raise ValueError(f"Relation {relation} not known")

            newNode = relationNode(userInput=relation, 
                                   resultDF = relations[relation] if relations != None else None)
            
            if lhsNode is None:
                lhsNode = newNode
                mode = "operation"
            else:
                rhsNode = newNode
                mode = "build"
        
        elif char in symbols.values() and (mode == "start" or mode == "operation"):

            # check based on symbol, set op and op type, make mode according to op
            
            


if __name__ == "__main__":

    testLine = "R intersect S X A"

    print("Here is the current line: " + testLine)

    # whiteSpaceResult = whiteSpaceHandler(testLine)

    # print("Here is what it is now: " + whiteSpaceResult)

    # fullResult = rexSplitLine(testLine)

    # print("Now here is what we have with the full process: " + str(fullResult))
    
    testLine = symbolize(testLine)

    print("This is testLine after symbolize: " + testLine)




