import pandas as pd
class join:
    def cartesianProduct(dataTable1,dataTable2):
        cartesian = dataTable1.join(dataTable2,rsuffix = " Other", how = "cross")
        return cartesian
    def naturalJoin(dataTable1,dataTable2):
        natural= pd.merge(dataTable1,dataTable2,left_index=True, right_index=True)
        return natural
    #def thetaJoin(dataTable1,dataTable2,conditions):
