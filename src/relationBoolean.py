
import pandas as pd

class booleanStatement:

    lhs: str = ""
    rhs: str = ""
    op: str = ""
    userInput: str = ""

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
        self.userInput = self.lhs + ' ' + self.op + ' ' + self.rhs

    def __str__(self):
        return self.userInput

    def evaluate(self, row: pd.DataFrame):
        # Check if row passes condition
        pass


class combinedStatement(booleanStatement):

    lhsBoolean: booleanStatement = None
    rhsBoolean: booleanStatement = None
    op: str = ""

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
        self.userInput = self.lhs.userInput + ' ' + self.op + ' ' + self.rhs.userInput

    def evaluate(self, row: pd.DataFrame):
        # Check if row passes condition
        pass


def validChar(char: str):
    return char.isalnum or char == '.'


def booleanParsing(line: str = "", debug = False):

    lhsBoolean = None
    rhsBoolean = None
    compoundOp = ""

    if debug:
        print(f"Starting to boolean parse: {line}")

    index = 0
    mode = "boolean"
    while(index < len(line) + 1):


        if index == len(line):
            break
        char = line[index]
        if char == " ":
            index += 1
            continue

        if mode == "boolean":

            if char == '(':
                # recurse
                pass
            else:

                lhs = ""
                op = ""
                rhs = ""
                mode == "lhs"

                while(index < len(line)):

                    if validChar(char):
                        if mode == "lhs":
                            lhs += char
                        else:
                            rhs += char
                    elif char in booleanSymbols: #make set in resymbols
                        op = char
                        mode = "rhs" 
                    elif mode == "rhs":
                        # finished reading a rhs and got space or other value
                        break

                    index += 1
                    if index != len(line):
                        char = line[index]

                if lhs == "" or op == "" or rhs == "":
                    raise ValueError(f"Incomplete boolean condition at {index}: LHS({lhs}), RHS({rhs}), OP({op})")
                # check if lhs and rhs are valid attributes?

                if debug:
                    print(f"Index {index}: Found condition {lhs} {op} {rhs}, making node.")

                newCondition = booleanStatement(lhs=lhs, rhs=rhs, op=op)
            
            if lhsNode is None:
                lhsNode = newCondition
                mode = "compoundOperation"
            else:
                rhsNode = newCondition
                mode = "build"
        elif mode == "compoundOperation":
            pass
        else:
            # fail?
            pass

