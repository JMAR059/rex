#pragma once

#include <memory>
#include <iostream>

#include "lexer.h"

// Typedef
class ASTNode;
typedef const std::vector<Token> &Tokens;
typedef std::unique_ptr<ASTNode> Node;
#define NODE std::make_unique
#define MOVE std::move

// We can specilize binary operations into their one classes/types if needs be
enum class BinopType {
    // None
    None,

    // Equals
    GreaterThan,
    LessThan,
    Equal,
    GreaterEq,
    LessEq,
    NotEq,

    // Binops
    Plus,
    Minus,
    Times,
    Div,
    And,
    Or
};

enum class ASTNodeType {
    // Base type, don't use
    Invalid,

    // Table Ops
    // Select(tbl: Table, cond: Bool): Table
    SelectTable,
    // Project(tbl: Table, attrs: ("A", Expr)[]): Table
    ProjectTable,
    // Product(lhs: Table, rhs: Table): Table
    ProductTable,

    // Joint exprs
    // Binop(lhs: Expr, op: BinopType, rhs: Expr): Expr
    // This can be specialized if needs be
    BinopExpr,

    // Base exprs
    // Literal(name: String): Expr
    LiteralExpr,
    // String(str: String): String
    StringExpr,
    // Number(num: double): double
    NumberExpr
};

// This janky stuff makes me miss Rust
// If C++ had nice ADTs and pattern matching it would be the only language I'd ever use
// One day I'll just make "C++ with ADTs" and naively reinvent the "C with classes" pattern
// Just look at how pretty this could be: github.com/Bigjango13/Burlap/blob/master/src/parser.rs
class ASTNode {
public:
    ASTNodeType type = ASTNodeType::Invalid;

    ASTNode(ASTNodeType type) : type(type) {}

    virtual void print() = 0;
};

// TODO: Should we do the "make invalid states unrepresentable" thing and
// split into TableASTNode and ExprASTNode?
class SelectTableNode : public ASTNode {
public:
    // TODO: Not sure if Node is best for table, see above todo
    Node table;
    Node criterion;

    SelectTableNode(Node table, Node criterion) :
        ASTNode(ASTNodeType::SelectTable),
        table(MOVE(table)),
        criterion(MOVE(criterion))
    {}

    void print() override {
        std::cout << "SelectTableNode(";
        table->print();
        std::cout << ", ";
        criterion->print();
        std::cout << ")";
    }
};

struct ProjectionAttr {
    Node expr;
    std::string name;

    void print() const {
        expr->print();
        std::cout << " -> " << name;
    }
};

class ProjectionTableNode : public ASTNode {
public:
    Node table;
    std::vector<ProjectionAttr> attributes;

    ProjectionTableNode(Node table, std::vector<ProjectionAttr> attributes) :
        ASTNode(ASTNodeType::ProjectTable),
        table(MOVE(table)),
        attributes(MOVE(attributes))
    {}

    void print() override {
        std::cout << "ProjectionTableNode(";
        table->print();
        std::cout << ", [";
        for (size_t n = 0; n < attributes.size(); n++) {
            attributes[n].print();
            if (n != attributes.size() - 1) std::cout << ", ";
        }
        std::cout << "])";
    }
};

class ProductTableNode : public ASTNode {
public:
    Node lhs;
    Node rhs;

    ProductTableNode(Node lhs, Node rhs) :
        ASTNode(ASTNodeType::ProductTable),
        lhs(MOVE(lhs)),
        rhs(MOVE(rhs))
    {}

    void print() override {
        std::cout << "ProductTableNode(";
        lhs->print();
        std::cout << ", ";
        rhs->print();
        std::cout << ")";
    }
};

class BinopNode : public ASTNode {
    static constexpr const char *optable[] = {
        "?", ">", "<", "=", ">=", "<=", "!=",
        "+", "-", "*", "/", "&", "|"
    };
public:
    Node lhs;
    Node rhs;
    BinopType binop_type;

    BinopNode(Node lhs, Node rhs, BinopType binop_type) :
        ASTNode(ASTNodeType::BinopExpr),
        lhs(MOVE(lhs)),
        rhs(MOVE(rhs)),
        binop_type(binop_type)
    {}

    void print() override {
        std::cout << "(";
        std::cout << optable[int(binop_type)] << " ";
        lhs->print();
        std::cout << " ";
        rhs->print();
        std::cout << ")";
    }
};

class BaseLitExprNode : public ASTNode {
public:
    std::string str;

    BaseLitExprNode(std::string str) : ASTNode(ASTNodeType::LiteralExpr), str(str) {}

    void print() override {
        std::cout << "BaseLitExprNode(" << str << ")";
    }
};

class BaseStrExprNode : public ASTNode {
public:
    std::string str;

    BaseStrExprNode(std::string str) : ASTNode(ASTNodeType::StringExpr), str(str) {}

    void print() override {
        std::cout << "BaseStrExprNode(" << str << ")";
    }
};

class BaseNumExprNode : public ASTNode {
public:
    double num;

    BaseNumExprNode(double num) : ASTNode(ASTNodeType::NumberExpr), num(num) {}

    void print() override {
        std::cout << "BaseNumExprNode(" << num << ")";
    }
};

// Parser
struct ParseError {
    std::string error_msg;
    Token token;
};

class Parser {
    size_t index = 0;

    const Token &peek(Tokens tokens) const {
        if (index >= tokens.size()) return Token::getError();
        return tokens[index];
    }

    const Token &eat(Tokens tokens) {
        const Token &ret = peek(tokens);
        if (ret.tt != TokenType::End) index++;
        return ret;
    }

public:
    std::vector<ParseError> errors = {};
    void error(const std::string &msg, const Token &token);

    Node parse(Tokens tokens);

    // TODO: Table Assignment Expression 'Rn := <table_expr>'
    //Node parse_table_assign_expr(Tokens tokens);

    // Table Expressions
    // Lower (selection, projection, product, etc...)
    Node parse_lower_table_expr(Tokens tokens);
    // Higher (product)
    Node parse_table_expr(Tokens tokens);

    // Top Level Expression '(...)'
    Node parse_tl_expr(Tokens tokens);

    // Binop 'a @ b'
    typedef Node (Parser::*BinopCallback_t)(Tokens tokens);
    Node parse_binop_helper(
        Tokens tokens, std::vector<BinopType> ops,
        BinopCallback_t callback,
        bool can_repeat = true,
        bool can_repeat_diff = true
    );
    Node parse_binop_math2(Tokens tokens);
    Node parse_binop_math1(Tokens tokens);
    Node parse_binop_cmp(Tokens tokens);
    Node parse_binop_logic(Tokens tokens);
    Node parse_binop_expr(Tokens tokens);

    // Base Express (lit, num, str)
    Node parse_base_expr(Tokens tokens);
};
