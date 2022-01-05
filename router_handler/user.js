// 导入数据库操作模块
const db = require('../db/index')
    // 导入bcryptjs
const bcryptjs = require('bcryptjs')
    // 导入生产token的包
const jwt = require('jsonwebtoken')
    // 导入全局配置文件
const config = require('../config')

// 注册用户的处理函数
exports.reg_user = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body

    // 定义sql语句查询用户名是否被占用
    const sql = 'select * from ev_users where username = ?'
    db.query(sql, userinfo.username, (err, results) => {
        // 执行sql失败
        if (err) return res.cc(err)
            // 判断用户名是否被占用
        if (results.length > 0) return res.cc('用户名已被占用，请更换其他用户名')
            // TODO：用户名可以使用
            // 对密码进行加密
        userinfo.password = bcryptjs.hashSync(userinfo.password, 10)
            // 定义插入新用户的sql
        const sql = 'insert into ev_users set ?'
            // 执行sql
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 判断sql是否执行成功
            if (err) return res.cc(err)
                // 判断影响行数是否为1
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍候再试')
                // 注册用户成功
            res.cc('注册成功', 0)
        })
    })
}

// 登录的处理函数
exports.login = (req, res) => {
    // 接受表单的数据
    const userinfo = req.body
        // 定义sql
    const sql = 'select * from ev_users where username = ?'
        // 执行sql
    db.query(sql, userinfo.username, (err, results) => {
        // z执行sql失败
        if (err) return res.cc(err)
            // 执行sql成功但查询到的数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败')
            // TODO:判断密码是否正确 
        const compare_result = bcryptjs.compareSync(userinfo.password, results[0].password)
        if (!compare_result) return res.cc('登录失败')
            // TODO 在服务器端生成token字符串
        const user = {...results[0], password: '', user_pic: '' }
        const token_str = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expires_in })
            // 将token响应给客户端
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + token_str
        })
    })


}