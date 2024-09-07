import pandas as pd

from src.relationalAlgebra.dataframeOperations import union, difference, projection, selection, cartesianProduct, naturalJoin, thetaJoin, intersection


class relationNode:
    """
    Parent class for all relation nodes.

    Base use is string representation for a known table/relation such as: A
    All relation nodes store user input it is built/parsed from and the resulting
    dataframe/table that comes from solving their relational expression.

    Child classes that represent operations between two relation nodes, uses pointers
    to other nodes to represent left and right hand side.

    Resolve will create the resulting dataframe, each child class will call dataframe
    operations to create the result. Relation node attributes will be called to resolve
    first, if child class has them.
    """

    userInput: str = ""
    resultDF: pd.DataFrame = None

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def __str__(self):
        return self.userInput

    def resolve(self, knownRelations):
        if self.resultDF is not None:
            return self.resultDF
        elif self.userInput in knownRelations:
            self.resultDF = knownRelations[self.userInput]
            return self.resultDF
        else:
            raise ValueError(f"Data Frame {self.userInput} Not Found")


class setOperationNode(relationNode):
    """
    Relation node representation of set operations such as:
    "A ∨ B", "C ∧ D", "E - F"

    Class has its own set operation symbol, and left and right hand side relation nodes.
    """


    LHSVariable: relationNode = None
    RHSVariable: relationNode = None
    setOp: str = ""


    def resolve(self, knownRelations):
        if self.resultDF is not None:
            return self.resultDF
        elif self.setOp == "∨":
            self.resultDF = union(self.LHSVariable.resolve(knownRelations), self.RHSVariable.resolve(knownRelations))
        elif self.setOp == "∧":
            self.resultDF = intersection(self.LHSVariable.resolve(knownRelations), self.RHSVariable.resolve(knownRelations))
        elif self.setOp =="-":
            self.resultDF = difference(self.LHSVariable.resolve(knownRelations), self.RHSVariable.resolve(knownRelations))
        else:
            raise ValueError(f"Unexpected set node operation: {self.setOp}")
        return self.resultDF


class singleOpNode(relationNode):
    """
    Relation node for operations on only one relation/table such as:
    "σ{A.id > 3} A", "π{id} A"

    Contains single variable, single operation character (σ, π), and condition used for the
    specified operation (A.id > 3, id)
    """

    SingleVariable: relationNode = None
    singleOp: str = ""
    condition: str = ""

    def resolve(self, knownRelations):
        # Checks condition, solve different based on op and or row/select condition being not None
        if self.resultDF is not None:
            return self.resultDF
        elif self.singleOp == 'σ':
            self.resultDF = selection(self.SingleVariable.resolve(knownRelations), self.condition, knownRelations)
        elif self.singleOp == 'π':
            self.resultDF = projection(self.SingleVariable.resolve(knownRelations), self.condition)
        else:
            raise ValueError(f"Unexpected singleton node operation: {self.singleOp}")
        return self.resultDF


class joinOpNode(relationNode):
    """
    Relation node for join operations such as:
    "A ⨯ B", "C ⨝ D"

    Has a join operation character to specify what join type the node represents.
    """

    LHSVariable: relationNode = None
    RHSVariable: relationNode = None
    joinOp: str = ""


    def resolve(self, knownRelations):
        if self.resultDF is not None:
            return self.resultDF
        elif self.joinOp == '⨯':
            self.resultDF = cartesianProduct(self.LHSVariable.resolve(knownRelations), self.RHSVariable.resolve(knownRelations),
                                            self.LHSVariable.userInput, self.RHSVariable.userInput, knownRelations)
        elif self.joinOp == '⨝':
            self.resultDF = naturalJoin(self.LHSVariable.resolve(knownRelations), self.RHSVariable.resolve(knownRelations),
                                            self.LHSVariable.userInput, self.RHSVariable.userInput, knownRelations)
        else:
            raise ValueError(f"Unexpected join node operation: {self.joinOp}")
        return self.resultDF


class joinOpWithConditionNode(joinOpNode):
    """
    Extension of join to include condition for theta joins such as:
    "C ⨝{C.id == D.id} D"
    
    TO DO: Eliminate class by moving the condition attribute to original
    joinOpNode with the string being optional. Resolve checks for condition
    and join symbol to call thetaJoin, naturalJoin, or cartesian product.
    Must also ensure functionality with test and constructor calling in parser.
    """


    condition: str = ""

    def resolve(self, knownRelations):
        # Join then filter if there is a selectCondition present
        if self.resultDF is not None:
            return self.resultDF
        elif self.joinOp == '⨝':
            self.resultDF = thetaJoin(self.LHSVariable.resolve(knownRelations), self.RHSVariable.resolve(knownRelations),
                                     self.condition, knownRelations, self.LHSVariable.userInput, self.RHSVariable.userInput)
        else:
            raise ValueError(f"Unexpected join condition node operation: {self.joinOp}")
        return self.resultDF


if __name__ == "__main__":
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

    newSetOperationNode1 = setOperationNode(LHSVariable = relationNode1,setOp = '∨', RHSVariable = relationNode2)
    newSetOperationNode1.resolve(dataFrameDictionary)
    print(newSetOperationNode1.setOp,newSetOperationNode1.resultDF)
    newSetOperationNode2 = setOperationNode(LHSVariable = relationNode1,setOp = '∧', RHSVariable = relationNode2)
    newSetOperationNode2.resolve(dataFrameDictionary)
    print(newSetOperationNode2.setOp,newSetOperationNode2.resultDF)
    newSetOperationNode3 = setOperationNode(LHSVariable = relationNode1,setOp = '-', RHSVariable = relationNode2)
    newSetOperationNode3.resolve(dataFrameDictionary)
    print(newSetOperationNode3.setOp,newSetOperationNode3.resultDF)
    newSingleOperationNode1 = singleOpNode(singleOp = 'π',SingleVariable = relationNode1,condition = "A,B")
    newSingleOperationNode1.resolve(dataFrameDictionary)
    print(newSingleOperationNode1.singleOp,newSingleOperationNode1.resultDF)
    newSingleOperationNode1 = singleOpNode(singleOp = 'σ',SingleVariable = relationNode1,condition = "D = True",dataFrameDictionary = dataFrameDictionary)
    newSingleOperationNode1.resolve(dataFrameDictionary)
    print(newSingleOperationNode1.singleOp,newSingleOperationNode1.resultDF)
    newJoinNode1 = joinOpNode(LHSVariable =relationNode4, RHSVariable = relationNode5,joinOp = '⨝')
    newJoinNode1.resolve(dataFrameDictionary)
    print(newJoinNode1.joinOp,newJoinNode1.resultDF)
    newJoinNode2 = joinOpNode(LHSVariable =relationNode4, RHSVariable = relationNode5,joinOp = '⨯')
    newJoinNode2.resolve(dataFrameDictionary)
    print(newJoinNode2.joinOp,newJoinNode2.resultDF)
    newJoinNode3 = joinOpWithConditionNode(LHSVariable =relationNode1, RHSVariable = relationNode2,joinOp = '⨝',condition = "R.A > S.A")
    newJoinNode3.resolve(dataFrameDictionary)
    print(newJoinNode3.resultDF)
 