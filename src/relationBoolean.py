
import pandas as pd
from REsymbols import booleanSymbols, booleanSymbolMap
class booleanStatement:

    lhs: str = ""
    rhs: str = ""
    booleanOp: str = ""
    userInput: str = ""

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
        self.userInput = self.lhs + ' ' + self.booleanOp + ' ' + self.rhs

    def __str__(self):
        return self.userInput

    def evaluate(self, row: pd.DataFrame):
        for key,val in booleanSymbolMap.items():
            if self.booleanOp == val:
                self.booleanOp = key
        if self.rhs.isnumeric():
            return eval(f"row.iloc[0][self.lhs] {self.booleanOp} {self.rhs}")
        else:   
            return eval(f"row.iloc[0][self.lhs] {self.booleanOp} '{self.rhs}'")
        pass


class compoundStatement(booleanStatement):

    lhsBoolean: booleanStatement = None
    rhsBoolean: booleanStatement = None
    compoundOp: str = ""

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
        self.userInput = self.lhsBoolean.userInput + ' ' + self.compoundOp + ' ' + self.rhsBoolean.userInput

    def evaluate(self, row: pd.DataFrame):
        # Check if row passes condition
        lhs = self.lhsBoolean.evaluate(row)
        rhs = self.rhsBoolean.evaluate(row)
        #print(lhs,rhs)
        if self.compoundOp == "and":
            return (lhs and rhs)
        else:
            return (lhs or rhs)


def symbolizeComparators(line: str) -> str:

    result = line

    for rawComparator in booleanSymbolMap.keys():
        result = result.replace(rawComparator, booleanSymbolMap[rawComparator])

    return result


def validChar(char: str) -> bool:
    return char.isalpha() or char.isdigit() or char in ['.', ""]


def booleanParsing(line: str, debug = False) -> booleanStatement:

    lhsBoolean = None
    rhsBoolean = None
    compoundOp = ""

    line = symbolizeComparators(line)

    if debug:
        print(f"Starting to boolean parse: {line}")

    index = 0
    mode = "booleanStatement"
    while(index < len(line) + 1):

        if mode == "build":
            # build relation node and set mode back to finding op
            if compoundOp in {"and", "or"}:
                if (lhsBoolean == None or rhsBoolean == None or compoundOp == ""):
                    raise ValueError("One or more varaibles not set in building") 

                if debug:
                    print(f"Index {index}: Making compound operation of {compoundOp} between {lhsBoolean} | {rhsBoolean}")
                newNode = compoundStatement( lhsBoolean=lhsBoolean, rhsBoolean=rhsBoolean, compoundOp = compoundOp, userInput = line[0:index])

                lhsBoolean = newNode
                mode = "compoundOperation"
            else:
                raise ValueError("Build failed")

            #Reset variables
            rhsBoolean = None
            compoundOp = ""
            continue

        if index == len(line):
            break
        char = line[index]
        if char == " ":
            index += 1
            continue

        if mode == "booleanStatement":

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
            
                if debug == True:
                    print(f"Index {index}: parsing for boolean expression in parentheses: ({parenthesisLine})")

                newCondition = booleanParsing(line = parenthesisLine, debug=debug)
                newCondition.userInput = '(' + newCondition.userInput + ')'
            else:

                lhs = ""
                booleanOp = ""
                rhs = ""
                statementMode = "lhs"

                while(index < len(line)):

                    if validChar(char):
                        if statementMode == "lhs":
                            lhs += char
                        else:
                            rhs += char
                    elif char in booleanSymbols: #make set in resymbols
                        booleanOp = char
                        statementMode = "rhs" 
                    elif char == " ":
                        # start looking for rhs, or break if already found rhs
                        if statementMode == "lhs":
                            statementMode = "rhs"
                        elif rhs != "":
                            break
                    else:
                        # not a space character to continue, unexpected character edge case
                        raise ValueError(f"Unexpected character looking for boolean statement at index: {index} with char: {char}")

                    index += 1
                    if index != len(line):
                        char = line[index]

                if lhs == "" or booleanOp == "" or rhs == "":
                    raise ValueError(f"Incomplete boolean condition at {index}: LHS({lhs}), RHS({rhs}), OP({booleanOp})")
                # check if lhs and rhs are valid attributes?

                if debug:
                    print(f"Index {index}: Found condition {lhs} {booleanOp} {rhs}, making node.")

                newCondition = booleanStatement(lhs=lhs, rhs=rhs, booleanOp=booleanOp)
            
            if lhsBoolean is None:
                lhsBoolean = newCondition
                mode = "compoundOperation"
            else:
                rhsBoolean = newCondition
                mode = "build"
            
        elif mode == "compoundOperation":
            
            if index + 3 <= len(line) and line[index:index+3] == "and":
                compoundOp = "and"
                index += 3
            elif index + 2 <= len(line) and line[index:index+2] == "or":
                compoundOp = "or"
                index += 2
            else:
                raise ValueError(f"Did not find valid compound operation at index: {index}")
            
            if debug == True:
                print(f"Index {index}: found compound op: {compoundOp}")
            mode = "booleanStatement"

        else:
            raise ValueError(f"Search mode: {mode} at index: {index}, did resolve search.")
        
    if lhsBoolean is None:
        raise ValueError("No valid boolean expression built.")
    
    if compoundOp != "" or rhsBoolean != None:
        raise ValueError(f"Still expecting more arguments, currently built node: {lhsBoolean} versus remaining line: {line}")

    if debug:
        print(f"Index {index}: Returning node: {lhsBoolean}")

    return lhsBoolean


if __name__ == "__main__":

    testLine = "a.id <= b.id or ((x >= 4) and c.id1 != d.id2)"

    print("Here is the current line: " + testLine)
    
    rootBoolean = booleanParsing(line=testLine, debug=True)

    print("This is testLine after symbolize: " + testLine)
    print("Here is our root: " + str(rootBoolean))

