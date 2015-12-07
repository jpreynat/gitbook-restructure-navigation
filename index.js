var cheerio = require('cheerio');
var fs = require('fs');
var pages = [];
var processNavigation = false;
var validTransformations = [];

var processPage = function (html) {
    var $ = cheerio.load(html);
    var nav = $('ul.summary').first();
    // remove navigation numbers, we'll recreate them later
    nav.find('a i + b').remove();
    validTransformations.forEach(function (trafo, index) {
        var items = nav.find('li');
        var left = items[trafo.from];
        var right = items[trafo.to];
        switchContent($(left), $(right));
    });

    nav.find('li').each(function (index, listItem) {
        if (index > 0) {
            $(listItem).find('i').first().after('<b>' + index + '.</b>');
        }
        $(listItem).data('level', index);
    });
    return $.html();
};

var switchContent = function (left, right) {
    var leftHtml = left.html();
    var leftPath = left.data('path');
    var leftClasses = left.attr('class');

    left.html(right.html());
    // left.data('path', right.data('path')) doesn't work
    left.attr('data-path', right.data('path'));
    left.attr('class', right.attr('class'));

    right.html(leftHtml);
    right.attr('data-path', leftPath);
    right.attr('class', leftClasses);
};

module.exports = {
    hooks: {
        // after html generation, rewrite the pages
        "finish": function (context) {
            var config = this.options.pluginsConfig["gitbook-restructure-navigation"];
            if (typeof config == 'object' && typeof config.transformations == 'object') {
                config.transformations.forEach(function (transformation, index) {
                    if (typeof transformation.from == 'number'
                        && 0 <= transformation.from < pages.length
                        && typeof transformation.to == 'number'
                        && 0 <= transformation.to < pages.length
                        && transformation.from != transformation.to
                    ) {
                        validTransformations.push({
                            'from': transformation.from, 'to': transformation.to
                        });
                    }
                });
            }
            var book = this;
            var output = book.context.config.output;
            pages.forEach(function (pagePath) {
                var fullPath = output + '/' + pagePath;
                var data = fs.readFileSync(fullPath).toString();
                var newData = processPage(data)
                if (newData != data) {
                    book.log.info('Re-writing navigation of file: ', pagePath, '\n')
                    fs.writeFileSync(fullPath, newData);
                }
            });
        },
        // Before html generation, collect the pages
        "page:before": function (page) {

            if (this.options.generator == 'website') {
                var book = this;
                var pagePath = book.contentPath(page.path);
                pages.push(pagePath);
            }

            return page;
        }
    }
};