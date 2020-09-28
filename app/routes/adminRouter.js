let express = require('express');

/**
 * 管理者路由
 */
let adminRouter = express.Router();
let {login, post, deletion, createSeries, deleteSeries} = require("../controllers/adminController");
let authenticate = require("../middlewares/authenticate");

//中间件
adminRouter.use('/', authenticate);
adminRouter.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
    })
    req.method === 'OPTIONS' ? res.status(204).end() : next()
});

adminRouter.post('/login', login);
adminRouter.post('/post', post);
adminRouter.post('/deletion', deletion);
adminRouter.post('/createSeries', createSeries);
adminRouter.post('/deleteSeries', deleteSeries);

module.exports = adminRouter;