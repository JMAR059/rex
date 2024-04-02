import pandas as pd
from projection import projection, selection

def cartesianProduct(dataTable1,dataTable2):
        cartesian = dataTable1.join(dataTable2,rsuffix = " Other", how = "cross")
        return cartesian
def naturalJoin(dataTable1,dataTable2):
    commonCols = set(dataTable1) & set(dataTable2)
    for col in commonCols:
        print(col)
        if dataTable1[col].dtype != dataTable2[col].dtype:
            raise ValueError(f"Column '{col}' has mismatched data types: {df1[col].dtype} in df1, {df2[col].dtype} in df2")
    natural = pd.merge(dataTable1,dataTable2)
    return natural
def thetaJoin(dataTable1,dataTable2,conditions):
        cartesian = cartesianProduct(dataTable1,dataTable2)
        theta = selection(cartesian,conditions)
        return theta
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
    df3 = pd.DataFrame({'ID': [1, 2, 3],
                    'Name': ['Alice', 'Bob', 'Charlie']})

    df4 = pd.DataFrame({'ID': [1, 2, 4],
                    'Age': [25, 30, 35]})
    #print("Cartesian Product: \n",cartesianProduct(df1,df2))
    print("Natural Join: \n", naturalJoin(df3,df4))
    #print("Theta Join: \n", thetaJoin(df1,df2,'A >= 3 and D = True'))
