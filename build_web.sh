em++ -sWASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -sEXPORTED_RUNTIME_METHODS=ccall,cwrap -sEXPORTED_FUNCTIONS=_main,_bridge_addTable,_bridge_run_query cpp-src/*.cpp -o rex.js -std=c++20 -Wall -Wextra -pedantic
mkdir -p app/src/wasm/
mv rex.js app/src/wasm/
mv rex.wasm app/src/wasm/
