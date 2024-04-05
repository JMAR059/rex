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
            raise ValueError(f"{self.userInput} Data Frame Not Found")
    


class setOperationNode(relationNode):

    LHSVariable: relationNode = None
    RHSVariable: relationNode = None
    setOp: str = ""
    results = None
    def printLine(self):
        return (self.LHSVariable,self.setOp,self.RHSVariable)
    def resolve(self,dataFrameDictionary):
        # CALLS RESOLVE ON LHS AND RHS, THEN GETS RESULTING DF FROM SET OPERATION
        if self.setOp == "∨":
            self.results = union(self.LHSVariable.resolve(dataFrameDictionary),self.RHSVariable.resolve(dataFrameDictionary))
        elif self.setOp == "∧":
            self.results = intersection(self.LHSVariable.resolve(dataFrameDictionary),self.RHSVariable.resolve(dataFrameDictionary))
        elif self.setOp =="-":
            self.results = difference(self.LHSVariable.resolve(dataFrameDictionary),self.RHSVariable.resolve(dataFrameDictionary))
        return self.results
        pass

class singleOpNode(relationNode):
    
    singleOp: str = ""
    SingleVariable: relationNode = None
    condition: str = ""
    results= None
    def resolve(self,dataFrameDictionary):
        # Checks condition, solve different based on op and or row/select condition being not None
        if self.singleOp == 'σ':
            self.results = selection(self.SingleVariable.resolve(dataFrameDictionary),self.condition)
        elif self.singleOp == 'π':
            self.results = projection(self.SingleVariable.resolve(dataFrameDictionary),self.condition)  
        return self.results
        pass

class joinOpNode(relationNode):

    LHSVariable: relationNode = None
    RHSVariable: relationNode = None
    joinOp: str = ""
    results = None
    def resolve(self,dataFrameDictionary):
        # Join then filter if there is a selectCondition present
        if self.joinOp == '⨯':
            self.results = cartesianProduct(self.LHSVariable.resolve(dataFrameDictionary),self.RHSVariable.resolve(dataFrameDictionary))
        elif self.joinOp == '⨝':
            self.results = naturalJoin(self.LHSVariable.resolve(dataFrameDictionary),self.RHSVariable.resolve(dataFrameDictionary))
        return self.results
        pass


class joinOpWithConditionNode(joinOpNode):

    condition: str = ""

    def resolve(self,dataFrameDictionary):
        # Join then filter if there is a selectCondition present
        if self.joinOp == '⨝':
            self.results = thetaJoin(self.LHSVariable.resolve(dataFrameDictionary),self.RHSVariable.resolve(dataFrameDictionary),self.condition)
        return self.results
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
df4 = pd.DataFrame({'ID': [1, 2, 3],
                    'Name': ['Alice', 'Bob', 'Charlie']})

df5 = pd.DataFrame({'ID': [1, 2, 4],
                    'Age': [25, 30, 35]})
dataFrameDictionary = {}
relationNode1 = relationNode(userInput = 'R')
dataFrameDictionary['R'] = df1
relationNode2 = relationNode(userInput = 'S')
dataFrameDictionary['S'] = df2
relationNode3 = relationNode(userInput = 'T')
dataFrameDictionary['T'] = df3
relationNode4 = relationNode(userInput = 'U')
dataFrameDictionary['U'] = df4
relationNode5 = relationNode(userInput = 'V')
dataFrameDictionary['V'] = df5
if __name__ == "__main__":
    newSetOperationNode1 = setOperationNode(LHSVariable = relationNode1,setOp = '∨', RHSVariable = relationNode2)
    newSetOperationNode1.resolve(dataFrameDictionary)
    print(newSetOperationNode1.setOp,newSetOperationNode1.results)
    newSetOperationNode2 = setOperationNode(LHSVariable = relationNode1,setOp = '∧', RHSVariable = relationNode2)
    newSetOperationNode2.resolve(dataFrameDictionary)
    print(newSetOperationNode2.setOp,newSetOperationNode2.results)
    newSetOperationNode3 = setOperationNode(LHSVariable = relationNode1,setOp = '-', RHSVariable = relationNode2)
    newSetOperationNode3.resolve(dataFrameDictionary)
    print(newSetOperationNode3.setOp,newSetOperationNode3.results)
    newSingleOperationNode1 = singleOpNode(singleOp = 'π',SingleVariable = relationNode1,condition = "A,B")
    newSingleOperationNode1.resolve(dataFrameDictionary)
    print(newSingleOperationNode1.singleOp,newSingleOperationNode1.results)
    newSingleOperationNode1 = singleOpNode(singleOp = 'σ',SingleVariable = relationNode1,condition = "A >= 3")
    newSingleOperationNode1.resolve(dataFrameDictionary)
    print(newSingleOperationNode1.singleOp,newSingleOperationNode1.results)
    newJoinNode1 = joinOpNode(LHSVariable =relationNode4, RHSVariable = relationNode5,joinOp = '⨝')
    newJoinNode1.resolve(dataFrameDictionary)
    print(newJoinNode1.joinOp,newJoinNode1.results)
    newJoinNode2 = joinOpNode(LHSVariable =relationNode4, RHSVariable = relationNode5,joinOp = '⨯')
    newJoinNode2.resolve(dataFrameDictionary)
    print(newJoinNode2.joinOp,newJoinNode2.results)
    newJoinNode3 = joinOpWithConditionNode(LHSVariable =relationNode1, RHSVariable = relationNode2,joinOp = '⨝',condition = "R.A > S.A")
    newJoinNode3.resolve(dataFrameDictionary)
    print(newJoinNode3.results)
 