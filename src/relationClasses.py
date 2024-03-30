import pandas as pd
from union import union
from difference import difference
from projection import projection,selection
from join import cartesianProduct,naturalJoin,thetaJoin
from intersection import intersection
from REsymbols import symbols, setOpSymbols, joinOpSymbols, singleOpSymbols

class relationNode:

    userInput: str = ""
    resultDF: pd.DataFrame = None

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def __str__(self):
        return self.userInput
    
    def resolve(self,dataFrameDictionary):
        if self.userInput in dataFrameDictionary:
            self.resultDF = dataFrameDictionary[self.userInput]
            return self.resultDF
        else:
            raise ValueError("Date Frame Not Found")
        


class setOperationNode(relationNode):

    LHSVariable: relationNode = None
    RHSVariable: relationNode = None
    setOp: str = ""
    results = None
    def printLine(self):
        return print(self.LHSVariable,self.setOp,self.RHSVariable)
    def resolve(self,dataFrameDictionary):
        # CALLS RESOLVE ON LHS AND RHS, THEN GETS RESULTING DF FROM SET OPERATION
        if self.setOp == "∨":
            self.results = union(self.LHSVariable.resolve(dataFrameDictionary),self.RHSVariable.resolve(dataFrameDictionary))
        elif self.setOp == "∧":
            self.results = intersection(self.LHSVariable.resolve(dataFrameDictionary),self.RHSVariable.resolve(dataFrameDictionary))
        elif self.setOp =="-":
            self.results = difference(self.LHSVariable.resolve(dataFrameDictionary),self.RHSVariable.resolve(dataFrameDictionary))
        pass

class singleOpNode(relationNode):
    
    singleOp: str = ""
    SingleVariable: relationNode = None
    condition: str = ""
    results= None
    def resolve(self,dataFrameDictionary):
        # Checks condition, solve different based on op and or row/select condition being not None
        if self.singleOp == 'σ':
            self.results = selection(self.SingleVariable.resolve(dataFrameDictionary),self.condition,self.SingleVariable.resultDF.columns.tolist(),self.SingleVariable.resultDF.columns.tolist())
        elif self.singleOp == 'π':
            self.results = projection(self.SingleVariable.resolve(dataFrameDictionary),self.condition)  
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
df3 = pd.DataFrame({
    'A': [2, 3, 4, 7, 8],
    'B': ['a', 'y', 'c', 'w', 'd'],
    'C': [45.2, 15.6, 65.8, 35.3, 53.1],
    'D': [True, True, False, False, False],
    'E': ['apple', 'mango', 'orange', 'blueberry', 'kiwi']
    })    
dataFrameDictionary = {}
relationNode1 = relationNode(userInput = 'R')
dataFrameDictionary['R'] = df1
relationNode2 = relationNode(userInput = 'S')
dataFrameDictionary['S'] = df2
relationNode2 = relationNode(userInput = 'T')
dataFrameDictionary['T'] = df3
if __name__ == "__main__":
    '''
    newSetOperationNode1 = setOperationNode(LHSVariable = relationNode1,setOp = '∨', RHSVariable = relationNode2)
    newSetOperationNode1.resolve(dataFrameDictionary)
    print(newSetOperationNode1.setOp,newSetOperationNode1.results)
    newSetOperationNode2 = setOperationNode(LHSVariable = relationNode1,setOp = '∧', RHSVariable = relationNode2)
    newSetOperationNode2.resolve(dataFrameDictionary)
    print(newSetOperationNode1.setOp,newSetOperationNode2.results)
    newSetOperationNode3 = setOperationNode(LHSVariable = relationNode1,setOp = '-', RHSVariable = relationNode2)
    newSetOperationNode3.resolve(dataFrameDictionary)
    print(newSetOperationNode1.setOp,newSetOperationNode3.results)
    '''
    newSingleOperationNode1 = singleOpNode(singleOp = 'π',SingleVariable = relationNode1,condition = ['A','C','E'])
    newSingleOperationNode1.resolve(dataFrameDictionary)
    print(newSingleOperationNode1.singleOp,newSingleOperationNode1.results)
    newSingleOperationNode1 = singleOpNode(singleOp = 'σ',SingleVariable = relationNode1,condition = "A > 4 or C > 20")
    newSingleOperationNode1.resolve(dataFrameDictionary)
    print(newSingleOperationNode1.singleOp,newSingleOperationNode1.results)