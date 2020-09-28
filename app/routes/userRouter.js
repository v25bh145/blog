var express = require('express');
/**
 * 访问者路由
 */
var userRouter = express.Router();
var {search, get} = require("../controllers/archiveController");


userRouter.get("/search", search);
userRouter.get("/get/:id", get);
module.exports = userRouter;