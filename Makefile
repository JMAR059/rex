CFLAGS = -std=c++20 -Wall -Wextra -pedantic
CPP = g++
LD_FLAGS =
LD = $(CPP)

CPP_IN_FILES = $(shell find cpp-src/ -type f -iname '*.cpp')
OBJS = $(CPP_IN_FILES:.cpp=.o)

all: build
build: $(OBJS)
	$(LD) $(OBJS) $(LD_FLAGS) -g -o cppdb
%.o: %.cpp
	$(CPP) $(CFLAGS) -c $< -g -o $@

clean:
	rm -f $(OBJS) cppdb