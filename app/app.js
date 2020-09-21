/**
 * requires
 */
let express = require('express'),
    bodyParser = require('body-parser'),
    archive = require('./routes/archive');

//启动服务
let app = express();

//指定模板引擎
app.set('view engine', 'ejs');

//指定视图文件所在的路径
app.set('views', __dirname + '/../views/');

//视图文件选项
app.set('view options', { layout: false });

app.use(express.static('../public'));

app.use(bodyParser.urlencoded({extended: false}));

/**
 * 路由
 */
app.get('/index', archive.index);
// app.get('/archives/get/:id', archives.archivesGet)
app.get('/search', archive.search);
app.get('/get/:id', archive.get);

//监听端口
app.listen(3000);