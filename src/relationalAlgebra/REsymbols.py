# Contains containers for relational algebra and boolean symbols/characters
# Should be updated when adding new operations:
# - For relational algebra, be sure to add to the 'symbols' dictionary (key: written term, value: algebraic character),
#   plus adding it to its symbol set, whether the new opertation is between two relations sets, one relation set, or a special join
# - For booleans, make sure to add it to the dictionary (key: symbol string, value: single symbol character) and to the 'booleanSymbols' set

# (key: written term, value: algebraic character)
symbols = {
    "union": "∨",
    "intersect": "∧",
    "-" : "-",
    "select_" : "σ",
    "project_" : "π",
    "X": "⨯",
    "join_": "⨝",
    "join": "⨝",
    "*": "⨝"
}

setOpSymbols = {
    "∨",
    "∧",
    "-"
}

joinOpSymbols = {
    "⨝",
    "⨯"
}

singleOpSymbols = {
    "σ",
    "π"
}

allRelationSymbols = setOpSymbols | joinOpSymbols | singleOpSymbols


# (key: symbol string, value: single symbol character)
booleanSymbols = {
    "≤",
    "≥",
    "≠",
    ">",
    "<",
    "="
}

booleanSymbolMap = {
    "<=" : "≤",
    ">=" : "≥",
    "!=" : "≠",
    "==" : "="    
}
