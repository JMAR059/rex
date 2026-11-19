# C++ Backend

This is the C++ backend

## Examples

- Selection: `select_{Name="Kate"} Test`
- Projection: `project_{Name+" "+Last Name->Full Name,2026-Year->Year} Test`
- Product: `(R1) join (R2)`
- Combinations: `project_{Name+" "+Last Name->Full Name,2026-Year->Year} select_{Name="Kate"} Test`

## Build modes

Currently there are two build modes, local and website.

### Local

The default, used for running the backend by itself, built with `make` and outputted to `./cppdb`.

When it is build like this it compiles to whatever the host machine is running and takes input in via STDIN.

For using, run `./cppdb <TableName> <input.csv>`, for example: `./cppdb Test cpp-src/test.csv`

### Website

DOES NOT CURRENTLY WORK/EXIST

Built with `make web`, used for building together with the front end.

When this is enabled it is compiled to WASM using emscripten.

## Organization

Currently it is split into a file per component, although most components are closely linked with one before and after then in the execution.

### `main`

Takes in the input, lexes, parses, and runs it.

In local mode, it starts a REPL in the terminal.

<!-- In web mode, it only runs when triggered by the front end, and returns any errors or output -->

Interacts with `lexer`, `parser`, `engine`, and (for CSV imports) `db`

### `lexer`

Lexes the input from a UTF8 string to a vector of lexical tokens.

#### `TokenType`

An enum declaring the type of lexical token.

#### `Token`

- `size_t start`: The offset of where it starts from the string it's from
- `size_t end`: The offset of where it ends from the string it's from
- `std::string data`: Any needed data for the token (ie, identifier name, string contents, int value)
- `TokenType tt`: The type of token

#### `std::string Stream::peek() const`

Returns the current UTF8 char without advancing the stream.

Returns `""` on reaching the end of the stream.

#### `std::string Stream::eat()`

Returns the current UTF8 char and then advances the stream beyond it.

Returns `""` on reaching the end of the stream.

#### `std::vector<Token> lex(const std::string &input, int &fail_index)`

Takes in a UTF8 string input and returns a list of tokens.

On failure, an empty vector is returned and `fail_index` is set to the index of the failure.

On success, an non-empty vector is returned and `fail_index` should be ignored,

### `parser`

Parses a vector of lexical tokens into a Abstract Syntax Tree (AST).

It uses the a [recursive descent parsing](https://en.wikipedia.org/wiki/Recursive_descent_parser) method.

#### `BinopType` enum

The type of binary/dyadic operation, ie `BinopType::GreaterThan`, `BinopType::Plus`, `BinopType::And`,

Note that `BinopType::And` and `BinopType::Or` are logical operators (`&&`/`||`) and not bit operations (`&`/`|`).

#### `ASTNodeType`

The type of ASTNode, ie `ASTNodeType::SelectTable`, `ASTNodeType::BinopExpr`, or `ASTNodeType::StringExpr`.

#### Typdefs

```
typedef const std::vector<Token> &Tokens;
typedef std::unique_ptr<ASTNode> Node;
#define NODE std::make_unique
#define MOVE std::move
```

Note that the use of `std::unique_ptr` can make errors very ugly to deal with.

For returning a node from a parsing function, use `NODE<SomeNode>(x1, ..., xn)`, where `SomeNode` is the type and `x1, ..., xn` are the arguments for `SomeNode`'s 
constructor.

For adding a subnode to a node, use `MOVE(x)` and then don't touch `x` again.

#### `ERR` macro

**Use this after every parse call!** It checks if the node is null and passes on the error instead of just letting you deal with it.
It does contain a return, so after using `ERR(x)` you can assume `x != nullptr`.

#### `ParseError`

- `std::string error_msg`: The error message
- `Token token`: The offending token

#### `Token &Parser::peek(Tokens tokens) const`

Returns the current token without advancing the parser.

Returns `Token(0, 0, "<END>", TokenType::End)` on reaching the end of the parser.

#### `Token &Parser::eat(Tokens tokens)`

Returns the current token then advances the parser beyond it.

Returns `Token(0, 0, "<END>", TokenType::End)` on reaching the end of the parser.

#### `void Parser::error(const std::string &msg, const Token &token)`

Appends an error to `Parser::errors`, `msg` is the error message and `token` is the offending token.

#### `Node Parser::parse(Tokens tokens)`

The highest parser, calls lower parsers to produce a complete AST.

Not called by any subparsers.

Returns `nullptr` on failure, errors are stored in `this->errors`.

#### `Node Parser::parse_*(Tokens tokens)`

A lower-level parser, parses something, taking advantage of lower-parsers and gets called by higher parsers.

More of these will be added as features are.

### `engine`

In charge of running the AST from the parser.

#### `bool Engine::run_node(ASTNode *node, bool tl = false)`

Runs a node.

When called from main `tl = true`, otherwise `tl = false`.

### `db`

The data structure that stores a single table

Each `Table` has a number of `Rows`, which have a number of `Records`.
