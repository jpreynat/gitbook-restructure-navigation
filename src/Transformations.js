var cheerio = require('cheerio');

var Transformations = function () {
    this.validTransformations = [];
};

Transformations.prototype.applyTransformations = function (dom, selector) {
    var $ = cheerio.load(dom);

    var results = $(selector);
    this.validTransformations.forEach(function (trafo, index) {
        var left = $(results[trafo.from]);
        var right = $(results[trafo.to]);
        left.before($.html(right));
        right.before($.html(left));
        left.remove();
        right.remove();
    });
    return $.html();
};
Transformations.prototype.registerTransformations = function (config, numberOfPages) {
    var that = this;
    if (typeof config == 'object' && typeof config.transformations == 'object') {
        config.transformations.forEach(function (transformation, index) {
            if (typeof transformation.from == 'number' &&
                0 <= transformation.from &&
                transformation.from < numberOfPages &&
                typeof transformation.to == 'number' &&
                0 <= transformation.to &&
                transformation.to < numberOfPages &&
                transformation.from != transformation.to
            ) {
                var from = transformation.from;
                var to = transformation.to;
                if (from > to) {
                    var tmp = to;
                    to = from;
                    from = tmp;
                }
                that.validTransformations.push({
                    'from': from, 'to': to
                });
            }
        });
    }

};

module.exports = Transformations;