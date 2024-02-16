import pandas as pd
import re
from pyparsing import Word, alphas, alphanums, oneOf, infixNotation

def projection(dataTable1,conditions):
    if isinstance(conditions,list):
        dataTableList = pd.DataFrame()
        for condition in conditions:
            dataTableList[condition] = pd.Series(dataTable1[condition])
        return dataTableList
    else:
        return dataTable1[[conditions]]
def selection(dataTable1,conditions):
    pattern = r'(\S+)\s*([><=]+)\s*(\S+)'
    matches = re.match(pattern, conditions)
    if matches:
        lhs = matches.group(1)  
        op = matches.group(2)   
        rhs = matches.group(3) 

        print("Left-hand side:", lhs)
        print("Operator:", op)
        print("Right-hand side:", rhs)
    else:
        print("Invalid inequality string")
    filtered = dataTable1[dataTable1[lhs].apply(lambda x: eval(f"x {op} {rhs}"))]
    return filtered