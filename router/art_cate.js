const express = require('express')
const router = express.Router()

// 导入验证数据的中间件
const express_joi = require('@escook/express-joi')

// 导入文章分类的路由处理函数模块
const artcate_handler = require('../router_handler/art_cate')

// 获取文章分类的路由
router.get('/cate', artcate_handler.get_article_cates)

// 导入需要的验证模块
const { add_cate_schema } = require('../schema/art_cate')
    // 新增文章分类的路由
router.post('/addcates', express_joi(add_cate_schema), artcate_handler.add_article_cates)

// 导入需要的id规则对象
const { delete_cate_schema } = require('../schema/art_cate')
    //删除文章分类的路由
router.get('/deletecate/:id', express_joi(delete_cate_schema), artcate_handler.delete_cate_by_id)

// 导入根据 Id 获取分类的验证规则对象
const { get_cate_schema } = require('../schema/art_cate')
    // 根据id获取文章分类数据路由
router.get('/cates/:id', express_joi(get_cate_schema), artcate_handler.getArticleById)

// 导入更新文章分类的验证规则对象
const { update_cate_schema } = require('../schema/art_cate')
    // 更新文章分类的路由
router.post('/updatecate', express_joi(update_cate_schema), artcate_handler.updateCateById)

module.exports = router