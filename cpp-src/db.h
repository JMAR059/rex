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

    double getDoubleValue();
    void setDoubleValue(double val);
    std::string getStringValue();
    void setStringValue(std::string val);
    bool getBooleanValue();
    void setBooleanValue(bool val);

    bool operator==(Record &other) {
        if (type == 'f' && other.type == 'f')
            return getDoubleValue() == other.getDoubleValue();
        if (type == 'b' && other.type == 'b')
            return getBooleanValue() == other.getBooleanValue();
        if (type == 's' || other.type == 's')
            return getStringValue() == other.getStringValue();
        return false;
    }
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

    void addFromCSV(std::istream &stream);

    void print();

    Table(const std::string &name) : name(name) {}
};
