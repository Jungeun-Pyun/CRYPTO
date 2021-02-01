var express = require('express');
var router = express.Router();
const db = require('../components/db')
const model = require('../models/user')
const crypto = require('../components/crypto')

/* GET users listing. */
router.post('/signup', async function(req, res, next) {
  const body = req.body
  // console.log('body : ', body)
  try {
      const connection = await db.beginTransaction() //await이 있으면 무조건 async 들어가야함

      //user id duplicate check
      const usersResult = await model.getList(connection,{user_id:body.user_id})
      if(usersResult.length > 0){
        throw {status: 409, errorMessage:"Duplicate user id"}
      }

      const {salt, encodedPw} = crypto.createPasswordPbkdf2(body.user_pwd)
      console.log('salt length : ', salt.length)
      console.log('encodedPw length : ', encodedPw.length)
      body.salt = salt
      body.user_pwd = encodedPw
      
      const result = await model.insert(connection, body)
      await db.commit(connection)
      res.status(200).json({result})
  } catch (err){
    console.log('err : ',err)
      next(err) // 에러가 있더라도 다른 명령어를 호출해야 함
  }
})
  // res.json({body})

router.post('/signin', async (req, res, next) => {
  console.log('signin')
  const body = req.body
  console.log('body : ', body)
  try{
    const connection = await db.getConnection() //await이 있으면 무조건 async 들어가야함

    const result = await model.getList(connection,{user_id:body.user_id})
    if(result.length == 0){
      throw{status: 404, errorMessage: 'User not found'}
    }
    let newResult = result[0]
    console.log('result[0] : ', result[0])

    const encodedPw = crypto.getPasswordPbkdf2(body.user_pwd, newResult.salt)

    if (newResult.user_pwd === encodedPw){
      console.log('Autehntication succeed')
    } else {
      throw{status : 401, errorMessage : 'Authentication failed'}
    }

    delete newResult.user_pwd
    delete newResult.salt
    res.status(200).json({result:newResult}) //결과를 똑같이 result로 내보내고 싶으면 newResult를 result에 담아줌
  }catch(err){
    console.log('err : ', err)
    next(err)
  }
})

module.exports = router;
