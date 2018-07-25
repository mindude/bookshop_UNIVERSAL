var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// APIs
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bookshop');

var db = mongoose.connection;
db.on('error', console.error.bind(console, '# MongoDB - Connection Error: '));
// --->>> SET UP SESSIONS <<<----
app.use(session({
  secret: 'mySecretString',
  saveUninitialized: false,
  resave: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 2},
  store: new MongoStore({mongooseConnection: db, ttl: 2 * 24 * 60 * 60})
  //ttl: 2 days * 24 hours * 60 minutes * 60 seconds
}));

// SAVE TO SESSIONS
app.post('/cart', function(req, res){
  var cart = req.body;
  req.session.cart = cart;
  req.session.save(function(err){
    if(err){
      throw err;
    }
    res.json(req.session.cart);
  })
});

// GET SESSION CART API
app.get('/cart', function(req, res){
  if(typeof req.session.cart !== 'undefined'){
    res.json(req.session.cart);
  }
});


// --->>> END SESSION SET UP <<<----


var Books = require('./models/books.js');

// POST BOOKS
app.post('/books', function(req, res){
  var book = req.body;

  Books.create(book, function(err, books){
    if(err){
      throw err;
    }
    res.json(books);
  })
});

// GET BOOKS
app.get('/books', function(req, res){
  Books.find(function(err, books){
    if(err){
      throw err;
    }
    res.json(books);
  })
})

// DELETE BOOKS
app.delete('/books/:_id', function(req, res){
  var query = {_id: req.params._id};

  Books.remove(query, function(err, books){
    if(err){
      console.log('# API DELETE BOOKS: ', err);
    }
    res.json(books);
  })
});

// UPDATE BOOKS
app.put('/books/:_id', function(req, res){
  var book = req.body;
  var query = {_id: req.params._id};

  var update = {
    '$set':{
      title: book.title,
      description: book.description,
      image: book.image,
      price: book.price
    }
  };

  var options = {new: true};

  Books.findOneAndUpdate(query, update, options, function(err, books){
    if(err){
      throw err;
    }
    res.json(books)
  })


})

// --->>> GET BOOKS IMAGES API <<<---
app.get('/images', function(req, res){
  const imgFolder = __dirname + '/public/images/';
// REQUIRE FILE SYSTEM
  const fs = require('fs');
  // READ ALL FILES IN THE DIRECTORY
  fs.readdir(imgFolder, function(err, files){
    if(err){
      return console.error(err);
    }

    // CREATE AN EMPTY ARRAY
    const filesArr = [];

    // ITERATE ALL IMAGES IN THE DIRECTORY AND ADD TO THE ARRAY
    files.forEach(function(file){
      filesArr.push({name: file});
    });
    // SEBD THE JSON RESPONSE WITH THE ARRAY
    res.json(filesArr);
  })
})


// END APIs

app.listen(3001, function(err){
  if (err){
    return console.log(err);
  }
  console.log('API Server is listening on http://localhost:3001');
})
