import pandas as pd
def difference(dataTable1, dataTable2):
    mergedDt = pd.merge(dataTable1, dataTable2, how='outer', indicator=True)
    setDifference = mergedDt[mergedDt['_merge'] == 'left_only'].drop(columns='_merge')
    return setDifference
