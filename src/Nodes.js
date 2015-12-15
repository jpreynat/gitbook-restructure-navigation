var cheerio = require('cheerio');

var Nodes = function () {
};

Nodes.prototype.stripNumbering = function (html) {
    var $ = cheerio.load(html);
    var nav = $('ul.summary').first();
    nav.find('a i + b').remove();
    return $.html();
};
Nodes.prototype.addNumbering = function (html) {
    var $ = cheerio.load(html);
    var nav = $('ul.summary').first();
    nav.find('li').each(function (index, listItem) {
        if (index > 0) {
            $(listItem).find('i').first().after('<b>' + index + '.</b>');
        }
        $(listItem).data('level', index);
    });
    return $.html();
};

module.exports = Nodes;