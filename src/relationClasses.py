
from relationBoolean import booleanStatement
import pandas as pd


class relationNode:

    userInput: str = ""
    resultDF: pd.DataFrame = None

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def __str__(self):
        return self.userInput

    def resolve():
        # IMPORTS DF from CSV
        pass


class setOperationNode(relationNode):

    LHSVariable: relationNode = None
    RHSVariable: relationNode = None
    setOp: str = ""

    def resolve():
        # CALLS RESOLVE ON LHS AND RHS, THEN GETS RESULTING DF FROM SET OPERATION
        pass

class singleOpNode(relationNode):
    
    singleOp: str = ""
    SingleVariable: relationNode = None
    condition: str = ""

    def resolve():
        # Checks condition, solve different based on op and or row/select condition being not None
        pass

class joinOpNode(relationNode):

    LHSVariable: relationNode = None
    RHSVariable: relationNode = None
    joinOp: str = ""

    def resolve():
        # Join then filter if there is a selectCondition present
        pass


class joinOpWithConditionNode(joinOpNode):

    condition: str = ""

    def resolve():
        # Join then filter if there is a selectCondition present
        pass
    
