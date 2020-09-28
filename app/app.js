/**
 * requires
 */
//TODO: 针对post方法的全局中间件body参数检查
let express = require("express"),
  userRouter = require("./routes/userRouter"),
  adminRouter = require("./routes/adminRouter"),
  myltipartyMiddleware = require("connect-multiparty")(),
  logger = require('morgan');

//启动服务
let app = express();

//指定模板引擎
app.set("view engine", "ejs");

//指定视图文件所在的路径
app.set("views", __dirname + "/../views/");

//视图文件选项
app.set("view options", { layout: false });

app.use(express.static("../public"));

app.use(myltipartyMiddleware);

app.use(logger('dev'));

/**
 * 路由
 */
app.get('/', function(req, res) {
  res.redirect('/archives/get/1')
});
app.get('/index', function(req, res) {
  res.redirect('/archives/get/1')
});
app.get('/home', function(req, res) {
  res.redirect('/archives/get/1')
});
app.use("/archives", userRouter);
app.use("/admin", adminRouter);

//监听端口
app.listen(8000);
