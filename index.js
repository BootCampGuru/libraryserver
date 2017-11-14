var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var watsonJS = require('./routes/watson');
var auth = require('./Auth');
var fs = require('fs');
var mysql = require('mysql');
var http = require('http');
var request = require('request');
var xmlReader = require('read-xml');
var xml2js = require('xml2js');


var PORT = process.env.PORT || 3000;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "sagat99",
  database: "wordwar_db"
});


//Call the API dictionary

function GetDictionary(word)
{

var url = "https://www.dictionaryapi.com/";


request('https://www.dictionaryapi.com/' + 'api/v1/references/collegiate/xml/' + word + '?key=5e6c4135-dc50-4f6e-b1c7-43d48ae443cd', function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var parseString = require('xml2js').parseString;
      //var xml = "<root>Hello xml2js!</root>"
      parseString(body, function (err, result) {
         console.log(result.entry_list.entry);
});

     
       // console.log(body) // Print the google web page.
     }
})

}


//read from the file
//insert into the database

function createProduct(word) {

  var query = connection.query(
    "INSERT INTO words SET ?",
    {
      word: word
      
    },
    function(err, res) {      
     
        if(err)
        {
          console.log("error");
        }
        else
        {

        GetDictionary(word);
        }

    }
  );
}


fs.readFile("dictionary/words.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
  if (error) {
    return console.log(error);
  }


   var collection = [];
   var dataArr = data.split(",");

   console.log(dataArr.length);

   
createProduct(dataArr[0]);

   for (var i = 0; i < dataArr.length; i++) {


    createProduct(dataArr[i]);
       // createProduct(dataArr[i]);


    
    }

     
});






app.use('/', watsonJS);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
var err = new Error('Not Found');
err.status = 404;
next(err);
});

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page
res.status(err.status || 500);
res.render('error');
});

app.listen(PORT, function() {
console.log("Listening on port:%s", PORT);
});

module.exports = app;
