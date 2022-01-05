const joi = require('joi')

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}

// 定义昵称，id和邮箱的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 定义验证更新用户信息的表单数据的规则对象
exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email
    }
}

// 定义修改密码的表单数据的规则对象
exports.update_password_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

// 定义用户头像的验证规则
const avatar = joi.string().dataUri().required()

// 定义更新用户头像的规则对象
exports.update_avatar_schema = {
    body: {
        avatar
    }
}