// (ab)using http://infolab.stanford.edu/~ullman/fcdb/aut07/slides/ra.pdf
#include <iostream>
#include <cassert>

#include "lexer.h"

// UTF8 support
typedef unsigned char uchar;
static int get_char_len(char c_) {
    uchar c = (uchar) c_;
    // 0yyyzzzz
    if ((c & 0x80) == 0x00) return 1;
    // 110xxxyy
    if ((c & 0xe0) == 0xc0) return 2;
    // 1110wwww
    if ((c & 0xf0) == 0xe0) return 3;
    // 11110uvv
    if ((c & 0xf8) == 0xf0) return 4;
    assert(false);
}

// Hacky UTF support
static std::string read_utf8_char(const std::string &str, size_t index) {
    int len = get_char_len(str[index]);
    return str.substr(index, len);
}

// Stream
std::string Stream::peek() const {
    if (index >= input.size()) return "";
    return read_utf8_char(input, index);
}

std::string Stream::eat() {
    std::string ret = peek();
    index += ret.size();
    return ret;
}

// Char tests
static inline constexpr bool isalpha(const std::string &c) {
    return c.size() == 1 &&
        (('a' <= c[0] && c[0] <= 'z') || ('A' <= c[0] && c[0] <= 'Z'));
}
static inline constexpr bool isnum(const std::string &c) {
    return c.size() == 1 && '0' <= c[0] && c[0] <= '9';
}
static inline constexpr bool isalphanum(const std::string &c) {
    return isalpha(c) || isnum(c);
}
static inline constexpr bool islitchar(const std::string &c) {
    return isalpha(c) || isnum(c) || (c.size() == 1 && c[0] == ' ');
}
static inline constexpr bool iswhitespace(const std::string &c) {
    return c.size() == 1 && (c[0] == ' ' || c[0] == '\n' || c[0] == '\t');
}

// Token
Token::Token(const Stream &s, char next, TokenType tokt)
    : start(s.index), end(0), data(1, next), tt(tokt)
{}
Token::Token(const Stream &s, TokenType tokt)
    : start(s.index), end(0), data(""), tt(tokt)
{}

void Token::finish(const Stream &s) {
    end = s.index;
}

void Token::print() const {
    std::cout << "Tok{tt: " << int(tt) << ", data: \"" << data << "\"}";
}

// Lexing
#define SINGLE_CHAR_LEX(chr, tok) else if (next == chr) { \
       Token nexttok(stream, tok); \
       nexttok.data = next; \
       stream.eat(); \
       nexttok.finish(stream); \
       ret.push_back(nexttok); \
   }

static inline bool iskw(const std::string &ident) {
    return ident == "select" || ident == "project" || ident == "product";
}

std::vector<Token> lex(const std::string &input, int &fail_index) {
    Stream stream{input};
    std::vector<Token> ret{};

    fail_index = 0;
    std::string next = stream.peek();
    while (next != "") {
        if (isalpha(next)) {
            // Literal/keyword
            Token nexttok(stream, TokenType::Literal);
            bool space = false;
            do {
                nexttok.data += stream.eat();
                space = next == " ";
                next = stream.peek();
                if (next == " " && iskw(nexttok.data)) break;
            } while (!space ? islitchar(next) : isalpha(next));
            nexttok.finish(stream);

            // Remove trailing whitespace
            while (nexttok.data[nexttok.data.size() - 1] == ' ') {
                nexttok.data.resize(nexttok.data.size() - 1);
            }

            // Check if it's a keyword
            if (nexttok.data == "select") nexttok.tt = TokenType::Selection;
            if (nexttok.data == "project") nexttok.tt = TokenType::Projection;
            if (nexttok.data == "product") nexttok.tt = TokenType::Product;
            ret.push_back(nexttok);
        } else if (isnum(next) || next == ".") {
            // This intentionally doesn't handle negatives!
            // They are easier to handle in parsing
            // Negative numbers aren't real anyway
            // They are just math syntax sugar over `0-x`

            // Number
            Token nexttok(stream, TokenType::Number);

            // Integer-part
            if (next != ".") {
                do {
                    nexttok.data += stream.eat();
                    next = stream.peek();
                } while (isnum(next));
            } else {
                nexttok.data += "0";
            }

            // Mantissa
            if (next == ".") {
                // Eat "."
                nexttok.data += stream.eat();
                next = stream.peek();
                // Read mantissa
                while (isnum(next)) {
                    nexttok.data += stream.eat();
                    next = stream.peek();
                };
            }

            nexttok.finish(stream);
            ret.push_back(nexttok);
        } else if (next == "\"") {
            // Strings
            Token nexttok(stream, TokenType::String);
            // Skip first "\""
            stream.eat();

            // Read the string
            bool skip = false;
            next = stream.peek();
            while (next != "\"" || skip) {
                if (skip) {
                    // Escape chars
                    if (next == "n") nexttok.data += "\n";
                    else if (next == "t") nexttok.data += "\t";
                    else if (next == "\"") nexttok.data += "\"";
                    else if (next == "'") nexttok.data += "'";
                    else if (next == "\\") nexttok.data += "\\";
                    else nexttok.data += next;
                    skip = false;
                } else {
                    // Normal chars
                    skip = next == "\\";
                    if (!skip) {
                        nexttok.data += next;
                    }
                }
                stream.eat();
                next = stream.peek();
            }

            // Finish
            stream.eat();
            nexttok.finish(stream);
            ret.push_back(nexttok);
        } else if (next == ">") {
            Token nexttok(stream, TokenType::GreaterThan);
            nexttok.data = next;
            stream.eat();
            if (stream.peek() == "=") {
                nexttok.tt = TokenType::GreaterEq;
                nexttok.data += "=";
                stream.eat();
            }
            nexttok.finish(stream);
            ret.push_back(nexttok);
        } else if (next == "<") {
            Token nexttok(stream, TokenType::LessThan);
            nexttok.data = next;
            stream.eat();
            if (stream.peek() == "=") {
                nexttok.tt = TokenType::LessEq;
                nexttok.data += "=";
                stream.eat();
            }
            nexttok.finish(stream);
            ret.push_back(nexttok);
        } else if (next == "!") {
            Token nexttok(stream, TokenType::Not);
            nexttok.data = next;
            stream.eat();
            if (stream.peek() == "=") {
                nexttok.tt = TokenType::NotEq;
                nexttok.data += "=";
                stream.eat();
            }
            nexttok.finish(stream);
            ret.push_back(nexttok);
        } else if (next == "-") {
            Token nexttok(stream, TokenType::Minus);
            nexttok.data = next;
            stream.eat();
            if (stream.peek() == ">") {
                nexttok.tt = TokenType::ElmProject;
                nexttok.data += ">";
                stream.eat();
            }
            nexttok.finish(stream);
            ret.push_back(nexttok);
        }
        SINGLE_CHAR_LEX(",", TokenType::Comma)
        SINGLE_CHAR_LEX("(", TokenType::LParan)
        SINGLE_CHAR_LEX(")", TokenType::RParan)
        SINGLE_CHAR_LEX("[", TokenType::LBrack)
        SINGLE_CHAR_LEX("]", TokenType::RBrack)
        SINGLE_CHAR_LEX("{", TokenType::LBrace)
        SINGLE_CHAR_LEX("}", TokenType::RBrace)
        SINGLE_CHAR_LEX("_", TokenType::Underscore)
        SINGLE_CHAR_LEX("=", TokenType::Equal)
        SINGLE_CHAR_LEX("+", TokenType::Plus)
        SINGLE_CHAR_LEX("*", TokenType::Times)
        SINGLE_CHAR_LEX("/", TokenType::Div)
        SINGLE_CHAR_LEX("&", TokenType::And)
        SINGLE_CHAR_LEX("|", TokenType::Or)
        SINGLE_CHAR_LEX("σ", TokenType::Selection)
        SINGLE_CHAR_LEX("π", TokenType::Projection)
        SINGLE_CHAR_LEX("Χ", TokenType::Product)
        // TODO: Keywords for all of these
        SINGLE_CHAR_LEX("⋈", TokenType::Join)
        SINGLE_CHAR_LEX("ρ", TokenType::Rename)
        SINGLE_CHAR_LEX("∪", TokenType::Union)
        SINGLE_CHAR_LEX("∩", TokenType::Intersect)
        else if (iswhitespace(next)) {
            // Skip whitespace
            stream.eat();
        } else {
            std::cout << "Error: Failed to lex '" << next << "'" << std::endl;
            return {};
        }
#if 0 // Debug
        std::cout << "Added: ";
        ret.back().print();
        std::cout << std::endl;
#endif
        fail_index = stream.index;
        next = stream.peek();
    }
    return ret;
}
