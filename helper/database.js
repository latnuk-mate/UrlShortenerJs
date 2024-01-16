const mongoose = require('mongoose');

const mongoConnect = async ()=>{
    try{
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('mongoose connected to ', db.connection.host)
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = mongoConnect;