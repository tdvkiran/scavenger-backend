const express = require('express');
const routes = require('./src/routes/huntRoutes');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const app = express();
const PORT= 4000;

global.__basedir = __dirname;
//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://kiran:kiran@cluster0.slmx9.mongodb.net/scavenger',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

//bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

routes(app);

app.get('/',(req,res)=>{
    res.send(`Node Express server running on port ${PORT}`)
    //res.sendStatus
})


app.listen(PORT,()=>{
    console.log('your server is running on the port '+PORT);
})