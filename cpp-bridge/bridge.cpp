#include <emscripten/bind.h>
#include <string>
#include <sstream>
#include "db.h"
#include "engine.h"
#include "lexer.h"
#include "parser.h"

/* 
TODO:
1. Figure out where the files are supposed to go
2. Find out what functions I need for the bridge
   -create, delete table
   - execute query

3. in JS, work on turning a talbe into a string
    - use \ to escape all of the commas if a value has a comma in it

    ["abc", 123, "a\, b"] \n [] 

*/
// em++ bridge.cpp ../cpp-src/*.cpp --bind -sMODULARIZE=1 -I../cpp-src -O3 -o module.js


using namespace emscripten;

EMSCRIPTEN_BINDINGS(backend_bridge){
    class_<Table>("Table")
        .constructor<std::string>()  
        .function("addCol", &Table::addCol);
}