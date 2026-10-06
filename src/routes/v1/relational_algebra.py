from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ValidationError
import pandas as pd

from src.relationalAlgebra.relationParsing import symbolize, relationalParser

router = APIRouter()

class Relation(BaseModel):
    # Multiple tables - dict where keys are table names, values are the table data
    relations: dict[str, dict[str, list[Any]]]
    queries: list[str]

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
async def relational_parser(data: Relation):
    try:
        # Convert each table to a DataFrame
        knownRelations = {}
        for table_name, table_data in data.relations.items():
            knownRelations[table_name] = pd.DataFrame(table_data)
            print(f"Table {table_name}:")
            print(knownRelations[table_name])
        
        results = []
        for query in data.queries:
            symbolized_query = symbolize(query)
            rootNode = relationalParser(line=symbolized_query, relations=knownRelations, debug=True)
            result = rootNode.resolve(knownRelations)
            # Replace NaN and Inf values with None for JSON serialization
            result_dict = result.to_dict()
            # Manually replace NaN and Inf in the dict
            for col in result_dict:
                for key in result_dict[col]:
                    val = result_dict[col][key]
                    if pd.isna(val) or val == float('inf') or val == float('-inf'):
                        result_dict[col][key] = None
            results.append(result_dict)
        if (len(results) != 1):
            print("ERROR: Multiple results when only one expected")
        return {"status": 200, "results": results[0]}
    except Exception as e:
        print(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
