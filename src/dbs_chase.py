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


def print_chase(original_relation, canonical, changed_rows={}, functional_dependency=({}, {}), indent_width = 3):
    max_length = 0
    for row in canonical:
        for elem in sorted(row):
            if len(elem) > max_length:
                max_length = len(elem)
    width = math.log(len(canonical), 10) + max_length + 4
    print(f"{indent_width * ' '}", end='')
    for elem in original_relation:
        print(f'{elem:{width}}', end='')
    print()
    row_counter = 0
    for row in canonical:
        if row_counter in changed_rows:
            print(f"{TextColor.YELLOW}>{(indent_width-1) * ' '}{TextColor.RESET}", end='')
        else: 
            print(f"{indent_width * ' '}", end='')
        
        for elem in sorted(row):
            letter_color = get_elem_color(elem, row_counter, changed_rows, functional_dependency)
            if row[elem] is not None:
                value = f'{elem}{row[elem]}'
            else:
                value = f'{elem}'
            print(f'{letter_color}{value:{width}}{TextColor.RESET}', end='')
        print()
        row_counter += 1


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


def equalize(canonical, row_idx1, row_idx2, attributes):
    for attribute in attributes:
        attribute_lower = attribute.lower()
        if canonical[row_idx1][attribute_lower] is not None and canonical[row_idx2][attribute_lower] is None:
            canonical[row_idx1][attribute_lower] = None
        elif canonical[row_idx1][attribute_lower] is None and canonical[row_idx2][attribute_lower] is not None:
            canonical[row_idx2][attribute_lower] = None
        elif canonical[row_idx1][attribute_lower] is not None and canonical[row_idx2][attribute_lower] is not None:
            canonical[row_idx2][attribute_lower] = canonical[row_idx1][attribute_lower]
        else:
            print(f'Row {row_idx1} and {row_idx2} both already have no subscripts in attribute {attribute_lower}')


def chase(original_relation, canonical, fds):
    print("Starting chase table:")
    print_chase(original_relation, canonical)
    print()
    while True:
        old_canonical = copy.deepcopy(canonical)
        for fd in fds:
            print(f'Using functional dependency: {format_fd(fd)}')
            lhs = fd[0]
            rhs = fd[1]
            pairs = find_pairs_with_equal_lhs(canonical, lhs)
            if len(pairs) > 0:
                for pair in pairs:
                    print(f'Changing rows {pair[0]} and {pair[1]}:')
                    equalize(canonical, pair[0], pair[1], rhs)
                    print_chase(original_relation, canonical, {pair[0], pair[1]}, fd)
                    print()
                    if chase_test(canonical):
                        return
            else:
                print('Cannot apply this functional dependency.')
        if canonical == old_canonical:
            return


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


def full_chase(original_relation, decomposed_relations, fds):
    canonical = create_canonical(original_relation, decomposed_relations)
    validate(original_relation, decomposed_relations, fds)
    chase(original_relation, canonical, fds)
    if chase_test(canonical):

        message = 'Lossless'
    else:
        message = 'Lossy'
    return message, canonical

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    ex_original_relation = ('A', 'B', 'C', 'D', 'E', 'F')
    ex_decomposed_relations = {'R1': ('A', 'B', 'C', 'F'), 'R2': ('A', 'D', 'E'), 'R3': ('B', 'D', 'F')}
    ex_fds = (({'B'}, {'E'}), ({'E', 'F'}, {'C'}), ({'B', 'C'}, {'A'}), ({'A', 'D'}, {'E'}))

    message, canonical = full_chase(ex_original_relation, ex_decomposed_relations, ex_fds)
    
        
    # Example usage
    print(TextColor.RED + "This text is highlighted in red!" + TextColor.RESET)
    print(TextColor.GREEN + "This text is highlighted in green!" + TextColor.RESET)
    print(TextColor.YELLOW + "This text is highlighted in yellow!" + TextColor.RESET)

