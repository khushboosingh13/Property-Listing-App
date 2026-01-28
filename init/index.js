const mongoose = require('mongoose');
const Intidata=require('./data');
const list=require('../models/listing');
const geolocation = require('../public/js/cordinate.js');

main().then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error:', error);
    });

    async function main(){
        await mongoose.connect('mongodb://localhost:27017/travel');
        
    }  

    let init=async ()=>{
       await list.deleteMany({});
        Intidata.data= Intidata.data.map((obj) => (
            {
                ...obj,
                owner: "688141c0f15801575c1bbaff" ,
        
        }));
        
        // console.log(Intidata.data);
        list.insertMany(Intidata.data);
        console.log("Intialise of DB");
    }
    
    init();
