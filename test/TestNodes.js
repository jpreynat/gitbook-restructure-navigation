var assert = require('assert');
var cheerio = require('cheerio');
var nodes = require('../src/Nodes');
var n = new nodes();

var withNumbering = '<ul class="summary"><li class="chapter " data-level="0" data-path="TOC.html"><a href="../TOC.html"><i class="fa fa-check"></i> Table of Contents </a></li><li class="chapter " data-level="1" data-path="index.html"><a href="../index.html"><i class="fa fa-check"></i><b>1.</b> Introduction </a></li><li class="chapter " data-level="2" data-path="design-principles/DesignPrinciples.html"><a href="../design-principles/DesignPrinciples.html"><i class="fa fa-check"></i><b>2.</b> Design Principles </a></li></ul>';
var withoutNumbering = '<ul class="summary"><li class="chapter " data-level="0" data-path="TOC.html"><a href="../TOC.html"><i class="fa fa-check"></i> Table of Contents </a></li><li class="chapter " data-level="1" data-path="index.html"><a href="../index.html"><i class="fa fa-check"></i> Introduction </a></li><li class="chapter " data-level="2" data-path="design-principles/DesignPrinciples.html"><a href="../design-principles/DesignPrinciples.html"><i class="fa fa-check"></i> Design Principles </a></li></ul>';
describe('Nodes', function () {
    describe('#stripNumbering()', function () {
        it('should remove existing numbering', function () {
            assert.equal(n.stripNumbering(withNumbering), withoutNumbering);
        });
    })
    describe('#addNumbering()', function () {
        it('should add numbering', function () {
            assert.equal(n.addNumbering(withoutNumbering), withNumbering);
        });
    })

});
