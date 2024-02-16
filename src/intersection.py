import pandas as pd
def intersection(dataTable1,dataTable2):
    intersection =pd.merge(dataTable1, dataTable2, how='inner')
    return intersection