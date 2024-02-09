import pandas as pd
import os
def main():
    fileName = input("File Name: ")
    inputList = []
    while fileName != "quit":
        currentDirectory = os.getcwd()
        parentDirectory = os.path.dirname(currentDirectory)
        dataTableFolder = os.path.join(parentDirectory, 'dataTables')
        file = os.path.join(dataTableFolder,fileName)
        #print(pd.read_csv(file))
        inputList.append(pd.read_csv(file))
        print(len(inputList))
        fileName = input("File Name: ")
    return 0
if __name__ == '__main__':
    main()