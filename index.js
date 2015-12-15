var fs = require('fs');
var pages = [];

var transformations = new (require('./src/Transformations'))();
var nodes = new (require('./src/Nodes'))();


module.exports = {
    hooks: {
        // after html generation, rewrite the pages
        "finish": function (context) {
            var config = this.options.pluginsConfig["gitbook-restructure-navigation"];
            transformations.registerTransformations(config);
            var book = this;
            var output = book.context.config.output;
            pages.forEach(function (pagePath) {
                var fullPath = output + '/' + pagePath;
                var data = fs.readFileSync(fullPath).toString();

                var newData = nodes.addNumbering(
                    transformations.applyTransformations(
                        nodes.stripNumbering(data), 'ul.summary > li'));
                
                if (newData != data) {
                    book.log.info('Re-writing navigation of file: ', pagePath, '\n');
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