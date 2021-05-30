const express = require('express');
const huntRoutes = require('./src/routes/huntRoutes');
const userRoutes = require('./src/routes/userRoutes');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const app = express();
const PORT= process.env.PORT || 4000;


global.__basedir = __dirname;
//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

//bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

huntRoutes(app);
userRoutes(app);

app.get('/',(req,res)=>{
    res.send(`Node Express server running on port ${PORT}`)
})


app.listen(PORT,()=>{
    console.log('your server is running on the port '+PORT);
})