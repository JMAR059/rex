import pandas as pd
import os
from union import union
from difference import difference
from projection import projection,selection
from join import join
from intersection import intersection
def main():
    '''
    fileName = input("File Name: ")
    inputList = []
    while fileName != "quit":
        currentDirectory = os.getcwd()
        print(currentDirectory)
        dataTableFolder = os.path.join(currentDirectory, 'dataTables')
        file = os.path.join(dataTableFolder,fileName)
        print(file)
        print(pd.read_csv(file))
        inputList.append(pd.read_csv(file))
        print(len(inputList))
        fileName = input("File Name: ")
    '''
    df1 = pd.DataFrame({
        'A': [1, 2, 3, 4, 5],
        'B': ['a', 'b', 'c', 'd', 'e'],
        'C': [10.5, 20.3, 30.1, 40.7, 50.9],
        'D': [True, False, True, False, True],
        'E': ['apple', 'banana', 'orange', 'grape', 'kiwi']
    })

    df2 = pd.DataFrame({
        'A': [3, 4, 5, 6],
        'B': ['c', 'd', 'e', 'f']
    })

    print("Union: \n" ,union(df1,df2))
    print("Difference: \n",difference(df1,df2))
    print("Projection: \n",projection(df1, ['A','C','E']))
    print("Selection: \n", selection(df1,"A > 2"))
    print("Temp Select: \n", df1[df1['A'] > 2])
    #print("Cartesian: \n",join.cartesianProduct(df1,df2))
    #print("Intersection: \n",intersection(df1,df2))
    #print("Natural Join: \n",join.naturalJoin(df1,df2))
    return 0

if __name__ == '__main__':
    main()