#include "engine.h"

#define ERR(x) if (!(x)) return false;
bool Engine::error(const std::string &msg) {
    errors.push_back(EngineError{msg});
    return false;
}

bool Engine::eval_binop_expr(Table *target, Record &val, BinopNode *node) {
    // Eval sides
    // Left
    ERR(eval_expr(target, val, node->lhs.get()));

    // Short circuiting
    if (node->binop_type == BinopType::And) {
        if (val.getBooleanValue() == false) return true;
    } else if (node->binop_type == BinopType::Or) {
        if (val.getBooleanValue() == true) return true;
    }

    // Right
    Record other(false);
    ERR(eval_expr(target, other, node->rhs.get()));

    // Eval binop
    switch (node->binop_type) {
        case BinopType::Equal:
            val = Record(val == other);
            return true;
        case BinopType::NotEq:
            val = Record(val == other);
            return true;

        case BinopType::GreaterThan:
            val = Record(val.getDoubleValue() > other.getDoubleValue());
            return true;
        case BinopType::LessThan:
            val = Record(val.getDoubleValue() < other.getDoubleValue());
            return true;
        case BinopType::GreaterEq:
            val = Record(val.getDoubleValue() >= other.getDoubleValue());
            return true;
        case BinopType::LessEq:
            val = Record(val.getDoubleValue() <= other.getDoubleValue());
            return true;

        case BinopType::Plus:
            if (val.type == 's' || other.type == 's') {
                val = Record(val.getStringValue() + other.getStringValue());
            } else {
                val = Record(val.getDoubleValue() + other.getDoubleValue());
            }
            return true;
        case BinopType::Minus:
            val = Record(val.getDoubleValue() - other.getDoubleValue());
            return true;
        case BinopType::Times:
            val = Record(val.getDoubleValue() * other.getDoubleValue());
            return true;
        case BinopType::Div:
            if (other.getDoubleValue() == 0.0) {
                val = Record(0.0);
            } else {
                val = Record(val.getDoubleValue() / other.getDoubleValue());
            }
            return true;

        // Short circuiting behavior is handled earlier
        case BinopType::And:
        case BinopType::Or:
            val = other;
            return true;
        default:
            error("Invalid binop: " + std::to_string((int) node->binop_type));
            return false;
    }
}

bool Engine::eval_expr(Table *target, Record &val, ASTNode *node) {
    if (node->type == ASTNodeType::BinopExpr) {
        return eval_binop_expr(target, val, (BinopNode *) node);
    } else if (node->type == ASTNodeType::StringExpr) {
        val = Record(((BaseStrExprNode *) node)->str);
        return true;
    } else if (node->type == ASTNodeType::NumberExpr) {
        val = Record(((BaseNumExprNode *) node)->num);
        return true;
    } else if (node->type == ASTNodeType::LiteralExpr) {
        std::string str = ((BaseLitExprNode *) node)->str;
        for (const auto &c : target->columns) {
            if (c.name == str) {
                val = c.records[this->tb_index];
                return true;
            }
        }
        error("No field in the table called \"" + str + "\"");
        return false;
    }
    error("Not an expr: " + std::to_string((int) node->type));
    return false;
}

bool Engine::run_project(ProjectionTableNode *node) {
    // Get the table
    ERR(run_node(node->table.get()));
    Table *target = anon;
    if (target == NULL) {
        return error("Got NULL table for project! This should never happen!");
    }
    // Add the columns
    Table *tb = new Table("");
    for (auto &attr : node->attributes) {
        tb->addCol(attr.name);
    }
    // Add the rows
    for (int i = 0; i < (int) target->columns[0].records.size(); i++) {
        this->tb_index = i;
        std::vector<Record> row = {};
        for (auto &attr : node->attributes) {
            Record other(false);
            if (!eval_expr(target, other, attr.expr.get())) {
                delete(tb);
                free_anon();
                return false;
            }
            row.push_back(other);
        }
        tb->addRow(row);
    }
    // Return
    free_anon();
    anon = tb;
    return true;
}

bool Engine::run_product(ProductTableNode *node) {
    // Left
    ERR(run_node(node->lhs.get()));
    Table *lhs = anon;
    if (lhs == NULL) {
        return error("Got NULL lhs table for product! This should never happen!");
    }
    // Right
    ERR(run_node(node->rhs.get()));
    Table *rhs = anon;
    if (rhs == NULL) {
        return error("Got NULL rhs table for product! This should never happen!");
    }

    // Add the columns
    std::vector<std::string> names = {};
    for (auto &col : lhs->columns) { names.push_back(col.name); };
    size_t names_s = names.size();
    for (auto &col : rhs->columns) {
        bool added = false;
        for (size_t i = 0; i < names_s; i++) {
            // Rename
            if (names[i] == col.name) {
                // New column
                if (rhs->name != "") {
                    names.push_back(rhs->name + "." + col.name);
                } else {
                    names.push_back(col.name + "2");
                }
                // Old column
                if (lhs->name != "") {
                    names[i] = lhs->name + "." + col.name;
                } else {
                    names[i] = col.name + "1";
                }
                added = true;
                break;
            }
        }
        if (!added) names.push_back(col.name);
    }
    Table *tb = new Table("");
    for (auto &name : names) {
        tb->addCol(name);
    }

    Record invalid = Record(false);
    size_t lhs_size = lhs->columns[0].records.size();
    size_t rhs_size = rhs->columns[0].records.size();
    for (size_t i = 0; i < lhs_size; i++) {
        std::vector<Record> row = {};
        for (auto &col : lhs->columns) {
            row.push_back(col.records[i]);
        }
        size_t ors = row.size();
        for (size_t ii = 0; ii < rhs_size; ii++) {
            for (auto &col : rhs->columns) {
                row.push_back(col.records[ii]);
            }
            tb->addRow(row);
            // TODO: Eval with this->tb_index;
            row.resize(ors, invalid);
        }
    }

    // Return
    free_anon();
    free_anon(lhs);
    anon = tb;
    return true;
}

bool Engine::run_select(SelectTableNode *node) {
    // Get the table
    ERR(run_node(node->table.get()));
    Table *target = anon;
    if (target == NULL) {
        return error("Got NULL table for select! This should never happen!");
    }

    // Test the condition each time
    Table *tb = new Table("");
    for (auto &c : target->columns) {
        tb->addCol(c.name);
    }
    // TODO: 0 columns
    for (int i = 0; i < (int) target->columns[0].records.size(); i++) {
        this->tb_index = i;

        Record other(false);
        if (!eval_expr(target, other, node->criterion.get())) {
            delete(tb);
            free_anon();
            return false;
        }
        if (!other.getBooleanValue()) continue;
        std::vector<Record> row = {};
        for (auto &c : target->columns) {
            row.push_back(c.records[i]);
        }
        tb->addRow(row);
    }
    free_anon();
    anon = tb;

    return true;
}

bool Engine::run_lit(BaseLitExprNode *node) {
    // Get the table
    if (!tables.contains(node->str)) {
        error("No table named \"" + node->str + "\"");
        return false;
    }
    anon = tables[node->str];
    return true;
}

bool Engine::run_node(ASTNode *node, bool tl) {
    if (tl) errors.clear();

    if (node->type == ASTNodeType::SelectTable) {
        ERR(run_select((SelectTableNode *) node));
    } else if (node->type == ASTNodeType::ProjectTable) {
        ERR(run_project((ProjectionTableNode *) node));
    } else if (node->type == ASTNodeType::ProductTable) {
        ERR(run_product((ProductTableNode *) node));
    } else if (node->type == ASTNodeType::LiteralExpr) {
        ERR(run_lit((BaseLitExprNode *) node));
    } else {
        return error(
            "Unknown operation "
            + std::to_string((int) node->type)
            + ", please report this error"
        );
    }
    if (tl && anon) {
        anon->print();
        std::cout << std::endl;
        free_anon();
    }
    return true;
}

void Engine::print() {
    for (auto &it : tables) {
        it.second->print();
    }
}
