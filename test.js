var fs = require("fs");
fs.readFile('package.json','utf8',function(err,data){
    if(!err) {
       console.log(data);
    }
});
console.log("something else");