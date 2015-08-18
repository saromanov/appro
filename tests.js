var assert = require('assert');
var appro = require('./lib/appro');

var items = ['time', 'just', 'know', 'back', 'move', 'day', 'work', 'give', 'word', 'last', 'past', 'noise', 'check', 'good', 'look'];

describe('test results based on ngrams', function(){
    var model = new appro.Appro(items);
    it('should return "good"', function(){
        assert.deepEqual(model.ngrams('mood'), ['good']);
    });

    it('should return empty list', function(){
        assert.deepEqual(model.ngrams('change'), []);
    });

    it('bgrams. it should return two words', function(){
        assert.deepEqual(model.ngrams('world',n=2), ['work', 'word']);
    });
});

describe('test results based on ngrams with text as dict', function() {
    var model = new appro.Appro(items, text='time waits for no one.');
    it('should return "waits"', function() {
        assert.deepEqual(model.ngrams('waitz', n=2), ['waits']);
    });
});


describe('test results based on Levenshtein distance', function(){
    var model = new appro.Appro(items);
    it('should return correct word', function(){
        assert.deepEqual(model.fuzzy('bock'), ['back', 'work', 'look']);
    });
});
