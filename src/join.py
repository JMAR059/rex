import pandas as pd
from projection import projection, selection

def cartesianProduct(dataTable1,dataTable2):
        cartesian = dataTable1.join(dataTable2,rsuffix = " Other", how = "cross")
        return cartesian
def naturalJoin(dataTable1,dataTable2):
    commonCols = set(dataTable1) & set(dataTable2)
    for col in commonCols:
        if df1[col].dtype != df2[col].dtype:
            raise ValueError(f"Column '{col}' has mismatched data types: {df1[col].dtype} in df1, {df2[col].dtype} in df2")
    natural = pd.merge(dataTable1,dataTable2, on = None)
    
    return natural
def thetaJoin(dataTable1,dataTable2,conditions):
        cartesian = cartesianProduct(dataTable1,dataTable2)
        theta = selection(cartesian,conditions,cartesian.columns.tolist(),cartesian.columns.tolist())
        return theta
if __name__ == '__main__':
    df1 = pd.DataFrame({
    'A': [1, 3, 4, 5, 6],
    'B': ['a', 'c', 'd', 'd', 'e'],
    'C': ['d', 'c', 'f', 'b', 'f']
    })

    df2 = pd.DataFrame({
    'A': ['a', 'b', 'c', 'd', 'e'],
    'D': [100, 300, 400, 200, 150]
    })
    print("Cartesian Product: \n",cartesianProduct(df1,df2))
    print("Natural Join: \n", naturalJoin(df1,df2))
    #print("Theta Join: \n", thetaJoin(df1,df2,'A > 3'))
