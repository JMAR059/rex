#pragma once

#include <string>
#include <vector>

enum class TokenType {
    // Special
    End = -1,

    // Objects
    Number,  // 1, 20, 1.2
    Literal, // First Name
    String,  // "Kate"

    // Symbols
    LParan, // (
    RParan, // )
    LBrack, // [
    RBrack, // ]
    LBrace, // {
    RBrace, // }

    // Operations
    Selection,  // σ, sigma
    Projection, // π, pi
    Product,    // Χ, chi
    Join,       // ⋈, theta
    Rename,     // ρ, rho

    // Set
    Union,     // ∪
    Intersect, // ∩

    // Comparison
    GreaterThan, // >
    LessThan,    // <
    Not,         // !
    Equal,       // =
    GreaterEq,   // >=
    LessEq,      // <=
    NotEq,       // !=

    // Binops
    Plus,  // +
    Minus, // -
    Times, // *
    Div,   // /
    And,   // &
    Or,    // |

    // Special
    Underscore, // _
    ElmProject, // ->
    Comma, // ,
};

// Stream
struct Stream {
    const std::string &input;
    size_t index = 0;
    std::string peek() const;
    std::string eat();
};

// We store the stream location, data, and tt for each token
struct Token {
    size_t start;
    size_t end;
    std::string data;
    TokenType tt;

    Token(const Stream &s, char next, TokenType tt);
    Token(const Stream &s, TokenType tt);
    static const Token &getError() {
        static const Token error = Token(0, 0, "<END>", TokenType::End);
        return error;
    }
    void finish(const Stream &s);
    void print() const;

private:
    Token(size_t start, size_t end, std::string data, TokenType tt)
        : start(start), end(end), data(data), tt(tt) {};
};

std::vector<Token> lex(const std::string &input, int &fail_index);
