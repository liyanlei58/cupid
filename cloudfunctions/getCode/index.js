// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  var scene = event.scene
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: scene
    })
    console.log("result: ", result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}