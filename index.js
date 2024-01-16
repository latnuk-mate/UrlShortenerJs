require('dotenv').config();
const express = require('express');
const validUrl = require('valid-url');
const Path = require('path')
const ejs = require('ejs');
const axios = require('axios');
const generateKey = require('./helper/generate_key')
const CountClick = require('./helper/counter');
const app = express()

// setting up the template engine..
app.set('views', 'views');
app.set('view engine', 'ejs');

// setting up the database...
const mongoConnect = require('./helper/database');
mongoConnect();

// mounting other assets to the server..
app.use(express.static(Path.join(__dirname , "./components")))
app.use(express.urlencoded({extended : false}));

const Url = require('./Models/Url'); // bringing in the schema..

// Generating random UrlKey...
const key = generateKey();

// Generating random UrlSecretKey...
const secretkey = generateKey(8);


app.get('/', (req,res)=> {
    res.render('index' , {url: "" , secretKey: ""})
})


// Get all urls available in the database...
app.get('/list', async (req,res)=>{
    const listUrl = await Url.find({});
    try{
        if(listUrl){
            res.render('page', {url : listUrl})
        }else{
            res.statusCode(404).json('nothing found!')
        }
    }catch(err){
        console.log(err);
    }
})

// optional endpoint to pass params to access the target Url...
app.get('/:key', async(req,res)=>{
        try{
            const url = await Url.findOne({urlId : req.params.key});
            if(url){
                    try{
                         // cheking if the url exists or not...
                        const response = await axios.get(url.longUrl)
                        if (response.status >= 200 && response.status < 300){
                            await CountClick(req.params.key);
                            return res.redirect(url.longUrl)
                        }
                        else{
                             res.status(404).json('The site can not be reached!')
                        }
                    }catch(axiosError){
                        console.log(axiosError.message)
                        res.status(500).send('Internal server error..')
                    }
            }else{
                return res.status(404).json('Not Found');
            }
        }catch(err){
            res.status(500).json(err)
        }
});

// visiting the target url by clicking "VisitUrlButton"..
app.post('/urlredirect' , async(req,res)=>{
    const value = req.body.visitUrl;
    try{
        const url = await Url.findOne({shortUrl: value});
        if(url){
            try{
                // cheking if the url exists or not...
                const response = await axios.get(url.longUrl)
                if (response.status >= 200 && response.status < 300){
                    await CountClick(url.urlId);
                    return res.redirect(url.longUrl)
                }
                else{
                    res.status(404).json('The site can not be reached!')
                }
            }catch(axiosError){
                console.log(axiosError.message)
                res.status(500).send('Internal server error..')
            }
        }else{
            res.status(404).send('Not Found');
        }
    }catch(err){
        res.status(500).json(err)
        console.log(err)
    }
})

// create a new Url data...
app.post('/api' , async(req,res)=>{
    const longUrl = req.body.full_url;
    
            if(!validUrl.isUri(process.env.Base_Url)){
                    res.status(401).json('Not a valid Url')
            }
        if(validUrl.isUri(longUrl)){
            let url = await Url.findOne({longUrl});
          try{  
            if(url){
                res.render('index', {url: url.shortUrl, secretKey : url.secretkey})
            }else{
                let shortUrl = process.env.Base_Url + '/'+ key;
                url = new Url({
                        urlId: key,
                        secretkey,
                        shortUrl,
                        longUrl,
                        date: new Date()
                });
             await url.save();
             res.render('index', {url: url.shortUrl, secretKey: url.secretkey})
            }
        }catch(err){
            console.log(err)
        }
    }else{
        res.status(401).json('No access')
    }
});

// Generate other url information..
app.post('/urlInfo', async (req,res)=>{
    const urlInformation = req.body.visitUrlInfo;
    const urlData = await Url.findOne({secretkey: urlInformation});
    try{
        if(urlData){
            res.json(urlData)
        }else{
            res.statusCode(404).json('no url information found!')
        }
    }catch(err){
        console.log(err);
    }

})


// The server is up and running...
app.listen(4000,()=>{
    console.log('server is running on port 4000')
})