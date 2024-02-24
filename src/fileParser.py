import pandas as pd
import os
from union import union
from difference import difference
from projection import projection,selection
from join import join
from intersection import intersection
def parenthetic_contents(string):
    stack = []
    for i, c in enumerate(string):
        if c == '(':
            stack.append(i)
        elif c == ')' and stack:
            start = stack.pop()
            yield (string[start + 1: i])
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
    #print("Union: \n" ,union(df1,df2))
    #print("Difference: \n",difference(df1,df2))
    #print("Projection: \n",projection(df1, ['A','C','E']))
    print(df1)
    print("Selection: \n", selection(df1,"A > 2 or B < 'e' or E = True"))
    #print(list(parenthetic_contents("((R x S) x T) and (V x B)")))
    #print("Cartesian: \n",join.cartesianProduct(df1,df2))
    #print("Intersection: \n",intersection(df1,df2))
    #print("Natural Join: \n",join.naturalJoin(df1,df2))
    return 0

if __name__ == '__main__':
    main()