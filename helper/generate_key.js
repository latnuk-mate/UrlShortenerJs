function Generate_Key(value=5){
        let stringUpcase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let stringLowCase = "abcdefghijklmnopqrstuvwxyz";
        let digits = 1234567890;
        let RandomKey = stringUpcase + stringLowCase + digits;
        let key = "";
        for(let i = 0; i< value; i++){
            indexOfKey = Math.floor(Math.random() * RandomKey.length)
            key += RandomKey[indexOfKey]  
        }

        return key;
 }

 module.exports = Generate_Key;