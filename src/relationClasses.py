
import pandas as pd

class relationNode:

    userInput: str = ""
    resultDF: pd.DataFrame = None

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

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