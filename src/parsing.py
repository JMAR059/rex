from REsymbols import symbols, setOpSymbols, joinOpSymbols, singleOpSymbols
from typing import Dict
from relationClasses import relationNode, setOperationNode, singleOpNode, joinOpNode, joinOpWithConditionNode
from relationBoolean import booleanParsing
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


def relationalParser( line: str , relations: Dict[str, pd.DataFrame] = None, debug = False) -> relationNode:

    lhsNode = None
    rhsNode = None
    op = ""
    condition = ""
    opType = ""
    

    if debug:
        print(f"Starting to parse: {line}")

    index = 0
    mode = "start" #change mode to set for better optimization?
    while(index < len(line) + 1):

        if mode == "build":
            # build relation node and set mode back to finding op
            if op in setOpSymbols:
                if (lhsNode == None or rhsNode == None or op == ""):
                    raise ValueError("One or more varaibles not set in set operation building") 

                if debug:
                    print(f"Index {index}: Making set operation of {op} between {lhsNode} and {rhsNode}")
                newNode = setOperationNode( LHSVariable=lhsNode, RHSVariable=rhsNode, setOp=op, userInput=line[0:index])

                lhsNode = newNode
                
            elif op in singleOpSymbols:
                if (lhsNode == None or op == "" or condition == ""):
                    raise ValueError("One or more varaibles not set in singleton building") 
                
                if debug:
                    print(f"Index {index}: Making singleton operation of {op} for {lhsNode} with condition:{condition}")

                newNode = singleOpNode(SingleVariable=lhsNode, singleOp=op, condition=condition, userInput=line[0:index])

            elif op in joinOpSymbols:
                
                if (lhsNode == None or op == "" or rhsNode != None):
                    raise ValueError("One or more varaibles not set in join building") 
        
                if debug:
                    print(f"Index {index}: Making join operation of {op} for {lhsNode} | {rhsNode} with condition:{condition}")

                newNode = joinOpNode(LHSVariable=lhsNode, RHSVariable=rhsNode, joinOp=op, condition=condition, userInput=line[0:index])

            else:
                raise ValueError(f"Operation not found, current op {op}")

            #Reset variables
            mode = "operation"
            rhsNode = None
            op = ""
            condition = ""
            continue

        if index == len(line):
            break
        char = line[index]
        if char == " ":
            index += 1
            continue

        if debug:
            print(f"Index {index}: with char -- {char}")

        # relationFIND
        if "comparison" in mode and char == '{':
            conditionLine = ""
            index += 1
            while (index < len(line) and char != '}'):
                char = line[index]
                conditionLine += char
                index += 1
            
            if debug:
                print(f"Index {index}: found conditon: {conditionLine}")
            
            condition = conditionLine

        elif (validRelationChar(char)  or char == '(') and (mode == "start" or "relation" in mode):
            
            # Case for parenthesis ignore looping below
            if char == '(':
                parenthesisLine = ""
                parenthesisCount = 1
                index += 1
                while(parenthesisCount != 0 and index < len(line)):
                    char = line[index]
                    if char == '(':
                        parenthesisCount += 1
                    elif char == ')':
                        parenthesisCount -= 1
                    
                    if parenthesisCount != 0:
                        parenthesisLine += char
                    index += 1
                
                if parenthesisLine == "":
                    raise ValueError(f"Parenthesis match has no arguments at index: {index}")
            
                newNode = relationalParser(line = parenthesisLine, relations=relations, debug=debug)
                newNode.userInput = '(' + newNode.userInput + ')'
            else:
                relation = ""
                while(index < len(line) and validRelationChar(char)):

                    relation += char
                    index += 1
                    if index != len(line):
                        char = line[index]
                
                if relation == "":
                    raise ValueError(f"Expected relation at index {index} with line: {line}")
                if relations != None and relation not in relations:
                    raise ValueError(f"Relation {relation} not known, found at index {index}")

                if debug:
                    print(f"Index {index}: Found relation {relation}, making node.")

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

            # check if you are start and op with op R line AND THERE IS NO LHS NODE

            if char in setOpSymbols:
                mode = "relation"
            elif char in singleOpSymbols:
                if mode != "start":
                    raise ValueError(f"Single operation found not at the start!")
                mode = "comparison"
                
            elif char in joinOpSymbols:
                if char == '⨯':
                    mode = "relation"
                else:
                    mode = "comparisonRelation"
            else:
                raise ValueError(f"Unexpected Symbol at index:{index}")

            op = char


            if debug:
                print(f"Index {index}: Found operation {op}")    
            index += 1
        
        else:
            raise ValueError(f"Search mode: {mode} at index: {index}, got {char} instead.")
        
    
    if lhsNode is None:
        raise ValueError("No valid relation built")
    
    if op != "" or condition != "" or rhsNode != None:
        raise ValueError(f"Still expecting more arguments, currently built node: {lhsNode} versus remaining line: {line}")

    if debug:
        print(f"Index {index}: Returning node: {lhsNode}")

    return lhsNode
            
            


if __name__ == "__main__":

    testLine = "(R intersect S union (2A- B1)) union P"

    print("Here is the current line: " + testLine)
    
    testLine = symbolize(testLine)

    rootNode = relationalParser(line=testLine, debug=True)

    print("This is testLine after symbolize: " + testLine)
    print("Here is our root: " + str(rootNode))