/**
 * requires
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs');

var app = express();

//指定模板引擎
app.set('view engine', 'ejs');

//指定视图文件所在的路径
app.set('views', __dirname + '/../views');

//视图文件选项
app.set('view options', { layout: false });

app.use(express.static('../public'));

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

app.get('/index', function (req, res, next) {
    fs.readFile('../public/markdowns/aboutMe.md', function (err, data) {
        let result = mkdIt.render(data.toString());
        res.render('index', {
            archive: result,
            title: "WELCOME TO MY BLOG",
            subtitle: "————v25bh145",
            archiveId: 1,
            pushList: [
                {
                    id: 1,
                    title: "让我来试试标题能有多长"
                },
                {
                    id: 2,
                    title: "让我来试试标题能有多长让我来试试标题能有多长"
                },
                {
                    id: 3,
                    title: "让我来试试标题能有多长让我来试试标题能有多长让我来试试标题能有多长"
                }
            ]
        });
        next();
    })
})

app.listen(3000);