/**
 * 模块依赖
 */
let fs = require('fs');
//markdown渲染
let hljs = require('highlight.js');
let mkdIt = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) { }
        }

        return ''; // use external default escaping
    }
});
mkdIt.use(require('markdown-it-toc-asd'));

exports.getFileRendered = function (src, cb) {
    fs.readFile(src, function (err, data) {
        if(err) cb(1, data);
        let result = mkdIt.render(data.toString());
        cb(0, result);
    });
};