import pandas as pd
def union(dataTable1, dataTable2):
    newTable = pd.concat([dataTable1,dataTable2]).drop_duplicates()
    return newTable