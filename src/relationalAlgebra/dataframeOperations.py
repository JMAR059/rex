import pandas as pd
from src.relationalAlgebra.booleanParsing import booleanParser


# Most use boolean parser (MORE DOCUMENTATION)

# Select: New dataframe containing the rows of the given dataframe that pass the boolean condition
def selection(dataframe, conditionString, knownRelations={}):
    rowCondition = booleanParser(conditionString,debug= False)
    selectResult = pd.DataFrame(columns = dataframe.columns)
    for index, row in dataframe.iterrows():
        dataframeRow = pd.DataFrame([row], columns=dataframe.columns)
        if rowCondition.evaluate(dataframeRow, knownRelations):
            selectResult.loc[len(selectResult.index)] = row
    return selectResult


# Project: New Dataframe with only the specified columns (seperated by ',' in the given string)
def projection(dataframe1, columnNames):
    specifiedColumns = columnNames.split(',')
    for index in range(len(specifiedColumns)):
        specifiedColumns[index] = specifiedColumns[index].strip("")
    projectResult = pd.DataFrame()
    for columnName in specifiedColumns:
        projectResult[columnName] = pd.Series(dataframe1[columnName])
    return projectResult


# Cartesian Product: Cartesian Dataframe with renaming, done in cases where both dataframes have identical columns
# Given dataframe R, S both having column A, after merge method would have columns: [A1, A2] --> [R.A, S.A]
def cartesianProduct(dataframe1, dataframe2, LHSRelationName, RHSRelationName, knownRelations={}):
    commonColumns = set(dataframe1) & set(dataframe2)
    for col in commonColumns:
        if dataframe1[col].dtype != dataframe2[col].dtype:
            raise ValueError(f"Column '{col}' has mismatched data types: {dataframe1[col].dtype} in df1, {dataframe2[col].dtype} in df2")
    cartesianResult = dataframe1.merge(dataframe2,suffixes= ("1","2"), how = "cross")
    for col in commonColumns:
        if LHSRelationName in knownRelations:
            cartesianResult = cartesianResult.rename(columns={col+"1": LHSRelationName+'.'+col})
        if RHSRelationName in knownRelations:
            cartesianResult = cartesianResult.rename(columns={col+"2": RHSRelationName+'.'+col})
    return cartesianResult


# Natural Join: Merge on identical column names, otherwise, results in cartesian product 
def naturalJoin(dataframe1, dataframe2, LHSRelationName, RHSRelationName, knownRelations={}):
    commonColumns = set(dataframe1) & set(dataframe2)
    for col in commonColumns:
        if dataframe1[col].dtype != dataframe2[col].dtype:
            raise ValueError(f"Column '{col}' has mismatched data types: {dataframe1[col].dtype} in df1, {dataframe2[col].dtype} in df2")
    if len(commonColumns) != 0:
        naturalJoinResult = pd.merge(dataframe1,dataframe2)
    else:
        naturalJoinResult = cartesianProduct(dataframe1, dataframe2, LHSRelationName, RHSRelationName, knownRelations) #Should do cartesian instead
    return naturalJoinResult


# Theta Join: Cartesian product with a selection
def thetaJoin(dataframe1, dataframe2, conditions, knownRelations, LHSRelationName, RHSRelationName):
    cartesian = cartesianProduct(dataframe1,dataframe2,LHSRelationName,RHSRelationName,knownRelations)
    thetaResult = selection(cartesian,conditions,knownRelations)
    return thetaResult


# Union: Concatinating all unique rows
def union(dataframe1, dataframe2):
    unionResult = pd.concat([dataframe1,dataframe2]).drop_duplicates()
    return unionResult


# Difference: Original dataframe without the identical rows found in the second dataframe
def difference(dataframe1, dataframe2):
    mergedDt = pd.merge(dataframe1, dataframe2, how='outer', indicator=True)
    setDifference = mergedDt[mergedDt['_merge'] == 'left_only'].drop(columns='_merge')
    return setDifference


# Intersection: Dataframe of rows that are found in both dataframes
def intersection(dataframe1,dataframe2):
    intersection = pd.merge(dataframe1, dataframe2, how='inner')
    return intersection


if __name__ == '__main__':

    joinTest = False
    setOperationsTest = False
    singletonTest = True
    
    if joinTest == True:
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
        df3 = pd.DataFrame({'ID': [1, 2, 3],
                        'Name': ['Alice', 'Bob', 'Charlie']})

        df4 = pd.DataFrame({'ID': [1, 2, 4],
                        'Age': [25, 30, 35]})
        #print("Cartesian Product: \n",cartesianProduct(df1,df2))
        #print("Natural Join: \n", naturalJoin(df3,df4))
        print("Theta Join: \n", thetaJoin(df1,df2,'df1.A < df2.A'))
    
    if setOperationsTest == True:
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
        print(union(df1,df2))

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
        print(difference(df1,df2))

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
        print(intersection(df1,df2))
    
    if singletonTest == True:
        df1 = pd.DataFrame({
            'A': [7, 2, 8, 1, 3],
            'B': ['a', 'b', 'c', 'd', 'e'],
            'C': [10.5, 20.3, 30.1, 40.7, 50.9],
            'D': [True, True, True, False, True],
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