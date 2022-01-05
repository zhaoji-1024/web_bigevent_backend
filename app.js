const express = require('express')

const app = express()

const joi = require('joi')

// 导入并配置cors中间件
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件 只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 一定在路由之前封装res.cc函数
app.use((req, res, next) => {
    res.cc = function(err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 一定要在路由之前配置解析token的中间件
const express_jwt = require('express-jwt')
const config = require('./config')
app.use(express_jwt({ secret: config.jwtSecretKey }).unless({ path: /^\/api/ }))

// 导入并使用用户路由模块
const user_router = require('./router/user')
app.use('/api', user_router)

// 导入并使用用户信息的路由模块
const userinfo_router = require('./router/userinfo')
app.use('/my', userinfo_router)

// 导入并使用文章分类的路由模块
const art_cate_router = require('./router/art_cate')
app.use('/my/article', art_cate_router)

// 导入并使用文章路由模块
const articleRouter = require('./router/article')
    // 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
        // 未知错误
    res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
    console.log('api server running at http:127.0.0.1:3007');
})