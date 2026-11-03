#include <cassert>
#include <cstdlib>
#include <sstream>
#include <iomanip>
#include <format>
#include <cmath>

#include "db.h"

// Table
void Table::addCol(std::string name) {
    // Check for dup names
    bool changed = true;
    int n = 1;
    std::string testing = name + "1";
    while (changed) {
        changed = false;
        for (auto &col : columns) {
            if (n == 1 && col.name == name) {
                col.name = testing;
                n += 1;
                testing = name + std::to_string(n);
                changed = true;
            } else if (col.name == testing) {
                n += 1;
                testing = name + std::to_string(n);
                changed = true;
            }
        }
    }
    if (n == 1) {
        columns.push_back(Column(name));
    } else {
        columns.push_back(Column(testing));
    }
}

void Table::addRow(std::vector<Record> rowvals) {
    // TODO: Proper error handling
    assert(rowvals.size() == columns.size());
    for (size_t i = 0; i < columns.size(); i++) {
        // TODO: Type checking?
        //assert(columns[i].type == rowvals[i].type);
        columns[i].records.push_back(rowvals[i]);
        columns[i].max_align = std::max(
            columns[i].max_align,
            rowvals[i].getStringValue().size()
        );
    }
}

// Imports a table from a CSV file
void Table::addFromCSV(std::istream &stream) {
    // Headers
    std::string cell, line;
    getline(stream, line);
    std::stringstream ss(line);
    while (std::getline(ss, cell, ',')) {
        addCol(cell);
    }

    // Values
    while (std::getline(stream, line)) {
        std::stringstream ss(line);
        int i = 0;
        while (std::getline(ss, cell, ',')) {
            columns[i].records.push_back(Record(cell));
            i++;
        }
    }
}

void Table::print() {
    // Name
    if (this->name != "") {
        std::cout << "Table: " << this->name << std::endl;
    }
    std::string border = "";
    for (auto &col : columns) {
        col.update_max_align();
        border += "+" + std::string(col.max_align + 2, '-');
    }
    border += "+";
    std::cout << border << std::endl;
    // Print headers
    for (auto &col : columns) {
        std::cout << "| " << std::left << std::setw(col.max_align + 1);
        std::cout << col.name;
    }
    std::cout << "|" << std::endl;
    std::cout << border << std::endl;
    if (columns.size() == 0) return;
    // Print the data
    size_t size = columns[0].records.size();
    for (size_t i = 0; i < size; i++) {
        for (auto &col : columns) {
            std::cout << "| " << std::left << std::setw(col.max_align + 1);
            std::cout << col.records[i].getStringValue();
       }
       std::cout << "|" << std::endl;
    }
    std::cout << border << std::endl;
}

// Column
Column::Column(std::string title)
    : max_align(title.size()), name(title)
{}

// Used for printing the db all pretty
void Column::update_max_align() {
    max_align = name.size();
    for (auto &r : records) {
        max_align = std::max(
            max_align,
            r.getStringValue().size()
        );
    }
}

// Record
Record::Record(std::string data) : sdata(data), type('s') {
    char *end = NULL;
    double val = strtod(this->sdata.c_str(), &end);
    if (end != this->sdata.c_str() && *end == '\0' && val != HUGE_VAL) {
        this->type = 'f';
        this->fdata = val;
    } else if (data == "true" || data == "false") {
        this->type = 'b';
        this->bval = data == "true";
    }
}

Record::Record(double data) : sdata(""), fdata(data), type('f') {
}

Record::Record(bool val) : sdata(""), bval(val), type('b') {
}

// TODO: Where do we handle type errors?
// Do we even handle type errors or do
// some gross JS-like type coercion?
double Record::getDoubleValue() {
    if (type == 'f') return fdata;
    return 0;
}

void Record::setDoubleValue(double val) {
    type = 'f';
    fdata = val;
}

std::string Record::getStringValue() {
    if (type == 's') return sdata;
    if (type == 'b') return bval ? "true" : "false";
    // Convert the double to a string
    return std::format("{}", fdata);
}

void Record::setStringValue(std::string val) {
    type = 's';
    sdata = val;
}

bool Record::getBooleanValue() {
    if (type == 's') return sdata == "";
    if (type == 'f') return fdata != 0.0;
    return bval;
}

void Record::setBooleanValue(bool val) {
    type = 'b';
    bval = val;
}
