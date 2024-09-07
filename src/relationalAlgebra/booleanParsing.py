from src.relationalAlgebra.booleanNodes import booleanStatement, compoundStatement
from src.relationalAlgebra.REsymbols import booleanSymbols, booleanSymbolMap


# Converts all comparator strings to character representation such as: "<=" --> "≤"
def symbolizeComparators(line: str) -> str:

    result = line
    for comparatorString in booleanSymbolMap.keys():
        result = result.replace(comparatorString, booleanSymbolMap[comparatorString])

    return result


# Checks if character is part of a possible variable for a boolean statement
# Variables can be relation names, attributes of relations, numbers, or strings. I.E.: "A", "A.id", "2", "justin"
def validChar(char: str) -> bool:
    return char.isalpha() or char.isdigit() or char in {'.', '\'', '\"'}


# Boolean parser to convert string to boolean operation node tree representation
def booleanParser(line: str, debug = False) -> booleanStatement:

    lhsBoolean = None
    rhsBoolean = None
    compoundOp = ""

    line = symbolizeComparators(line)

    if debug:
        print(f"Starting to boolean parse: {line}")

    index = 0
    mode = "booleanStatement" # Sets what is parser is doing next
    while(index < len(line) + 1):

        # Compound build connects found boolean nodes into a compound node
        if mode == "compoundBuild":
            # build relation node and set mode back to finding op
            if compoundOp in {"and", "or"}:
                if (lhsBoolean is None or rhsBoolean is None):
                    raise ValueError("One or more varaibles not set in building") 

                if debug:
                    print(f"Index {index}: Making compound operation of {compoundOp} between {lhsBoolean} | {rhsBoolean}")
                newNode = compoundStatement( lhsBoolean=lhsBoolean, rhsBoolean=rhsBoolean, compoundOp = compoundOp, userInput = line[0:index])

                lhsBoolean = newNode
                mode = "compoundOpSymbol"
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

        # Looking for valid boolean statement
        if mode == "booleanStatement":
            # Parenthesis, recurses to handle nesting
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

                newCondition = booleanParser(line = parenthesisLine, debug=debug)
                newCondition.userInput = '(' + newCondition.userInput + ')'
            else:
                lhs = ""
                booleanOp = ""
                rhs = ""
                statementMode = "lhs"

                while index < len(line):

                    if validChar(char):
                        if statementMode == "lhs":
                            lhs += char
                        else:
                            rhs += char
                    elif char in booleanSymbols:
                        booleanOp = char
                        statementMode = "rhs"
                    elif char == " ":
                        if statementMode == "lhs":
                            statementMode = "rhs"
                        elif rhs != "":
                            break
                    else:
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
                mode = "compoundOpSymbol"
            else:
                rhsBoolean = newCondition
                mode = "compoundBuild"
        # Looking for compound operation symbol
        elif mode == "compoundOpSymbol":

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

    if compoundOp != "" or rhsBoolean is not None:
        raise ValueError(f"Still expecting more arguments, currently built node: {lhsBoolean} versus remaining line: {line[index:]}")

    if debug:
        print(f"Index {index}: Returning node: {lhsBoolean}")

    return lhsBoolean


if __name__ == "__main__":

    testLine = "a.id <= b.id or ((x >= 4) and c.id1 != d.id2)"

    print("Here is the current line: " + testLine)

    rootBoolean = booleanParser(line=testLine, debug=True)

    print("This is testLine after symbolize: " + testLine)
    print("Here is our root: " + str(rootBoolean))
