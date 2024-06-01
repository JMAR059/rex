import pandas as pd
from src.relationalAlgebra.relationBoolean import booleanParsing

#SINGLETON OPERATIONS
def selection(df, condition, dataFrameDictionary={}):
    boolean = booleanParsing(condition,debug= False)
    resultPD = pd.DataFrame(columns = df.columns)
    for index, row in df.iterrows():
        rowDF = pd.DataFrame([row], columns=df.columns)
        if boolean.evaluate(rowDF,dataFrameDictionary):
            resultPD.loc[len(resultPD.index)] = row
    return resultPD


def projection(dataTable1, conditions):
    conditionList = conditions.split(',')
    for index in range(conditionList):
        conditionList[index] = conditionList[index].strip("")
    dataTableList = pd.DataFrame()
    for condition in conditionList:
        dataTableList[condition] = pd.Series(dataTable1[condition])
    return dataTableList


#JOIN OPERATIONS
def cartesianProduct(dataTable1, dataTable2, LHSName, RHSName, dataFrameDictionary={}):
    commonCols = set(dataTable1) & set(dataTable2)
    for col in commonCols:
        if dataTable1[col].dtype != dataTable2[col].dtype:
            raise ValueError(f"Column '{col}' has mismatched data types: {dataTable1[col].dtype} in df1, {dataTable2[col].dtype} in df2")
    cartesian = dataTable1.merge(dataTable2,suffixes= ("1","2"), how = "cross")
    for col in commonCols:
        if LHSName in dataFrameDictionary:
            cartesian = cartesian.rename(columns={col+"1": LHSName+'.'+col})
        if RHSName in dataFrameDictionary:
            cartesian = cartesian.rename(columns={col+"2": RHSName+'.'+col})
    return cartesian


def naturalJoin(dataTable1, dataTable2):
    commonCols = set(dataTable1) & set(dataTable2)
    for col in commonCols:
        if dataTable1[col].dtype != dataTable2[col].dtype:
            raise ValueError(f"Column '{col}' has mismatched data types: {dataTable1[col].dtype} in df1, {dataTable2[col].dtype} in df2")
    if len(commonCols) != 0:
        natural = pd.merge(dataTable1,dataTable2)
    else:
        natural = pd.DataFrame()
    return natural


def thetaJoin(dataTable1, dataTable2, conditions, dataFrameDictionary, LHSName, RHSName):
    cartesian = cartesianProduct(dataTable1,dataTable2,LHSName,RHSName,dataFrameDictionary)
    theta = selection(cartesian,conditions,dataFrameDictionary)
    return theta


def union(dataTable1, dataTable2):
    newTable = pd.concat([dataTable1,dataTable2]).drop_duplicates()
    return newTable


def difference(dataTable1, dataTable2):
    mergedDt = pd.merge(dataTable1, dataTable2, how='outer', indicator=True)
    setDifference = mergedDt[mergedDt['_merge'] == 'left_only'].drop(columns='_merge')
    return setDifference

def intersection(dataTable1,dataTable2):
    intersection =pd.merge(dataTable1, dataTable2, how='inner')
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