import pandas as pd
from relationBoolean import booleanParsing

def selection(df,condition,dataFrameDictionary):
    boolean = booleanParsing(condition,debug= False)
    resultPD = pd.DataFrame(columns = df.columns)
    for index, row in df.iterrows():
        rowDF = pd.DataFrame([row], columns=df.columns)
        if boolean.evaluate(rowDF,dataFrameDictionary):
            resultPD.loc[len(resultPD.index)] = row
    return resultPD
def projection(dataTable1, conditions):
    conditionList = conditions.split(',')
    for i in conditionList:
        i = i.strip("")
    dataTableList = pd.DataFrame()
    for condition in conditionList:
        dataTableList[condition] = pd.Series(dataTable1[condition])
    return dataTableList

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
    condition_str = "A > 2 or D = True"
    selected_df = selection(df1, condition_str)
    print(selected_df)
