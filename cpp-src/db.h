#pragma once

#include <iostream>
#include <fstream>
#include <vector>
#include <string>

class Record {
public:
    std::string sdata = "";
    union {
        double fdata = 0.0;
        bool bval;
    };
    char type = 's';

    Record(std::string data);
    Record(double data);
    Record(bool val);

    std::string getStringValue() const;
    double getDoubleValue() const;
    bool getBooleanValue() const;

    void setStringValue(std::string val) { *this = Record(val); }
    void setDoubleValue(double      val) { *this = Record(val); }
    void setBooleanValue(bool       val) { *this = Record(val); }

    bool operator==(const Record &other) const;
};

class Column {
public:
    size_t max_align = 2;
    std::string name;
    std::vector<Record> records = {};

    Column(std::string title);

    void update_max_align();
};

class Table {
public:
    std::string name;
    std::vector<Column> columns = {};

    void addCol(std::string name);
    void addRow(std::vector<Record> rowvals);

    std::string addFromCSV(std::istream *stream);
    std::string addFromCSVString(const std::string &str);
    void print();

    Table(const std::string &name) : name(name) {}
};
