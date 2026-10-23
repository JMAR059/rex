import unittest
from dbs_chase import *


class MyTestCase(unittest.TestCase):
    def test_loseless(self):
        ex_original_relation = ('A', 'B', 'C', 'D', 'E', 'F', 'G')
        ex_decomposed_relations = {'R1': ('A', 'B', 'C', 'D', 'E'), 'R2': ('C', 'D', 'F'), 'R3': ('A', 'B', 'D', 'G'),
                                   'R4': ('A', 'F')}
        ex_fds = (({'A', 'B'}, {'C'}), ({'C', 'D'}, {'E', 'F'}), ({'F'}, {'A'}))

        message, canonical = full_chase(ex_original_relation, ex_decomposed_relations, ex_fds)
        expected = "Lossless"
        self.assertEqual(message, expected)

    def test_small_lossless_01(self):
        ex_original_relation = ('A', 'B', 'C', 'D', 'E', 'F')
        ex_decomposed_relations = {'R1': ('A', 'B', 'C', 'F'), 'R2': ('A', 'D', 'E'), 'R3': ('B', 'D', 'F')}
        ex_fds = (({'B'}, {'E'}), ({'E', 'F'}, {'C'}), ({'B', 'C'}, {'A'}), ({'A', 'D'}, {'E'}))

        message, canonical = full_chase(ex_original_relation, ex_decomposed_relations, ex_fds)
        expected = "Lossless"
        self.assertEqual(message, expected)

    def test_small_lossless_02(self):
        ex_original_relation = ('A', 'B', 'C', 'D', 'E', 'F', 'G')
        ex_decomposed_relations = {'R1': ('A', 'B', 'C'), 'R2': ('A', 'B', 'E'), 'R3': ('C', 'E', 'F', 'G'),
                                   'R4': ('A', 'B', 'C', 'D')}
        ex_fds = (({'A', 'C'}, {'E', 'F'}), ({'E', 'G'}, {'A'}), ({'B', 'F'}, {'C', 'D'}), ({'C', 'G'}, {'A'}),
                  ({'C', 'E'}, {'G'}), ({'E'}, {'A', 'B'}))

        message, canonical = full_chase(ex_original_relation, ex_decomposed_relations, ex_fds)
        expected = "Lossless"
        self.assertEqual(message, expected)

    def test_large_lossless_01(self):
        ex_original_relation = ('A', 'B', 'C', 'D', 'E', 'F', 'G')
        ex_decomposed_relations = {'R1': ('B', 'F', 'G'), 'R2': ('A', 'C', 'D', 'F'), 'R3': ('B', 'D', 'E', 'F'),
                                   'R4': ('A', 'B', 'E', 'G')}
        ex_fds = (({'A', 'C'}, {'B', 'F'}), ({'A', 'D', 'F'}, {'G'}), ({'B'}, {'E'}), ({'B', 'E'}, {'F', 'G'}),
                  ({'B', 'G'}, {'E'}), ({'A', 'G'}, {'B', 'F'}), ({'E', 'F'}, {'D'}))

        message, canonical = full_chase(ex_original_relation, ex_decomposed_relations, ex_fds)
        expected = "Lossless"
        self.assertEqual(message, expected)

    def test_small_lossy_01(self):
        ex_original_relation = ('RIN', 'NAME', 'EMAIL', 'MAJOR')
        ex_decomposed_relations = {'R1': ('RIN', 'NAME', 'EMAIL'), 'R2': ('NAME', 'MAJOR')}
        ex_fds = (({'RIN'}, {'NAME', 'EMAIL', 'MAJOR'}), )

        message, canonical = full_chase(ex_original_relation, ex_decomposed_relations, ex_fds)
        expected = "Lossy"
        self.assertEqual(message, expected)

    def test_large_lossy_01(self):
        ex_original_relation = ('A', 'B', 'C', 'D', 'E', 'F', 'G')
        ex_decomposed_relations = {'R1': ('B', 'F', 'G'), 'R2': ('A', 'C', 'D', 'F'), 'R3': ('B', 'D', 'E', 'F'),
                                   'R4': ('A', 'B', 'E', 'G')}
        ex_fds = (({'A', 'C'}, {'B', 'F'}), ({'A', 'D', 'G'}, {'F'}), ({'B'}, {'C'}), ({'B', 'E'}, {'F', 'G'}),
                  ({'B', 'G'}, {'E'}), ({'A', 'G'}, {'B', 'E'}), ({'E', 'F'}, {'D'}))

        message, canonical = full_chase(ex_original_relation, ex_decomposed_relations, ex_fds)
        expected = "Lossy"
        self.assertEqual(message, expected)

    def test_large_lossy_02(self):
        ex_original_relation = ('A', 'B', 'C', 'D', 'E', 'F', 'G')
        ex_decomposed_relations = {'R1': ('B', 'D', 'G'), 'R2': ('A', 'B', 'C', 'D', 'F'), 'R3': ('B', 'F'),
                                   'R4': ('B', 'C', 'E', 'G')}
        ex_fds = (({'A'}, {'B', 'G'}), ({'A', 'D'}, {'B', 'F'}), ({'B'}, {'C'}), ({'B', 'C'}, {'F', 'G'}),
                  ({'A', 'C', 'G'}, {'E'}), ({'A', 'B'}, {'C', 'E'}), ({'D', 'E'}, {'F', 'G'}))

        message, canonical = full_chase(ex_original_relation, ex_decomposed_relations, ex_fds)
        expected = "Lossy"
        self.assertEqual(message, expected)


if __name__ == '__main__':
    unittest.main()
