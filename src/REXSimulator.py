from dbs_chase import full_chase
#from src.REsymbols import symbols, setOpSymbols, joinOpSymbols, singleOpSymbols, allRelationSymbols
from parsing import relationalParser, symbolize
# from typing import Dict
# from src.relationClasses import relationNode, setOperationNode, singleOpNode, joinOpNode, joinOpWithConditionNode

def printRex():
    print("""
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                                  ____
       ___                                      .-~. /_"-._
      `-._~-.                                  / /_ "~o\  :Y
          \  \                                / : \~x.  ` ')
           ]  Y                              /  |  Y< ~-.__j
          /   !                        _.--~T : l  l<  /.-~
         /   /                 ____.--~ .   ` l /~\ \<|Y
        /   /             .-~~"        /| .    ',-~\ \L|
       /   /             /     .^   \ Y~Y \.^>/l_   "--'
      /   Y           .-"(  .  l__  j_j l_/ /~_.-~    .
     Y    l          /    \  )    ~~~." / `/"~ / \.__/l_
     |     \     _.-"      ~-{__     l  :  l._Z~-.___.--~
     |      ~---~           /   ~~"---\_  ' __[>
     l  .                _.^   ___     _>-y~
      \  \     .      .-~   .-~   ~>--"  /
       \  ~---"            /     ./  _.-'
        "-.,_____.,_  _.--~\     _.-~
                    ~~     (   _}               REX!
                           `. ~(
                             )  \\
                            /,`--'~\--'~\\
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~""")

def printDictionary(dictionary):
    print()
    for key in dictionary:
        print(f"{key}: " + str(dictionary[key]))
    print()

def printFDList(list):
    print()
    for ctr in range(0, len(list)):
        print(str(list[ctr][0]) + ' -> ' + str(list[ctr][1]))
    print()

def relationalAlgebraSimulation(completeDataframes):

    print("Relation Algebra Calculator is able to evaluate expressions and get the expected table.")
    print("Take a look at the examples in the provided documents to see the different relations and examples!\n")

    while True:

        print("Input a relational algebra query, or EXIT to go back to the menu.")
        userInput = input("Input: ")
        if userInput == "EXIT":
            break

        try:
            symbolizedInput = symbolize(userInput)
            rootNode = relationalParser(line=symbolizedInput, debug=False)
            resultDF = rootNode.resolve(completeDataframes)
            print("Resulting Dataframe:")
            print(resultDF)
        except Exception as error:
            print(f"Error \"{error}\" occured! Please try inputting again!\n")
            continue

        print("\nRelational algebra query complete! Enter CONT to run it again, or EXIT to go back to the menu.")
        
        while True:
            userInput = input("Input: ")

            if userInput == "CONT":
                break
            elif userInput == "EXIT":
                return
            else:
                print("Unexpected Input! Please try again.")


def chaseAlgorithmSimulation():

    print("The Chase Algorithm takes: an original relation, decomposed relation, and functional dependencies.")
    print("The algorithm applies the functional dependencies on the decomposed relations, to try creating the original.")
    print("If it can be recreated, the decomposition is loseless; otherwise lossy.\n")

    while True:

        # Checking for original Relation
        while True:
            print("Insert the original relation in the form (A,B,C,D)")
            originalInput = input("Original Relation: ").strip()
            print()
            
            if len(originalInput) <= 2 or originalInput[0] != '(' or originalInput[len(originalInput) - 1] != ')':
                print("Input in unexpected format! Please try again.\n")
                continue
                
            originalRelation = originalInput[1:len(originalInput)-1].split(sep=',')
            originalRelation = list(map(lambda x: x.strip(), originalRelation))
            
            print("Original Relation Given: " + str(originalRelation) + '\n')
            break
        
        decomposedRelations = {}
        relationNumber = 1
        print("There can be multiple decomposed relations. Insert as many needed.\n")
        while True:
            if len(decomposedRelations) != 0:
                print("Decomposed Relations so far:")
                printDictionary(decomposedRelations)
            print("Insert a decomposed relation in the format (A,B,C) or enter END to finish.")
            print("If an error occured, enter RESET to start over.")
            decompositionInput = input(f"Input for decomposed relation R{relationNumber}: ").strip()
            print()
            if decompositionInput == "END":
                break
            if decompositionInput == "RESET":
                decomposedRelations = {}
                relationNumber = 1
                continue
            if len(decompositionInput) <= 2 or decompositionInput[0] != '(' or decompositionInput[len(decompositionInput) - 1] != ')':
                print("Input in unexpected format! Please try again.\n")
                continue
            
            decomposedRelation = decompositionInput[1:len(decompositionInput)-1].split(sep=',')
            decomposedRelation = list(map(lambda x: x.strip(), decomposedRelation))
            
            print(f"Decomposed Relation Given for R{relationNumber}: " + str(decomposedRelation) + '\n')
            decomposedRelations[f'R{relationNumber}'] = decomposedRelation
            relationNumber += 1
        
        functionalDependencies = []
        print("There can be multiple functional dependencies. Insert as many needed.\n")
        while True:
            if len(functionalDependencies) != 0:
                print("Functional Dependencies so far:")
                printFDList(functionalDependencies)
            print("Insert a functional dependencies in the format (A) -> (B, C) or enter END to finish.")
            print("If an error occured, enter RESET to start over.")
            fdInput = input("Input for functional dependency: ").strip()
            print()
            if fdInput == "END":
                break
            if '->' not in fdInput:
                print("Input in unexpected format! Please try again.\n")
                continue

            functionalDependency = fdInput.split(sep='->')
            if len(functionalDependency) != 2:
                print("Exactly 2 sides between '->' ")

            LHSInput = functionalDependency[0].strip()
            RHSInput = functionalDependency[1].strip()

            if len(LHSInput) <= 2 or LHSInput[0] != '(' or LHSInput[len(LHSInput) - 1] != ')':
                print("Input for LHS of Functional Dependency in unexpected format! Please try again.\n")
                continue
            LHSList = list(map(lambda x: x.strip(), LHSInput[1:len(LHSInput)-1].split(sep=',')))
            
            if len(RHSInput) <= 2 or RHSInput[0] != '(' or RHSInput[len(RHSInput) - 1] != ')':
                print("Input for RHS of Functional Dependency in unexpected format! Please try again.\n")
                continue
            RHSList = list(map(lambda x: x.strip(), RHSInput[1:len(RHSInput)-1].split(sep=',')))

            print("Functional depency given: " + str(LHSList) + ' -> ' + str(RHSList))
            functionalDependencies.append( (LHSList, RHSList) )
        
        print(originalRelation)
        print(decomposedRelations)
        print(functionalDependencies)
        
        message, canonical = full_chase(originalRelation, decomposedRelations, functionalDependencies, printing=True)
        print(message)

        print("\nChase Algorithm complete! Enter CONT to run it again, or EXIT to go back to the menu.")
        
        while True:
            userInput = input("Input: ")

            if userInput == "CONT":
                break
            elif userInput == "EXIT":
                return
            else:
                print("Unexpected Input! Please try again.")


if __name__ == "__main__":


    testingDataframes = {}
    ### INSERT TEST FOR EXPO HERE

    printRex()
    print("Welcome to REX: Relational Algebra Explorer! This is a toy program to show the REX experience!")
    print("\n" * 2)
    while True:
        print("Please input a number to try one of our features:")
        print("1. Relational Algebra Calculator")
        print("2. Chase Algorithm Solver")
        print("Type EXIT to end program.")
        print()

        userInput = input("Option: ")
        print()

        if userInput == "1":
            relationalAlgebraSimulation(testingDataframes)
        elif userInput == "2": 
            chaseAlgorithmSimulation()
        elif userInput == "EXIT":
            break
        elif userInput == "REX MAXING":
            printRex()
            print("REXSPLOSION")
        else:
            print("Unexpected input! Please care for case sensitivity.")
        print()

    print("Thanks for using REX! Please become the new project lead :)")

