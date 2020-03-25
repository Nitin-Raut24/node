
var express=require('express');
var mongoose=require('mongoose');
var bodyparser=require('body-parser');
var cors=require('cors');
var request=require('request');
var dotenv=require('dotenv')
dotenv.config();

// logging code start
const log4js = require('log4js');
log4js.configure({
  appenders: { crud: { type: 'file', filename: 'crud.log' } },
  categories: { default: { appenders: ['crud'], level: ['ALL'] } }
});
const logger = log4js.getLogger('crud');
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Comté.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');
logger.info('nitin logger');
// logger code end

app=express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());


mongoose.connect('mongodb://localhost/mydb',{useNewUrlParser:true,useUnifiedTopology:true});
console.log('db connected');

var personSchema=mongoose.Schema({name:String,age:String});
var Person=mongoose.model('Persons',personSchema,'Persons');

// find all document
app.get('/',function(req,res){
    Person.find(function(err,response){
    if(err) throw err;
        res.json(response);
    });
    
});

// find document by path variable
app.get('/:id',function(req,res){
    Person.find({age:req.params.id},function(err,response){
        if(err) throw err;
        res.json(response);

    });
});


// find by id
app.get('/p/:id',function(req,res,next){
    Person.findById(req.params.id,function(err,response){
        if(err) {
			//var erro = new Error("Something went wrong");
			next(err);
			}
		else{	
        res.json(response);
		}
    });
});

// insert document
app.post('/',function(req,res){
	console.log(req.body.name);
    var obj=new Person({name:req.body.name,age:req.body.age});
    obj.save(function(err,response){
        if(err) throw err;
		
        res.json({msg:'successfully inserted document'});
    });
});

//update document
app.put('/',function(req,res){
	Person.update({name:req.body.name},{age:req.body.age},function(err,response){
		if(err) throw err;
		res.json("updated successfully");
	});
});

// delete document
app.delete('/:id',function(req,res){
	Person.deleteOne({age:req.params.id},function(err,response){
		if(err){ res.json({msg:'error in deletion:'+err});}
		else{
			res.json({msg:'document deleted successfully'});
		}
		});
});

app.get('/test',function(req,res){
    console.log('inside test api');
    logger.info('inside test api');	
	res.json('hello test');
});
/*
// consume rest api GET
var jsonurl='https://jsonplaceholder.typicode.com/todos/1';
var xmlurl='https://gorest.co.in/public-api/users/131';
request.get(jsonurl,function(err,response,body){
	if(err) throw err;
	console.log(body);
}); */

/* consume post api
Request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://httpbin.org/post",
    "body": JSON.stringify({
        "firstname": "Nic",
        "lastname": "Raboy"
    })
}, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
});*/


// code to error handling
app.use(function(err,req,res,next){
	//res.status(500).json(err);
	res.json({"status":500,"message":err.message});
    console.log("inside middleware");
    console.log(process.env.key);// code to read dotenv file values
});

app.listen(8081);
