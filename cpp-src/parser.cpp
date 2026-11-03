#include <algorithm>
#include <cmath>

#include "parser.h"

#define ERR(x) if (x.get() == nullptr) return x

static double string_to_double(const std::string &str) {
    char *end = NULL;
    double val = strtod(str.c_str(), &end);
    if (end != str.c_str() && *end == '\0') {
        return val;
    }
    return HUGE_VAL;
}

void Parser::error(const std::string &msg, const Token &token) {
    this->errors.push_back({msg, token});
}

Node Parser::parse_base_expr(Tokens tokens) {
    const Token &at = this->peek(tokens);
    if (at.tt == TokenType::LParan || at.tt == TokenType::LBrace) {
        TokenType closing = at.tt == TokenType::LParan
            ? TokenType::RParan
            : TokenType::RBrace;
        this->eat(tokens);
        Node ret = this->parse_tl_expr(tokens);
        if (this->peek(tokens).tt == closing) {
            this->eat(tokens);
        } else {
            // TODO: Error Messages
            if (at.tt == TokenType::LParan) {
                error("Expected ')'", this->peek(tokens));
            } else {
                error("Expected '}'", this->peek(tokens));
            }
            return nullptr;
        }
        // Return
        return ret;
    } else if (at.tt == TokenType::Number) {
        // Eat, convert, and ret
        this->eat(tokens);
        double dval = string_to_double(at.data);
        // TODO: Error Messages
        if (dval == HUGE_VAL) {
            error("Failed to convert to to double", at);
            return nullptr;
        }
        return NODE<BaseNumExprNode>(dval);
    } else if (at.tt == TokenType::Literal) {
        // Eat and ret
        this->eat(tokens);
        return NODE<BaseLitExprNode>(at.data);
    } else if (at.tt == TokenType::String) {
        // Eat and ret
        this->eat(tokens);
        return NODE<BaseStrExprNode>(at.data);
    }
    // TODO: Error Messages
    error("Unknown expression", this->peek(tokens));
    return nullptr;
}


// Lookup from TokenType to corresponding BinopType
// Returns BinopType::None when it fails
BinopType binop_from_token(TokenType tt) {
    switch (tt) {
        case TokenType::Plus:
            return BinopType::Plus;
        case TokenType::Minus:
            return BinopType::Minus;

        case TokenType::Times:
            return BinopType::Times;
        case TokenType::Div:
            return BinopType::Div;

        case TokenType::And:
            return BinopType::And;
        case TokenType::Or:
            return BinopType::Or;

        case TokenType::GreaterThan:
            return BinopType::GreaterThan;
        case TokenType::LessThan:
            return BinopType::LessThan;
        case TokenType::Equal:
            return BinopType::Equal;
        case TokenType::GreaterEq:
            return BinopType::GreaterEq;
        case TokenType::LessEq:
            return BinopType::LessEq;
        case TokenType::NotEq:
            return BinopType::NotEq;

        default:
            return BinopType::None;
    }
}

// Helper for the binops that does parsing respectful to precedence
Node Parser::parse_binop_helper(
    Tokens tokens, std::vector<BinopType> ops,
    BinopCallback_t callback,
    bool can_repeat, bool can_repeat_diff
) {
    Node ret = (*this.*callback)(tokens);
    ERR(ret);
    BinopType last = BinopType::None;
    while (1) {
        Token op = this->peek(tokens);
        BinopType binop = binop_from_token(op.tt);
        if (binop == BinopType::None) return ret;
        // Check if the op can be used
        if (std::find(ops.begin(), ops.end(), binop) == ops.end()) {
            // Can't be used
            return ret;
        }
        if (!can_repeat_diff && last != BinopType::None && last != binop) {
            // Invalid repeat
            error(
                "Cannot repeat this operator with a different operator"
                " of same precedence, please use parentheses",
                op
            );
            // Continue lexing as to not cause cascading errors
        }
        // Eat
        this->eat(tokens);
        Node rhs = (*this.*callback)(tokens);
        ERR(rhs);
        ret = NODE<BinopNode>(MOVE(ret), MOVE(rhs), binop);
        if (!can_repeat) {
            // No repeats
            return ret;
        }
        last = binop;
    }
    return ret;
}

Node Parser::parse_binop_math2(Tokens tokens) {
    // Parse * and /
    return parse_binop_helper(
        tokens, {BinopType::Times, BinopType::Div},
        &Parser::parse_base_expr
    );
}
Node Parser::parse_binop_math1(Tokens tokens) {
    // Parse + and -
    return parse_binop_helper(
        tokens, {BinopType::Plus, BinopType::Minus},
        &Parser::parse_binop_math2
    );
}
Node Parser::parse_binop_cmp(Tokens tokens) {
    // Parse >, <, =, >=, <=, and !=
    return parse_binop_helper(
        tokens, {
            BinopType::GreaterThan,
            BinopType::LessThan,
            BinopType::Equal,
            BinopType::GreaterEq,
            BinopType::LessEq,
            BinopType::NotEq,
        }, &Parser::parse_binop_math1,
        false
    );
}
Node Parser::parse_binop_logic(Tokens tokens) {
    // Parse & and |
    return parse_binop_helper(
        tokens, {BinopType::And, BinopType::Or},
        &Parser::parse_binop_cmp,
        true, false
    );
}
Node Parser::parse_binop_expr(Tokens tokens) {
    return this->parse_binop_logic(tokens);
}

Node Parser::parse_tl_expr(Tokens tokens) {
    return this->parse_binop_expr(tokens);
}

Node Parser::parse_lower_table_expr(Tokens tokens) {
    const Token &at = this->peek(tokens);
    if (at.tt == TokenType::Selection) {
        // Parse selection
        this->eat(tokens);
        // Optional underscore
        if (this->peek(tokens).tt == TokenType::Underscore)
            this->eat(tokens);
        // Expression
        Node expr = this->parse_tl_expr(tokens);
        ERR(expr);
        // Table
        Node table = this->parse_lower_table_expr(tokens);
        ERR(table);
        // Selection
        return NODE<SelectTableNode>(MOVE(table), MOVE(expr));
    } else if (at.tt == TokenType::Projection) {
        // Parse projection
        this->eat(tokens);
        // Optional underscore
        if (this->peek(tokens).tt == TokenType::Underscore)
            this->eat(tokens);
        // Optional braces
        bool needs_braces = this->peek(tokens).tt == TokenType::LBrace;
        if (needs_braces) this->eat(tokens);
        // Any number of attributes
        std::vector<ProjectionAttr> attrs = {};
        while (true) {
            // Expression
            Node expr = this->parse_tl_expr(tokens);
            ERR(expr);
            std::string name = "";
            if (this->peek(tokens).tt == TokenType::ElmProject) {
                // Explicit projection name
                this->eat(tokens);
                if (this->peek(tokens).tt != TokenType::Literal) {
                    error("Expected literal for projection name", this->peek(tokens));
                    return nullptr;
                }
                name = this->eat(tokens).data;
            } else if (expr->type == ASTNodeType::LiteralExpr) {
                // Implicit projection name
                name = ((BaseLitExprNode *) expr.get())->str;
            } else {
                error("Expected either explicit (*->A) or implicit (A) projection name", this->peek(tokens));
                return nullptr;
            }
            // Add
            attrs.push_back(ProjectionAttr{MOVE(expr), name});
            // Exit or continue
            if (this->peek(tokens).tt == TokenType::Comma) {
                this->eat(tokens);
            } else {
                break;
            }
        }
        // Optional braces
        if (needs_braces) {
            if (this->peek(tokens).tt == TokenType::RBrace) {
                this->eat(tokens);
            } else {
                error("Expected '}' to end projection", this->peek(tokens));
                return nullptr;
            }
        }
        // Table
        Node table = this->parse_lower_table_expr(tokens);
        ERR(table);
        // Selection
        return NODE<ProjectionTableNode>(MOVE(table), MOVE(attrs));
    } else if (at.tt == TokenType::Literal) {
        return NODE<BaseLitExprNode>(this->eat(tokens).data);
    } else if (at.tt == TokenType::LParan) {
        this->eat(tokens);
        Node ret = this->parse_table_expr(tokens);
        ERR(ret);
        if (this->peek(tokens).tt != TokenType::RParan) {
            error("Expected ')'", this->peek(tokens));
        } else this->eat(tokens);
        return ret;
    }
    error("Expected table", this->peek(tokens));
    return nullptr;
}

Node Parser::parse_table_expr(Tokens tokens) {
    Node ret = this->parse_lower_table_expr(tokens);
    ERR(ret);
    // Attempt
    const Token &at = this->peek(tokens);
    if (at.tt == TokenType::Product) {
        this->eat(tokens);
        // Parse rhs
        Node rhs = this->parse_table_expr(tokens);
        ERR(rhs);
        return NODE<ProductTableNode>(MOVE(ret), MOVE(rhs));
    }
    return ret;
}

Node Parser::parse(Tokens tokens) {
    // Top level parse
    errors.clear();
    Node ret = this->parse_table_expr(tokens);
    if (this->peek(tokens).tt != TokenType::End) {
        error("Expected end of line", this->peek(tokens));
    }
    if (errors.size() != 0) return nullptr;
    return ret;
}
