"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

//Set list of words to the input

var Appro = exports.Appro = (function () {
    function Appro(list, n) {
        _classCallCheck(this, Appro);

        this.list = list;
        this.n = n;
        this.dict = NGramDict(this.list);
        console.log(this.dict);
    }

    _createClass(Appro, {
        fit: {
            value: function fit(word) {
                var result = [];
                var ngrams = splitWord(word, this.n);
                var used = {};
                for (var ng = 0; ng < ngrams.length; ng++) {
                    var words = this.dict.get(ngrams[ng]);
                    words.forEach(function (word) {
                        if (result.indexOf(word) == -1) {
                            result.push(word);
                        }
                    });
                }
                return result;
            }
        }
    });

    return Appro;
})();

;

var NGramDict = function NGramDict(listofwords) {
    var len = arguments[1] === undefined ? 3 : arguments[1];

    var map = new Map();
    listofwords.forEach(function (word) {
        for (var i = 0; i < word.length - len + 1; ++i) {
            var item = word.substring(i, i + len);
            if (!map.has(item)) {
                map.set(item, [word]);
            } else {
                var data = map.get(item);
                map.set(item, data.concat(word));
            }
        }
    });

    return map;
};

//Levenshtein distance
var distance = function distance(s1, s2) {
    var length1 = s1.length;
    var length2 = s2.length;
    var result = {};
    for (var i = 0; i < length1; ++i) {
        for (var j = 0; j < length2; ++j) {
            if (i == 0 && j == 0) {
                result[[i, j]] = 0;
                continue;
            }

            if (i > 0 && j == 0) {
                result[[i, j]] = i;
                continue;
            }

            if (j > 0 && i == 0) {
                result[[i, j]] = j;
                continue;
            }
            var cost = 0;
            if (s1[i] != s2[j]) {
                cost = 1;
            }
            result[[i, j]] = Math.min(result[[i, j - 1]] + 1, result[[i - 1, j]] + 1, result[[i - 1, j - 1]] + cost);
        }
    }
    return result[[length1, length2]];
};

var mapToSortedList = function mapToSortedList(map) {
    var newitems = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = map.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2);

            var key = _step$value[0];
            var value = _step$value[1];

            newitems.push([key, value]);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return newitems.sort(function (x, y) {
        if (map.get(x[0]).length < map.get(y[0]).length) {
            return 1;
        }
        if (map.get(x[0]).length > map.get(y[0]).length) {
            return -1;
        } else {
            return 0;
        }
    });
};

//Split word to the n grams
var splitWord = function splitWord(word, n) {
    var result = [];
    for (var i = 0; i < word.length - n + 1; ++i) {
        result.push(word.substring(i, i + n));
    }
    return result;
};