const express = require('express');
const app = express();
// CORS模块，处理web端跨域问题
const cors = require('cors');
app.use(cors());

var url = require('url');//url模块,对url格式的字符串进行解析，返回一个对象。根据不同的url进行处理，返回不同的数据。

//body-parser 解析表单
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//使用mysql中间件连接MySQL数据库
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',           //数据库地址
    user: 'root',               //用户名
    password: 'dongyu123',           //密码
    port: '3306',              //端口
    database: 'Clinic',           //库名
    multipleStatements: true     //允许执行多条语句
});
connection.connect();


// 查询多个lga
app.get('/query', (req, res, next) => {
    console.log(req.url);//这里可以打印出请求的url看一下
    var parseObj = url.parse(req.url, true);//对url进行解析 将第二个参数设置为true会将query属性生成为一个对象
    console.log(parseObj);//这里包含了很多信息有兴趣可以看一下 了解一下
    var queryObj = parseObj.query;//只获取参数的对象
    console.log(queryObj.lga)
    var tempdate = queryObj.date.split('>')

    //注意空格
    const sql = "SELECT * FROM totalclinic where totalclinic.notification_date between \""+ tempdate[0] + "\" and \"" + tempdate[1] + "\" and (" + queryObj.lga + ")";
    console.log('app', sql);
    connection.query(sql, (err, results) => {
        res.json({
            code: 200,
            data: results,
            affextedRows: results.affextedRows
        })
    })
});

//groupbydate
app.get('/querydate', (req, res, next) => {
    console.log(req.url);//这里可以打印出请求的url看一下
    var parseObj = url.parse(req.url, true);//对url进行解析 将第二个参数设置为true会将query属性生成为一个对象
    console.log(parseObj);//这里包含了很多信息有兴趣可以看一下 了解一下
    var queryObj = parseObj.query;//只获取参数的对象
    console.log(queryObj.lga) //lga with brace
    var tempdate = queryObj.date.split('>')
    const sql = "SELECT notification_date as FilterDate, SUM(confirmed_count) as Cases, SUM(test_count) as TestCases, convert(SUM(confirmed_count)/SUM(test_count),decimal(15,10)) as Rate FROM totalclinic where totalclinic.notification_date between \""+ tempdate[0] + "\" and \"" + tempdate[1] + "\"" + queryObj.lga + "group by notification_date";


    //注意空格
    console.log('app', sql);
    connection.query(sql, (err, results) => {
        res.json({
            code: 201,
            data: results,
            affextedRows: results.affextedRows
        })
    })
});

//groupbydate
app.get('/querysumcases', (req, res, next) => {
    console.log(req.url);//这里可以打印出请求的url看一下
    var parseObj = url.parse(req.url, true);//对url进行解析 将第二个参数设置为true会将query属性生成为一个对象
    console.log(parseObj);//这里包含了很多信息有兴趣可以看一下 了解一下
    var queryObj = parseObj.query;//只获取参数的对象
    console.log(queryObj.lga) //lga with brace
    var tempdate = queryObj.date.split('>')
    const sql = "SELECT notification_date as FilterDate,lga_name19, lga_code19,SQRT(SUM(lgacount)) as count, Sum(daycount)/SQRT(SUM(lgacount)) as daycount, SUM(confirmed_count) as Cases, SUM(test_count) as TestCases, convert(SUM(confirmed_count)/SUM(test_count),decimal(15,10)) as Rate FROM totalclinic where totalclinic.notification_date between \""+ tempdate[0] + "\" and \"" + tempdate[1] + "\"" + queryObj.lga + "group by notification_date, lga_name19, lga_code19";


    //注意空格
    console.log('app', sql);
    connection.query(sql, (err, results) => {
        res.json({
            code: 202,
            data: results,
            affextedRows: results.affextedRows
        })
    })
});

app.get('/querycases', (req, res, next) => {
    console.log(req.url);//这里可以打印出请求的url看一下
    var parseObj = url.parse(req.url, true);//对url进行解析 将第二个参数设置为true会将query属性生成为一个对象
    console.log(parseObj);//这里包含了很多信息有兴趣可以看一下 了解一下
    var queryObj = parseObj.query;//只获取参数的对象
    console.log(queryObj.lga) //lga with brace
    var tempdate = queryObj.date.split('>')
    const sql = "SELECT totalclinic.*,DATE_FORMAT(notification_date,\"%Y-%m-%d\"), cliniccount, uniqueID, title, lga_code19, personskm2, event_level, whichday, referralRequired, ageLimit, realhourspast3days, breakhourspast3days, weekHours, bookingRequired, walkinAllowed, driveThroughTesting, wheelchairAccessible, uniqueID, title,lga_code19, lgacount as count, daycount as daycount, confirmed_count as Cases, test_count as TestCases, convert(confirmed_count/test_count,decimal(15,10)) as Rate FROM totalclinic where totalclinic.notification_date between \""+ tempdate[0] + "\" and \"" + tempdate[1] + "\"" + queryObj.lga ;


    //注意空格
    console.log('app', sql);
    connection.query(sql, (err, results) => {
        res.json({
            code: 203,
            data: results,
            affextedRows: results.affextedRows
        })
    })
});

app.get('/queryforheatmap', (req, res, next) => {
    console.log(req.url);//这里可以打印出请求的url看一下
    var parseObj = url.parse(req.url, true);//对url进行解析 将第二个参数设置为true会将query属性生成为一个对象
    console.log(parseObj);//这里包含了很多信息有兴趣可以看一下 了解一下
    var queryObj = parseObj.query;//只获取参数的对象
    console.log(queryObj.lga) //lga with brace
    var tempdate = queryObj.date
    const sql = "SELECT notification_date, Season, cliniccount, uniqueID, title, lga_code19, Longitude, Latitude, personskm2, event_level, whichday, referralRequired, ageLimit, realhourspast3days, breakhourspast3days, weekHours, bookingRequired, walkinAllowed, driveThroughTesting, wheelchairAccessible, uniqueID, title,lga_code19, lgacount as count, daycount as daycount, confirmed_count as Cases, test_count as TestCases, convert(confirmed_count/test_count,decimal(15,10)) as Rate FROM totalclinic where totalclinic.notification_date = \""+ tempdate + "\"" + queryObj.lga ;

    console.log('app', sql);
    connection.query(sql, (err, results) => {
        res.json({
            code: 204,
            data: results,
            affextedRows: results.affextedRows
        })
    })
});


//启动服务，端口为3001
app.listen(3001, () => {
    console.log('服务启动成功:' + `http://localhost:3001/`)
})