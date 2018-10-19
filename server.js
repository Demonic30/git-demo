var express = require('express');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://qczukjeduvghfj:49481b3ac8202f5c86c019f58e76bc22d2697ea6dcc4119eff455d5f00382fbe@ec2-54-243-147-162.compute-1.amazonaws.com:5432/dcdqtmras1p2b8?ssl=true');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/about', function (req, res) {
    var name = 'Coffaree Hahza';
    var hobbies = ['Music', 'Movie', 'Programming'];
    var bdate = '19/05/1997';
    res.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });
});

// Display all product
app.get('/product', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/products', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

app.get('/product/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id=" + pid;
    db.any(sql)
        .then(function (data) {
            res.render('pages/product_edit', { products: data[0] })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

app.get('/user/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

app.get('/user', function (req, res) {
    db.any('select * from users', )
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
// Update data
app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update pproduct set title = $(title), price = $(price) where id = (id)`;
    // db.none
    console.log('UPDATE:' + sql);
    res.redirect('/product');
});

app.post('/product/insert', function (req, res){
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id,title,price) VALUES  ('${id}','${title}','${price}')`;
    db.query(sql)
        .then(function (data) {
            response.redirect('/products')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});

app.get('/insert', function (req, res) {
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    response.render('pages/insert', { time: time});
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});