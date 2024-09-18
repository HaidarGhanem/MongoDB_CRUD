const express = require ('express')
const app = express()

const { ConnectToDb , getDb } = require('./db')
const { ObjectId } = require('mongodb')

const dataCollection = 'INSERT YOUR COLLECTION'
const mongoUrl = 'INSERT YOUR MONGO URL'
const newData = ['INSERT YOUR NEW DATA' , 'one object or more']

let db // the object to deal with database

//set connection
ConnectToDb(mongoUrl , (err)=>{
    if(!err){
        db = getDb()
        app.listen( 3000 , ()=>{
            console.log(`app listening on port 3000`)
        })
    }
    else{
        console.log(err)
    }
})

//testing 
app.get('/' , (req,res)=>{
    res.send('mongodb testing API')
})

//GET data | get all data from collection
app.get('/data',  (req,res)=>{
    let ResultData = []
    db.collection(dataCollection)
        .find()
        .sort({ author : 1 })
        .forEach((data)=>{
            ResultData.push(data)
        })
        .then(()=>{
            res.status(200).json(ResultData)
        })
        .catch(err =>{
            res.status(500).json({error : 'Couldnt Fetch Data'})
        })
})

//GET data | get a specific object by id
app.get('/data/:id' , (req,res)=>{
    if( ObjectId.isValid(req.params.id)){
        const objectId = new ObjectId(req.params.id)
        db.collection(dataCollection)
            .findOne({_id : objectId})
            .then((doc)=>{
                res.status(200).json(doc)
            })
            .catch((err)=>{
                res.status(500).json({error : err.message})
            })
    }
    else{
        res.status(500).json({error : 'Id is not valid'})
    }
})

//DELETE data | delete an object by id
app.delete('/data/:id', (req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        const objectId = new ObjectId(req.params.id)
        db.collection(dataCollection)
            .deleteOne({ _id : objectId})
            .then(res =>{
                res.status(200).json({mssg : 'deleted succussfully'})
            })
            .catch(e =>{
                res.status(500).json({msg : e})
            })
    }
    else{
        res.status(500).json({error : 'Id is not valid'})
    }
})

//POST data | add new data
app.post('/data' , (req,res)=>{
    db.collection(dataCollection)
        .insertMany(newData)
        .then(res =>{
            res.status(200).json({mssg : 'deleted succussfully'})
        })
        .catch(e =>{
            res.status(500).json({msg : e})
        })
})

//UPDATE data | update data by new values
app.patch('/data/:id' , (req,res)=>{
    const { data , updateData} = req.body
    //Example updateData = { title : 'new value' , author : 'new value'}

    db.collection(dataCollection)
        .updateOne(data , updateData)
        .then(res =>{
            res.status(200).json({mssg : 'deleted succussfully'})
        })
        .catch(e =>{
            res.status(500).json({msg : e})
        })
})