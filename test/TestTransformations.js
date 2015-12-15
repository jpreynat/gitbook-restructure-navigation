var assert = require('assert');
var cheerio = require('cheerio');
var transformations = require('../src/Transformations')

describe('Transformations', function () {
    describe('#registerTransformations()', function () {
        it('should register valid transformations', function () {
            var t = new transformations();
            t.registerTransformations({
                "transformations": [
                    {from: 0, to: 3},
                    {from: 22, to: 12}
                ]
            }, 38)
            assert.equal(t.validTransformations.length, 2)

            assert.equal(t.validTransformations[0].from, 0)
            assert.equal(t.validTransformations[0].to, 3)

            assert.equal(t.validTransformations[1].from, 12)
            assert.equal(t.validTransformations[1].to, 22)
        });
        it('should drop invalid transformations', function () {
            var t = new transformations();
            t.registerTransformations({
                "transformations": [
                    {from: 0, to: 3},
                    {from: 22, to: 12},
                    {from: "4", to: 5},
                    {from: -2, to: 1}
                ]
            }, 12)
            assert.equal(t.validTransformations.length, 1)

            assert.equal(t.validTransformations[0].from, 0)
            assert.equal(t.validTransformations[0].to, 3)

        });
    });
    describe("#applyTransformations", function () {
        it('should switch nodes correctly', function () {
            var t = new transformations();
            t.validTransformations.push({
                from: 0, to: 1
            });
            var html = t.applyTransformations('<ol><li class="abc">a</li><li data-foo="bar">b</li></ol>',
                                              'li');
            assert.equal(html, '<ol><li data-foo="bar">b</li><li class="abc">a</li></ol>');
        })
    })
});
