import math
import re
import copy


# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.


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


def print_chase(original_relation, canonical):
    max_length = 0
    for row in canonical:
        for elem in sorted(row):
            if len(elem) > max_length:
                max_length = len(elem)
    width = math.log(len(canonical), 10) + max_length + 4
    for elem in original_relation:
        print(f'{elem:{width}}', end='')
    print()
    for row in canonical:
        for elem in sorted(row):
            if row[elem] is not None:
                value = f'{elem}{row[elem]}'
            else:
                value = f'{elem}'
            print(f'{value:{width}}', end='')
        print()


def format_fd(fd):
    formatted = ''
    counter = 0
    for attribute in fd[0]:
        formatted += f'{attribute}'
        if counter != len(fd[0]) - 1:
            formatted += ', '
        counter += 1
    formatted += ' -> '
    counter = 0
    for attribute in fd[1]:
        formatted += f'{attribute}'
        if counter != len(fd[1]) - 1:
            formatted += ', '
        counter += 1
    return formatted


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
    print_chase(original_relation, canonical)
    while True:
        old_canonical = copy.deepcopy(canonical)
        for fd in fds:
            print(f'Using functional dependency {format_fd(fd)}')
            lhs = fd[0]
            rhs = fd[1]
            pairs = find_pairs_with_equal_lhs(canonical, lhs)
            if len(pairs) > 0:
                for pair in pairs:
                    print(f'Changing rows {pair[0]} and {pair[1]}')
                    equalize(canonical, pair[0], pair[1], rhs)
                    print_chase(original_relation, canonical)
                    print()
                    if chase_test(canonical):
                        return
            else:
                print('Cannot apply this functional dependency')
        if canonical == old_canonical:
            return


def chase_test(canonical):
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
    pass

