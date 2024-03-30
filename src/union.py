import pandas as pd
def union(dataTable1, dataTable2):
    newTable = pd.concat([dataTable1,dataTable2]).drop_duplicates()
    return newTable
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
    print(union(df1,df2))