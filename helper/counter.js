const Url = require('../Models/Url');

async function Count(id){
        const UrlData = await Url.findOne({urlId: id});
        UrlData.click += 1;
        await UrlData.save();
}


module.exports = Count;