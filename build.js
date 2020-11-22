const fs = require('fs');
var args = process.argv.slice(2);
if(args && args.length > 0){
    fs.readFile('.env.'+args, 'utf8', function(error, data){
        if (error) {throw error};
        fs.writeFile('.env', data ,'utf8', function(error, data){
          if (error) {throw error};
          console.log("env 교체-완료 " , args );
        });
    });
}
