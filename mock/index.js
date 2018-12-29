/**
 * mockjs使用：
 *     1. 在mock文件夹下根据components的目录结构新建自己需要mock的接口的文件
 *     2. 在这里使用require引入
 *     3. 根据文档编写数据模板
 *
 * mockjs 文档：https://github.com/nuysoft/Mock/wiki
 * mockjs 示例：http://mockjs.com/examples.html
 */
const Mock = require("mockjs");
// 模拟返回延迟
Mock.setup({
  timeout: "100-300"
});
require("./chat-api-mock");