import numpy as np
import pandas as pd

from src.relationalAlgebra.REsymbols import booleanSymbolMap


# Add quotes to hard code string in eval operation.
def addQuotesIfNeeded(string):
    if string.startswith('"') and string.endswith('"'):
        return string
    if string.startswith('\'') and string.endswith('\''):
        return string
    return f'"{string}"'


# Determines whether a given string is numeric
def isRealNumber(string):
    return np.core.defchararray.isnumeric(string.replace('.', '', 1))


# Add quotes if not a number or boolean
def handleStringCases(variable):
    if isinstance(variable, str) and not isRealNumber(variable) and variable not in {"True", "False"}:
        return addQuotesIfNeeded(variable)
    return variable


class booleanStatement:
    """
    Parent class for a boolean statement.

    Base represents a simple statement such as A.id > 3.
    Uses strings to represent variables, and calls on known relations and specific table
    row to search for their actual value to evaluate the expression.
    All boolean statements hold a string for their boolean operation ("≠", ">", etc.), 
    the user input that it is built/parsed from.
    """

    lhs: str = ""
    rhs: str = ""
    booleanOp: str = ""
    userInput: str = ""


    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
        self.userInput = self.lhs + ' ' + self.booleanOp + ' ' + self.rhs


    def __str__(self):
        return self.userInput


    # Evaluates the boolean statement to return a true or false value.
    def evaluate(self, row: pd.DataFrame, knownRelations):

        # Replace operation symbol with code notation: '≤' --> '<='
        for key,val in booleanSymbolMap.items():
            if self.booleanOp == val:
                self.booleanOp = key
        
        usesOneRowElement = False

        # For each side of statement, determine if variables are hardcoded values such
        # as numbers, booleans (True/False), or strings. Use those as the value to compare,
        # otherwise, search known relations and specific row to get actual value from table.
        LHSVariable = self.lhs
        if self.lhs in row and not (self.lhs.isnumeric()):
            LHSVariable = row.iloc[0][self.lhs]
            usesOneRowElement = True
        elif self.lhs not in row and not (self.lhs.isnumeric()) and '.' in self.lhs:
            specifySplit = self.lhs.split('.')
            possibleColL = specifySplit[1]
            if possibleColL in row:
                LHSVariable = row.iloc[0][possibleColL]
                usesOneRowElement = True
        
        LHSVariable = handleStringCases(LHSVariable)
    
        RHSVariable = self.rhs
        if self.rhs in row and not (self.rhs.isnumeric()):
            RHSVariable = row.iloc[0][self.rhs]
            usesOneRowElement = True
        elif self.rhs not in row and not (self.rhs.isnumeric()) and '.' in self.rhs:
            specifySplit = self.rhs.split('.')
            possibleColR = specifySplit[1]
            if possibleColR in row:
                RHSVariable = row.iloc[0][possibleColR]
                usesOneRowElement = True

        RHSVariable = handleStringCases(RHSVariable)        
        
        if usesOneRowElement == False:
            raise ValueError("Condition does not depend on element of relation.")
        # print(type(LHSVariable),type(RHSVariable))
        # print(f"{LHSVariable} {self.booleanOp} {RHSVariable}")
        # print(eval(f"{LHSVariable} {self.booleanOp} {RHSVariable}"))
        return eval(f"{LHSVariable} {self.booleanOp} {RHSVariable}")


class compoundStatement(booleanStatement):
    """
    Extension of boolean statement class to allow nesting of multiple boolean statements.

    Represents compounded statements such as (A.id > 3) and (A.name == "Justin").
    Uses pointers to other nodes to represent left and right hand side, each possibly being simple
    boolean statements, or other compounded statements that are evaluated recursively.
    """

    lhsBoolean: booleanStatement = None
    rhsBoolean: booleanStatement = None
    compoundOp: str = ""

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
        self.userInput = self.lhsBoolean.userInput + ' ' + self.compoundOp + ' ' + self.rhsBoolean.userInput

    def evaluate(self, row: pd.DataFrame, knownRelations):
        # Check if row passes condition
        lhs = self.lhsBoolean.evaluate(row, knownRelations)
        rhs = self.rhsBoolean.evaluate(row, knownRelations)
        # print(lhs,rhs)
        if self.compoundOp == "and":
            return (lhs and rhs)
        elif self.compoundOp == "or":
            return (lhs or rhs)
        else:
            raise ValueError(f"Unexpected compound boolean node operation: {self.compoundOp}")