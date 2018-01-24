# wx-charts
微信小程序图表工具，charts for WeChat small app

基于canvas绘制，体积小巧


# 支持图表类型
- 饼图   `pie`
- 圆环图 `ring`
- 线图   `line`
- 柱状图 `column`
- 区域图 `area`
- 雷达图 `radar`

代码分析 [Here](https://segmentfault.com/a/1190000007649376)

# 如何使用
1、直接引用编译好的文件 `dist/wxcharts.js` 或者 `dist/wxcharts-min.js`

2、自行编译

```
git clone 
npm install rollup -g
npm install
rollup -c 或者 rollup --config rollup.config.prod.js
```

# 测试 
1. iPhone 6s, IOS 9.3.5
2. 小米4, ANDORID 6.0.1

