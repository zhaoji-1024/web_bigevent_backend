const express = require('express')
const router = express.Router()
const express_joi = require('@escook/express-joi')

// 挂载路由
const userinfo_handler = require('../router_handler/userinfo')

// 获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.get_userinfo)

// 导入需要的验证规则对象
const { update_userinfo_schema } = require('../schema/user')
    // 更新用户信息的路由
router.post('/userinfo', express_joi(update_userinfo_schema), userinfo_handler.update_userinfo)

// 导入需要的验证规则对象
const { update_password_schema } = require('../schema/user')
    // 更新用户密码的路由
router.post('/updatepwd', express_joi(update_password_schema), userinfo_handler.update_password)

// 导入需要的验证规则对象
const { update_avatar_schema } = require('../schema/user')
    // 更新用户头像的路由
router.post('/update/avatar', express_joi(update_avatar_schema), userinfo_handler.update_avatar)

module.exports = router