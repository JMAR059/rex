from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd

from src.relationalAlgebra.relationParsing import symbolize, relationalParser

router = APIRouter()

class Relation(BaseModel):
    #While it would be nice to the type be known, the user can put it any relation
    #Ig we can restrict it to be a string, but the problem remains
    relation: dict[str, list[Any]]
    query: list[str]
     

#Ok so what do we want?
#Chase ig, uhh what else
#Relational solver
#Lets do that one first
#Ok so both of them need arrays, so we will need something like
#{
#        'F': [2, 3, 4, 7, 8],
#        'G': ['a', 'y', 'c', 'w', 'd'],
#        'H': [45.2, 15.6, 65.8, 35.3, 53.1],
#        'I': [True, True, False, False, False],
#        'J': ['apple', 'mango', 'orange', 'blueberry', 'kiwi']
#}
#So yeah, ig two options. Have people format it into the above beforehand, so we dont have to do the work
#Or masssage diff formats into this
#The first is prefereable to save us work down the line so that we do not have to deal with a lot of maintenace,
#Since there can be many cases of people wanting to do diff stuff

'''
Runs chase algorithm on a relation
Returns: A canonical relation if it exists
Errors: 400 if the cannonical does not exist
        500 if there is an error during the algorithm
'''
@router.post("/chase")
async def chase_algorithm(relation: Relation):
    return 

'''
Given a relation, runs the specified commands.
Returns: The data as a result of the relational algebra
Errors: 400 if there is any error in executing the query on the user side, eg a syntax error
        500 if there is an error during the algorithm
'''
@router.post("/relational_algebra")
async def relational_parser(relation: Relation):
    #print(relation)
    #Symbolize the input
    df = pd.DataFrame(relation.relation)
    #symbolized = symbolize()
    #print(symbolized)
    #then parse it
    rootNode = relationalParser(line=relation.query, debug=True)
    rootNode.resolve(df)
    print(rootNode)
    return 200
