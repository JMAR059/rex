#include <emscripten/bind.h>
#include <string>
#include <sstream>

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
// emcc bridge.cpp src/**/*.cpp --bind -O3 -o module.js


using namespace emscripten;

EMSCRIPTEN_BINDINGS(backend_bridge){


}