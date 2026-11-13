#include "db.h"
#include "lexer.h"
#include "parser.h"
#include "engine.h"

static void report_error(const std::string &line, size_t offset, size_t len) {
    std::cout << "| " << line << std::endl;
    std::cout << "|-" << std::string(offset, '-');
    std::cout << std::string(len, '^') << " Here";
}

#ifndef WEBSITE
int main(int argc, char *argv[]) {
    if (argc < 3 || ((argc-1)&1) == 1) {
        std::cout << "Usage: " << argv[0] << " TableName input.csv [<TableName2> <input2.csv>]+" << std::endl;
        return 1;
    }

    Engine engine;
    for (int n = 1; n + 1 < argc; n += 2) {
        std::ifstream input;
        input.open(argv[n + 1]);
        if (!input.good()) {
            std::cout << "Failed to open file: " << argv[n + 1] << std::endl;
            return 1;
        }
        Table *tb = new Table(argv[n]);
        tb->addFromCSV(input);
        engine.tables[tb->name] = tb;
    }

    std::string line = "";
    while (1) {
        // Print table
        engine.print();

        // Get the next command
        line = "";
        while (line == "") {
            std::cout << "> ";
            if (!getline(std::cin, line)) {
                // Ctrl-D / EOL
                std::cout << std::endl;
                line = "exit";
                break;
            }
        }
        // Exit command
        if (line == "exit") break;

        std::cout << "Running: '" << line << "'" << std::endl;

        // Lex
        int fail_index = 0;
        std::vector<Token> tokens = lex(line, fail_index);
        if (tokens.size() == 0) {
            report_error(line, fail_index, 1);
            std::cout << std::endl;
            continue;
        }
        std::cout << "Lexed: ";
        for (const auto &t : tokens) {
            t.print();
            std::cout << ", ";
        }
        std::cout << std::endl;

        // Parse
        std::cout << std::endl;
        Parser parser;
        Node ast = parser.parse(tokens);
        if (ast == nullptr) {
            std::cout << "Failed to parse!" << std::endl;
            for (ParseError &perr : parser.errors) {
                size_t size = perr.token.start;
                size_t len = std::max(
                    perr.token.end - perr.token.start,
                    (size_t) 1
                );
                if (perr.token.tt == TokenType::End) {
                    size = line.size();
                    len = 1;
                }
                std::cout << "Error: " << perr.error_msg << std::endl;
                report_error(line, size, len);
                if (perr.token.tt == TokenType::End) {
                    std::cout << " (at end of line)";
                }
                std::cout << std::endl << std::endl;
            }
            continue;
        }
        ast->print();
        std::cout << std::endl;

        // Run
        if (!engine.run_node(ast.get(), true)) {
            std::cout << "Failed to run!" << std::endl;
            for (EngineError &err : engine.errors) {
                std::cout << "Runtime Error: " << err.msg << std::endl;
            }
            continue;
        }
    }
}
#endif