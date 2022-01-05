// 导入数据库操作模块
const db = require('../db/index')

// 导入密码解析模块
const bcryptjs = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.get_userinfo = (req, res) => {
    // 定期sql
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id = ?'
        // 执行sql
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql失败
        if (err) return res.cc(err)
            // 执行sql成功但查询结果为空
        if (results.length !== 1) return res.cc('获取用户信息失败')
            // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
}

// 更新用户基本信息的处理函数
exports.update_userinfo = (req, res) => {
    // 定义sql
    const sql = 'update ev_users set ? where id = ?'
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('修改用户信息失败')
        return res.cc('修改用户信息成功', 0)
    })
}

// 更新用户密码的处理函数
exports.update_password = (req, res) => {
    // 定义查询用户id的sql
    const sql = 'select * from ev_users where id = ?'
        // 执行sql查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {

        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在')
            // 判断提交的密码是否正确
        const compare_result = bcryptjs.compareSync(req.body.oldPwd, results[0].password)
        if (!compare_result) return res.cc('原密码错误')
            // 验证通过，对新密码进行加密后更新到数据库中
            // 定义更新用户密码的sql
        const sql = 'update ev_users set password = ? where id = ?'
        const new_pwd = bcryptjs.hashSync(req.body.newPwd, 10)
            // 执行sql
        db.query(sql, [new_pwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败')
            res.cc('更新密码成功', 0)
        })
    })
}

// 更新用户头像的处理函数
exports.update_avatar = (req, res) => {
    // 定义更新用户头像的sql
    const sql = 'update ev_users set user_pic = ? where id = ?'
        // 执行sql
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败')
        return res.cc('更新头像成功', 0)
    })
}