import math
import re
import copy
from typing import Tuple, Set

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

class TextColor:
    BLACK = '\033[30m'
    RED = '\033[31m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    MAGENTA = '\033[35m'
    CYAN = '\033[36m'
    WHITE = '\033[37m'
    RESET = '\033[0m'  # Reset to default color


def wrap_color(elem, color):
    return color + str(elem) + TextColor.RESET


def get_elem_color(elem: str, row_counter: int, changed_rows: {int}, functional_dependency: Tuple[Set[str], Set[str]]):

    lhs = functional_dependency[0]
    rhs = functional_dependency[1]
    elemCapitalized = elem.capitalize()
    # print(functional_dependency)
    # print(elemCapitalized)
    if row_counter not in changed_rows:
        return ""
    elif elemCapitalized not in lhs and elemCapitalized not in rhs:
        return ""#TextColor.YELLOW
    else:
        return TextColor.RED if elemCapitalized in lhs else TextColor.CYAN


def validate(original_relation, decomposed_relations, fds):
    attributes = set()
    for relation_name, relation in decomposed_relations.items():
        attributes.update(relation)
    if attributes != set(original_relation):
        raise ValueError('Sets of attributes before and after decomposition are not equal')
    for fd in fds:
        lhs = fd[0]
        rhs = fd[1]
        if (set(rhs) | set(lhs)) - set(original_relation) != set():
            raise ValueError('Functional dependencies contain attributes not present in the relation')


def create_canonical(original_relation, decomposed_relations):
    canonical = []
    for relation_name, relation in decomposed_relations.items():
        counter = int(re.search(r'(\d)*$', relation_name).group())
        row = {}
        for attribute in original_relation:
            row[attribute.lower()] = None
            if attribute not in relation:
                row[attribute.lower()] = counter
        canonical.append(row)
    return canonical


def chase_table_string(original_relation, canonical, changed_rows={}, functional_dependency=({}, {})):
    indent_width = 5
    max_length = 0
    for row in canonical:
        for elem in sorted(row):
            if len(elem) > max_length:
                max_length = len(elem)
    elem_width = math.log(len(canonical), 10) + max_length + 4
    line = f"{indent_width * ' '}"
    for elem in original_relation:
        line += f'{elem:{elem_width}}'
    line += '\n'
    line += '-' * (len(line)-1) + '\n'
    row_counter = 0
    for row in canonical:
        if row_counter in changed_rows:
            line += f"{TextColor.YELLOW}" 
        line += f"R{row_counter+1}{TextColor.RESET} |{(indent_width-4) * ' '}"
        
        for elem in sorted(row):
            letter_color = get_elem_color(elem, row_counter, changed_rows, functional_dependency)
            if row[elem] is not None:
                value = f'{elem}{row[elem]}'
            else:
                value = f'{elem.upper()}'
            line += f'{letter_color}{value:{elem_width}}{TextColor.RESET}'
        line += '\n'
        row_counter += 1
    return line


def format_fd(fd):
    formatted = TextColor.RED
    counter = 0
    for attribute in fd[0]:
        formatted += f'{attribute}'
        if counter != len(fd[0]) - 1:
            formatted += ', '
        counter += 1
    formatted += TextColor.RESET + ' -> ' + TextColor.CYAN
    counter = 0
    for attribute in fd[1]:
        formatted += f'{attribute}'
        if counter != len(fd[1]) - 1:
            formatted += ', '
        counter += 1
    return formatted + TextColor.RESET


def find_pairs_with_equal_lhs(canonical, lhs):
    pairs = []
    for idx1 in range(len(canonical)):
        for idx2 in range(idx1 + 1, len(canonical)):
            match = True
            for attribute in lhs:
                attribute_lower = attribute.lower()
                if canonical[idx1][attribute_lower] != canonical[idx2][attribute_lower]:
                    match = False
            if match:
                pairs.append((idx1, idx2))
    return pairs


def equalize(canonical, row_idx1, row_idx2, attributes, printing = False):
    for attribute in attributes:
        attribute_lower = attribute.lower()
        if canonical[row_idx1][attribute_lower] is not None and canonical[row_idx2][attribute_lower] is None:
            canonical[row_idx1][attribute_lower] = None
        elif canonical[row_idx1][attribute_lower] is None and canonical[row_idx2][attribute_lower] is not None:
            canonical[row_idx2][attribute_lower] = None
        elif canonical[row_idx1][attribute_lower] is not None and canonical[row_idx2][attribute_lower] is not None:
            canonical[row_idx2][attribute_lower] = canonical[row_idx1][attribute_lower]
        else:
            if printing:
                print(f'Row {row_idx1} and {row_idx2} both already have no subscripts in attribute {attribute_lower}')


def chase(original_relation, canonical, fds, printing = False):
    if printing:
        print("Starting chase table:")
        print(chase_table_string(original_relation, canonical), end='')
        print()
    while True:
        old_canonical = copy.deepcopy(canonical)
        for fd in fds:
            if printing:
                print(f'Using functional dependency: {format_fd(fd)}')
            lhs = fd[0]
            rhs = fd[1]
            pairs = find_pairs_with_equal_lhs(canonical, lhs)
            if len(pairs) > 0:
                for pair in pairs:
                    if printing:
                        print(f'Changing rows {wrap_color(pair[0]+1, TextColor.YELLOW)} and {wrap_color(pair[1]+1, TextColor.YELLOW)}:')
                    original_table_string = chase_table_string(original_relation, canonical, {pair[0], pair[1]}, fd)
                    equalize(canonical, pair[0], pair[1], rhs, printing)
                    changed_table_string = chase_table_string(original_relation, canonical, {pair[0], pair[1]}, fd)
                    original_lines = original_table_string.split(sep='\n')
                    changed_lines = changed_table_string.split(sep='\n')
                    for line_num in range(0, len(original_lines) - 1):
                        arrow_color = TextColor.YELLOW if (line_num-2) in {pair[0], pair[1]} else ""
                        gap = ' ' * 9 if line_num < 2 else f"{arrow_color} --->    {TextColor.RESET}"
                        if printing:
                            print(f"{original_lines[line_num]}{gap}{changed_lines[line_num]}")
                    if printing:
                        print()
                    
                    if chase_test(canonical):
                        return
            else:
                if printing:
                    print('Cannot apply this functional dependency.')
        if canonical == old_canonical:
            return


def row_test(row):
    row_test = True
    for subscript in row.values():
        if subscript is not None:
            row_test = False
    return row_test


def chase_test(canonical):
    row_counter = 0
    for row in canonical:
        row_test = True
        for subscript in row.values():
            if subscript is not None:
                row_test = False
        if row_test:
            return True
    return False


def full_chase(original_relation, decomposed_relations, fds, printing=False):
    canonical = create_canonical(original_relation, decomposed_relations)
    validate(original_relation, decomposed_relations, fds)
    chase(original_relation, canonical, fds, printing)
    if chase_test(canonical):

        message = 'Lossless'
    else:
        message = 'Lossy'
    return message, canonical

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    ex_original_relation = ('A', 'B', 'C', 'D', 'E', 'F', 'G')
    ex_decomposed_relations = {'R1': ('A', 'B', 'C', 'D', 'E'), 'R2': ('C', 'D', 'F'), 'R3': ('A', 'B', 'D', 'G'),
                                   'R4': ('A', 'F')}
    ex_fds = (({'A', 'B'}, {'C'}), ({'C', 'D'}, {'E', 'F'}), ({'F'}, {'A'}))

    message, canonical = full_chase(ex_original_relation, ex_decomposed_relations, ex_fds, printing=True)
    print(message)
        
    # # Example usage
    # print(TextColor.RED + "This text is highlighted in red!" + TextColor.RESET)
    # print(TextColor.GREEN + "This text is highlighted in green!" + TextColor.RESET)
    # print(TextColor.YELLOW + "This text is highlighted in yellow!" + TextColor.RESET)

