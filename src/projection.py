import pandas as pd
import operator
import re
def parenthetic_contents(string):

    stack = []
    final = []
    for i, c in enumerate(string):
        if c == '(':
            stack.append(i)
        elif c == ')' and stack:
            start = stack.pop()
            final.append(string[start + 1: i])
    final.append(string)
    return final

def parse_input(input_str):
    parts = input_str.split("select")

    if len(parts) != 2:
        raise ValueError("Input string must be in the format 'select {condition} query'")

    condition_str, query_str = parts[1].split("query")
    condition_str = condition_str.strip()
    if condition_str.startswith('{') and condition_str.endswith('}'):
        condition_str = condition_str[1:-1]

    query_str = query_str.strip()
    return condition_str, query_str

def parseCondition(conditionStr):
    conditions = parenthetic_contents(conditionStr)
    parsedConditions = []
    logicalOp = None
    print(conditions)
    
    for condition in conditions:
        tokens = re.split(r'\b(?:or|and)\b', condition)
        operators = re.findall(r'\b(?:or|and)\b', condition)
        for i in tokens:
            parsedConditions.append(i)
    print(parsedConditions)
    return parsedConditions, operators

def constructConditionFunc(parsedConditions):
    ops = {'<': operator.lt, '<=': operator.le, '>': operator.gt, '>=': operator.ge, '==': operator.eq, '!=': operator.ne}
    print("Parsed Conditions: ",parsedConditions)
    conditionFuncs = []
    for i in parsedConditions:
        lhs,op,rhs = i.split()
        print(lhs,op,rhs)
        try:
            rhs = int(rhs)
        except ValueError:
            try:
                rhs = float(rhs)
            except ValueError:
                pass 
        conditionFuncs.append(lambda df, lhs=lhs, op=op, rhs=rhs: ops[op](df[lhs], rhs))
    print("ConditionFunc: ",conditionFuncs)
    def conditionFunc(df):
        result = conditionFuncs[0](df)
        print("DSFSDFS",conditionFuncs[1](df))
        for i in range(1,len(conditionFuncs)):
            print("OPERATOR: ",parsedConditions[len(conditionFuncs)-1][i])
            if parsedConditions[len(conditionFuncs)-1][i] == 'and':
                result &= conditionFuncs[len(conditionFuncs)-1][i](df)
            elif parsedConditions[len(conditionFuncs)-1][i] == 'or':
                result |= conditionFuncs[len(conditionFuncs)-1][i](df)
            
        return result
    
    return conditionFunc

def selection(df, conditionStr, selectColumns, projectColumns):
    parsedConditions, _ = parseCondition(conditionStr)
    print(parsedConditions)
    conditionFunc = constructConditionFunc(parsedConditions)
    selectedRows = df[conditionFunc(df)].loc[:, selectColumns]
    
    if selectedRows.empty:
        return pd.DataFrame()
    
    projectedRows = projection(selectedRows, projectColumns)
    
    return projectedRows

def projection(dataTable1, conditions):
    if isinstance(conditions, list):
        dataTableList = pd.DataFrame()
        for condition in conditions:
            dataTableList[condition] = pd.Series(dataTable1[condition])
        return dataTableList
    else:
        return dataTable1[[conditions]]

if __name__ == '__main__':
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
    condition_str, query_str = parse_input("select { A > 2 and B < c} query")
    print(condition_str)
    selected_df = selection(df1, condition_str, df1.columns.tolist(), df1.columns.tolist())

    print(selected_df)
