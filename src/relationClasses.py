
from relationBoolean import booleanStatement
import pandas as pd
from union import union
from difference import difference
from projection import projection,selection
from join import join
from intersection import intersection
from REsymbols import symbols, setOpSymbols, joinOpSymbols, singleOpSymbols
class relationNode:

    userInput: str = ""
    resultDF: pd.DataFrame = None

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def __str__(self):
        return self.userInput
    
    def resolve(self,input,dataFrame):
        self.userInput = input
        self.resultDF = dataFrame
        # IMPORTS DF from CSV
        pass
    def getDataFrame(self):
        return self.resultDF
    def getUserInput(self):
        return self.userInput
    def printNode(self):
        print("Node Name: ", self.userInput)
        print("Data Frame: \n",self.resultDF)


class setOperationNode(relationNode):

    LHSVariable: relationNode = None
    RHSVariable: relationNode = None
    setOp: str = ""

    def printLine(self):
        return print(self.LHSVariable,self.setOp,self.RHSVariable)
    def resolve(self):
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
    
