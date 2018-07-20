/**
 *     Text diff library ported from Python's difflib module. 
 *     Taken from: https://github.com/qiao/difflib.js
*/

var floor = Math.floor, max = Math.max, min = Math.min;

var _calculateRatio = function (matches, length) {
    if (length) {
        return 2.0 * matches / length;
    } else {
        return 1.0;
    }
};

var _arrayCmp = function (a, b) {
    var i, la, lb, _i, _ref, _ref1;
    _ref = [a.length, b.length], la = _ref[0], lb = _ref[1];
    for (i = _i = 0, _ref1 = min(la, lb); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        if (a[i] < b[i]) {
            return -1;
        }
        if (a[i] > b[i]) {
            return 1;
        }
    }
    return la - lb;
};

var _has = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

var _any = function (items) {
    var item, _i, _len;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (item) {
            return true;
        }
    }
    return false;
};

var SequenceMatcher = (function () {

    /*
      SequenceMatcher is a flexible class for comparing pairs of sequences of
      any type, so long as the sequence elements are hashable.  The basic
      algorithm predates, and is a little fancier than, an algorithm
      published in the late 1980's by Ratcliff and Obershelp under the
      hyperbolic name "gestalt pattern matching".  The basic idea is to find
      the longest contiguous matching subsequence that contains no "junk"
      elements (R-O doesn't address junk).  The same idea is then applied
      recursively to the pieces of the sequences to the left and to the right
      of the matching subsequence.  This does not yield minimal edit
      sequences, but does tend to yield matches that "look right" to people.
    
      SequenceMatcher tries to compute a "human-friendly diff" between two
      sequences.  Unlike e.g. UNIX(tm) diff, the fundamental notion is the
      longest *contiguous* & junk-free matching subsequence.  That's what
      catches peoples' eyes.  The Windows(tm) windiff has another interesting
      notion, pairing up elements that appear uniquely in each sequence.
      That, and the method here, appear to yield more intuitive difference
      reports than does diff.  This method appears to be the least vulnerable
      to synching up on blocks of "junk lines", though (like blank lines in
      ordinary text files, or maybe "<P>" lines in HTML files).  That may be
      because this is the only method of the 3 that has a *concept* of
      "junk" <wink>.
    
      Example, comparing two strings, and considering blanks to be "junk":
    
      >>> isjunk = (c) -> c is ' '
      >>> s = new SequenceMatcher(isjunk,
                                  'private Thread currentThread;',
                                  'private volatile Thread currentThread;')
    
      .ratio() returns a float in [0, 1], measuring the "similarity" of the
      sequences.  As a rule of thumb, a .ratio() value over 0.6 means the
      sequences are close matches:
    
      >>> s.ratio().toPrecision(3)
      '0.866'
    
      If you're only interested in where the sequences match,
      .getMatchingBlocks() is handy:
    
      >>> for [a, b, size] in s.getMatchingBlocks()
      ...   console.log("a[#{a}] and b[#{b}] match for #{size} elements");
      a[0] and b[0] match for 8 elements
      a[8] and b[17] match for 21 elements
      a[29] and b[38] match for 0 elements
    
      Note that the last tuple returned by .get_matching_blocks() is always a
      dummy, (len(a), len(b), 0), and this is the only case in which the last
      tuple element (number of elements matched) is 0.
    
      If you want to know how to change the first sequence into the second,
      use .get_opcodes():
    
      >>> for [op, a1, a2, b1, b2] in s.getOpcodes()
      ...   console.log "#{op} a[#{a1}:#{a2}] b[#{b1}:#{b2}]"
      equal a[0:8] b[0:8]
      insert a[8:8] b[8:17]
      equal a[8:29] b[17:38]
    
      See the Differ class for a fancy human-friendly file differencer, which
      uses SequenceMatcher both to compare sequences of lines, and to compare
      sequences of characters within similar (near-matching) lines.
    
      See also function getCloseMatches() in this module, which shows how
      simple code building on SequenceMatcher can be used to do useful work.
    
      Timing:  Basic R-O is cubic time worst case and quadratic time expected
      case.  SequenceMatcher is quadratic time for the worst case and has
      expected-case behavior dependent in a complicated way on how many
      elements the sequences have in common; best case time is linear.
    
      Methods:
    
      constructor(isjunk=null, a='', b='')
          Construct a SequenceMatcher.
    
      setSeqs(a, b)
          Set the two sequences to be compared.
    
      setSeq1(a)
          Set the first sequence to be compared.
    
      setSeq2(b)
          Set the second sequence to be compared.
    
      findLongestMatch(alo, ahi, blo, bhi)
          Find longest matching block in a[alo:ahi] and b[blo:bhi].
    
      getMatchingBlocks()
          Return list of triples describing matching subsequences.
    
      getOpcodes()
          Return list of 5-tuples describing how to turn a into b.
    
      ratio()
          Return a measure of the sequences' similarity (float in [0,1]).
    
      quickRatio()
          Return an upper bound on .ratio() relatively quickly.
    
      realQuickRatio()
          Return an upper bound on ratio() very quickly.
    */


    function SequenceMatcher(isjunk, a, b, autojunk) {
        this.isjunk = isjunk;
        if (a == null) {
            a = '';
        }
        if (b == null) {
            b = '';
        }
        this.autojunk = autojunk != null ? autojunk : true;
        /*
            Construct a SequenceMatcher.
        
            Optional arg isjunk is null (the default), or a one-argument
            function that takes a sequence element and returns true iff the
            element is junk.  Null is equivalent to passing "(x) -> 0", i.e.
            no elements are considered to be junk.  For example, pass
                (x) -> x in ' \t'
            if you're comparing lines as sequences of characters, and don't
            want to synch up on blanks or hard tabs.
        
            Optional arg a is the first of two sequences to be compared.  By
            default, an empty string.  The elements of a must be hashable.  See
            also .setSeqs() and .setSeq1().
        
            Optional arg b is the second of two sequences to be compared.  By
            default, an empty string.  The elements of b must be hashable. See
            also .setSeqs() and .setSeq2().
        
            Optional arg autojunk should be set to false to disable the
            "automatic junk heuristic" that treats popular elements as junk
            (see module documentation for more information).
        */

        this.a = this.b = null;
        this.setSeqs(a, b);
    }

    SequenceMatcher.prototype.setSeqs = function (a, b) {
        /* 
        Set the two sequences to be compared. 
        
        >>> s = new SequenceMatcher()
        >>> s.setSeqs('abcd', 'bcde')
        >>> s.ratio()
        0.75
        */
        this.setSeq1(a);
        return this.setSeq2(b);
    };

    SequenceMatcher.prototype.setSeq1 = function (a) {
        /* 
        Set the first sequence to be compared. 
        
        The second sequence to be compared is not changed.
        
        >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
        >>> s.ratio()
        0.75
        >>> s.setSeq1('bcde')
        >>> s.ratio()
        1.0
        
        SequenceMatcher computes and caches detailed information about the
        second sequence, so if you want to compare one sequence S against
        many sequences, use .setSeq2(S) once and call .setSeq1(x)
        repeatedly for each of the other sequences.
        
        See also setSeqs() and setSeq2().
        */
        if (a === this.a) {
            return;
        }
        this.a = a;
        return this.matchingBlocks = this.opcodes = null;
    };

    SequenceMatcher.prototype.setSeq2 = function (b) {
        /*
            Set the second sequence to be compared. 
        
            The first sequence to be compared is not changed.
        
            >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
            >>> s.ratio()
            0.75
            >>> s.setSeq2('abcd')
            >>> s.ratio()
            1.0
        
            SequenceMatcher computes and caches detailed information about the
            second sequence, so if you want to compare one sequence S against
            many sequences, use .setSeq2(S) once and call .setSeq1(x)
            repeatedly for each of the other sequences.
        
            See also setSeqs() and setSeq1().
        */
        if (b === this.b) {
            return;
        }
        this.b = b;
        this.matchingBlocks = this.opcodes = null;
        this.fullbcount = null;
        return this._chainB();
    };

    SequenceMatcher.prototype._chainB = function () {
        var b, b2j, elt, i, idxs, indices, isjunk, junk, n, ntest, popular, _i, _j, _len, _len1, _ref;
        b = this.b;
        this.b2j = b2j = {};
        for (i = _i = 0, _len = b.length; _i < _len; i = ++_i) {
            elt = b[i];
            indices = _has(b2j, elt) ? b2j[elt] : b2j[elt] = [];
            indices.push(i);
        }
        junk = {};
        isjunk = this.isjunk;
        if (isjunk) {
            _ref = Object.keys(b2j);
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                elt = _ref[_j];
                if (isjunk(elt)) {
                    junk[elt] = true;
                    delete b2j[elt];
                }
            }
        }
        popular = {};
        n = b.length;
        if (this.autojunk && n >= 200) {
            ntest = floor(n / 100) + 1;
            for (elt in b2j) {
                idxs = b2j[elt];
                if (idxs.length > ntest) {
                    popular[elt] = true;
                    delete b2j[elt];
                }
            }
        }
        this.isbjunk = function (b) {
            return _has(junk, b);
        };
        return this.isbpopular = function (b) {
            return _has(popular, b);
        };
    };

    SequenceMatcher.prototype.findLongestMatch = function (alo, ahi, blo, bhi) {
        /* 
        Find longest matching block in a[alo...ahi] and b[blo...bhi].  
        
        If isjunk is not defined:
        
        Return [i,j,k] such that a[i...i+k] is equal to b[j...j+k], where
            alo <= i <= i+k <= ahi
            blo <= j <= j+k <= bhi
        and for all [i',j',k'] meeting those conditions,
            k >= k'
            i <= i'
            and if i == i', j <= j'
        
        In other words, of all maximal matching blocks, return one that
        starts earliest in a, and of all those maximal matching blocks that
        start earliest in a, return the one that starts earliest in b.
        
        >>> isjunk = (x) -> x is ' '
        >>> s = new SequenceMatcher(isjunk, ' abcd', 'abcd abcd')
        >>> s.findLongestMatch(0, 5, 0, 9)
        [1, 0, 4]
        
        >>> s = new SequenceMatcher(null, 'ab', 'c')
        >>> s.findLongestMatch(0, 2, 0, 1)
        [0, 0, 0]
        */

        var a, b, b2j, besti, bestj, bestsize, i, isbjunk, j, j2len, k, newj2len, _i, _j, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        _ref = [this.a, this.b, this.b2j, this.isbjunk], a = _ref[0], b = _ref[1], b2j = _ref[2], isbjunk = _ref[3];
        _ref1 = [alo, blo, 0], besti = _ref1[0], bestj = _ref1[1], bestsize = _ref1[2];
        j2len = {};
        for (i = _i = alo; alo <= ahi ? _i < ahi : _i > ahi; i = alo <= ahi ? ++_i : --_i) {
            newj2len = {};
            _ref2 = (_has(b2j, a[i]) ? b2j[a[i]] : []);
            for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
                j = _ref2[_j];
                if (j < blo) {
                    continue;
                }
                if (j >= bhi) {
                    break;
                }
                k = newj2len[j] = (j2len[j - 1] || 0) + 1;
                if (k > bestsize) {
                    _ref3 = [i - k + 1, j - k + 1, k], besti = _ref3[0], bestj = _ref3[1], bestsize = _ref3[2];
                }
            }
            j2len = newj2len;
        }
        while (besti > alo && bestj > blo && !isbjunk(b[bestj - 1]) && a[besti - 1] === b[bestj - 1]) {
            _ref4 = [besti - 1, bestj - 1, bestsize + 1], besti = _ref4[0], bestj = _ref4[1], bestsize = _ref4[2];
        }
        while (besti + bestsize < ahi && bestj + bestsize < bhi && !isbjunk(b[bestj + bestsize]) && a[besti + bestsize] === b[bestj + bestsize]) {
            bestsize++;
        }
        while (besti > alo && bestj > blo && isbjunk(b[bestj - 1]) && a[besti - 1] === b[bestj - 1]) {
            _ref5 = [besti - 1, bestj - 1, bestsize + 1], besti = _ref5[0], bestj = _ref5[1], bestsize = _ref5[2];
        }
        while (besti + bestsize < ahi && bestj + bestsize < bhi && isbjunk(b[bestj + bestsize]) && a[besti + bestsize] === b[bestj + bestsize]) {
            bestsize++;
        }
        return [besti, bestj, bestsize];
    };

    SequenceMatcher.prototype.getMatchingBlocks = function () {
        /*
            Return list of triples describing matching subsequences.
        
            Each triple is of the form [i, j, n], and means that
            a[i...i+n] == b[j...j+n].  The triples are monotonically increasing in
            i and in j.  it's also guaranteed that if
            [i, j, n] and [i', j', n'] are adjacent triples in the list, and
            the second is not the last triple in the list, then i+n != i' or
            j+n != j'.  IOW, adjacent triples never describe adjacent equal
            blocks.
        
            The last triple is a dummy, [a.length, b.length, 0], and is the only
            triple with n==0.
        
            >>> s = new SequenceMatcher(null, 'abxcd', 'abcd')
            >>> s.getMatchingBlocks()
            [[0, 0, 2], [3, 2, 2], [5, 4, 0]]
        */

        var ahi, alo, bhi, blo, i, i1, i2, j, j1, j2, k, k1, k2, la, lb, matchingBlocks, nonAdjacent, queue, x, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
        if (this.matchingBlocks) {
            return this.matchingBlocks;
        }
        _ref = [this.a.length, this.b.length], la = _ref[0], lb = _ref[1];
        queue = [[0, la, 0, lb]];
        matchingBlocks = [];
        while (queue.length) {
            _ref1 = queue.pop(), alo = _ref1[0], ahi = _ref1[1], blo = _ref1[2], bhi = _ref1[3];
            _ref2 = x = this.findLongestMatch(alo, ahi, blo, bhi), i = _ref2[0], j = _ref2[1], k = _ref2[2];
            if (k) {
                matchingBlocks.push(x);
                if (alo < i && blo < j) {
                    queue.push([alo, i, blo, j]);
                }
                if (i + k < ahi && j + k < bhi) {
                    queue.push([i + k, ahi, j + k, bhi]);
                }
            }
        }
        matchingBlocks.sort(_arrayCmp);
        i1 = j1 = k1 = 0;
        nonAdjacent = [];
        for (_i = 0, _len = matchingBlocks.length; _i < _len; _i++) {
            _ref3 = matchingBlocks[_i], i2 = _ref3[0], j2 = _ref3[1], k2 = _ref3[2];
            if (i1 + k1 === i2 && j1 + k1 === j2) {
                k1 += k2;
            } else {
                if (k1) {
                    nonAdjacent.push([i1, j1, k1]);
                }
                _ref4 = [i2, j2, k2], i1 = _ref4[0], j1 = _ref4[1], k1 = _ref4[2];
            }
        }
        if (k1) {
            nonAdjacent.push([i1, j1, k1]);
        }
        nonAdjacent.push([la, lb, 0]);
        return this.matchingBlocks = nonAdjacent;
    };

    SequenceMatcher.prototype.getOpcodes = function () {
        /* 
        Return list of 5-tuples describing how to turn a into b.
        
        Each tuple is of the form [tag, i1, i2, j1, j2].  The first tuple
        has i1 == j1 == 0, and remaining tuples have i1 == the i2 from the
        tuple preceding it, and likewise for j1 == the previous j2.
        
        The tags are strings, with these meanings:
        
        'replace':  a[i1...i2] should be replaced by b[j1...j2]
        'delete':   a[i1...i2] should be deleted.
                    Note that j1==j2 in this case.
        'insert':   b[j1...j2] should be inserted at a[i1...i1].
                    Note that i1==i2 in this case.
        'equal':    a[i1...i2] == b[j1...j2]
        
        >>> s = new SequenceMatcher(null, 'qabxcd', 'abycdf')
        >>> s.getOpcodes()
        [ [ 'delete'  , 0 , 1 , 0 , 0 ] ,
          [ 'equal'   , 1 , 3 , 0 , 2 ] ,
          [ 'replace' , 3 , 4 , 2 , 3 ] ,
          [ 'equal'   , 4 , 6 , 3 , 5 ] ,
          [ 'insert'  , 6 , 6 , 5 , 6 ] ]
        */

        var ai, answer, bj, i, j, size, tag, _i, _len, _ref, _ref1, _ref2;
        if (this.opcodes) {
            return this.opcodes;
        }
        i = j = 0;
        this.opcodes = answer = [];
        _ref = this.getMatchingBlocks();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            _ref1 = _ref[_i], ai = _ref1[0], bj = _ref1[1], size = _ref1[2];
            tag = '';
            if (i < ai && j < bj) {
                tag = 'replace';
            } else if (i < ai) {
                tag = 'delete';
            } else if (j < bj) {
                tag = 'insert';
            }
            if (tag) {
                answer.push([tag, i, ai, j, bj]);
            }
            _ref2 = [ai + size, bj + size], i = _ref2[0], j = _ref2[1];
            if (size) {
                answer.push(['equal', ai, i, bj, j]);
            }
        }
        return answer;
    };

    SequenceMatcher.prototype.getGroupedOpcodes = function (n) {
        var codes, group, groups, i1, i2, j1, j2, nn, tag, _i, _len, _ref, _ref1, _ref2, _ref3;
        if (n == null) {
            n = 3;
        }
        /* 
        Isolate change clusters by eliminating ranges with no changes.
        
        Return a list groups with upto n lines of context.
        Each group is in the same format as returned by get_opcodes().
        
        >>> a = [1...40].map(String)
        >>> b = a.slice()
        >>> b[8...8] = 'i'
        >>> b[20] += 'x'
        >>> b[23...28] = []
        >>> b[30] += 'y'
        >>> s = new SequenceMatcher(null, a, b)
        >>> s.getGroupedOpcodes()
        [ [ [ 'equal'  , 5 , 8  , 5 , 8 ],
            [ 'insert' , 8 , 8  , 8 , 9 ],
            [ 'equal'  , 8 , 11 , 9 , 12 ] ],
          [ [ 'equal'   , 16 , 19 , 17 , 20 ],
            [ 'replace' , 19 , 20 , 20 , 21 ],
            [ 'equal'   , 20 , 22 , 21 , 23 ],
            [ 'delete'  , 22 , 27 , 23 , 23 ],
            [ 'equal'   , 27 , 30 , 23 , 26 ] ],
          [ [ 'equal'   , 31 , 34 , 27 , 30 ],
            [ 'replace' , 34 , 35 , 30 , 31 ],
            [ 'equal'   , 35 , 38 , 31 , 34 ] ] ]
        */

        codes = this.getOpcodes();
        if (!codes.length) {
            codes = [['equal', 0, 1, 0, 1]];
        }
        if (codes[0][0] === 'equal') {
            _ref = codes[0], tag = _ref[0], i1 = _ref[1], i2 = _ref[2], j1 = _ref[3], j2 = _ref[4];
            codes[0] = [tag, max(i1, i2 - n), i2, max(j1, j2 - n), j2];
        }
        if (codes[codes.length - 1][0] === 'equal') {
            _ref1 = codes[codes.length - 1], tag = _ref1[0], i1 = _ref1[1], i2 = _ref1[2], j1 = _ref1[3], j2 = _ref1[4];
            codes[codes.length - 1] = [tag, i1, min(i2, i1 + n), j1, min(j2, j1 + n)];
        }
        nn = n + n;
        groups = [];
        group = [];
        for (_i = 0, _len = codes.length; _i < _len; _i++) {
            _ref2 = codes[_i], tag = _ref2[0], i1 = _ref2[1], i2 = _ref2[2], j1 = _ref2[3], j2 = _ref2[4];
            if (tag === 'equal' && i2 - i1 > nn) {
                group.push([tag, i1, min(i2, i1 + n), j1, min(j2, j1 + n)]);
                groups.push(group);
                group = [];
                _ref3 = [max(i1, i2 - n), max(j1, j2 - n)], i1 = _ref3[0], j1 = _ref3[1];
            }
            group.push([tag, i1, i2, j1, j2]);
        }
        if (group.length && !(group.length === 1 && group[0][0] === 'equal')) {
            groups.push(group);
        }
        return groups;
    };

    SequenceMatcher.prototype.ratio = function () {
        /*
            Return a measure of the sequences' similarity (float in [0,1]).
        
            Where T is the total number of elements in both sequences, and
            M is the number of matches, this is 2.0*M / T.
            Note that this is 1 if the sequences are identical, and 0 if
            they have nothing in common.
        
            .ratio() is expensive to compute if you haven't already computed
            .getMatchingBlocks() or .getOpcodes(), in which case you may
            want to try .quickRatio() or .realQuickRatio() first to get an
            upper bound.
            
            >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
            >>> s.ratio()
            0.75
            >>> s.quickRatio()
            0.75
            >>> s.realQuickRatio()
            1.0
        */

        var match, matches, _i, _len, _ref;
        matches = 0;
        _ref = this.getMatchingBlocks();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            match = _ref[_i];
            matches += match[2];
        }
        return _calculateRatio(matches, this.a.length + this.b.length);
    };

    SequenceMatcher.prototype.quickRatio = function () {
        /*
            Return an upper bound on ratio() relatively quickly.
        
            This isn't defined beyond that it is an upper bound on .ratio(), and
            is faster to compute.
        */

        var avail, elt, fullbcount, matches, numb, _i, _j, _len, _len1, _ref, _ref1;
        if (!this.fullbcount) {
            this.fullbcount = fullbcount = {};
            _ref = this.b;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                elt = _ref[_i];
                fullbcount[elt] = (fullbcount[elt] || 0) + 1;
            }
        }
        fullbcount = this.fullbcount;
        avail = {};
        matches = 0;
        _ref1 = this.a;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            elt = _ref1[_j];
            if (_has(avail, elt)) {
                numb = avail[elt];
            } else {
                numb = fullbcount[elt] || 0;
            }
            avail[elt] = numb - 1;
            if (numb > 0) {
                matches++;
            }
        }
        return _calculateRatio(matches, this.a.length + this.b.length);
    };

    SequenceMatcher.prototype.realQuickRatio = function () {
        /*
            Return an upper bound on ratio() very quickly.
        
            This isn't defined beyond that it is an upper bound on .ratio(), and
            is faster to compute than either .ratio() or .quickRatio().
        */

        var la, lb, _ref;
        _ref = [this.a.length, this.b.length], la = _ref[0], lb = _ref[1];
        return _calculateRatio(min(la, lb), la + lb);
    };

    return SequenceMatcher;

})();

module.exports = SequenceMatcher;
