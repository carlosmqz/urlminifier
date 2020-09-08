require('dotenv').config();
const express = require('express')
const { nanoid } = require('nanoid')
const cors = require('cors');
const morgan = require('morgan')
const helmet = require('helmet')
const dbConnection = require('./database/database')
const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json())


app.get('/',(req, res, next) =>{
    res.json({
        message: 'Home Page loaded'
    })
})

app.get('/url/:id', (req, res, next) =>{
    const shortUrlId = req.params.id;
    dbConnection.query("SELECT * FROM urlminifier WHERE shorturlid=?", [shortUrlId],
    (err, results) =>{
        if(err){
            res.status(400).json({
                error:"URL not found"
            })
        }else{         
            res.redirect(results[0].longurl)
        }
    })
})

app.post('/url', (req, res, next) =>{
    const shortUrlId = req.body.shortUrlId || nanoid(5);
    const longUrl = req.body.longUrl;
    if(!longUrl){
        res.status(400).json({
            error: 'URL is required'
        })
    }else{
        dbConnection.query("SELECT * from urlminifier WHERE shorturlid = ?",[shortUrlId],
        function(err, results){
            if(err){
                throw err;
            }
            
            if(results.length > 0){
                res.status(401).json({
                    error: "Cannot have duplicated shortener identifiers"
                })
            }else{
                let shortUrl = "http://localhost:3000/url/"+shortUrlId
                dbConnection.query("INSERT INTO urlminifier SET longurl=?, shorturlid=?",[longUrl,shortUrlId],
                (err, results) =>{
                    if(err){
                        console.log(err)
                        res.status(400).json({
                            error:"Error at saving the short URL"
                        })
                    }else{
                        dbConnection.commit((err) =>{
                            if(err){
                                return dbConnection.rollback(() =>{ throw err })
                            }
                            console.log("URL Saved")
                            res.json({
                                url:shortUrl
                            })
                        })
                    }
                })
            }
        })
    }
})

const PORT = 3000||process.env.PORT;

dbConnection.connect((err) =>{
    if(err){
        console.log('Error connecting to the database ');
        throw err;
    }

    console.log('Database connection stablished');
})

app.listen(PORT, ()=>{
    console.log(`Application server running at port ${PORT}`)
})

module.exports = app;