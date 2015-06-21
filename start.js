var nats = require('nats').connect();
var log = require('logule').init(module, 'hrm');

var currentHRM;

var exec = require('child_process').execFile,
    child = exec('./start.sh', [], { stdio: 'inherit' });

child.stdout.on('data', function(data) {
    console.log(data.toString());
    var p;

    if(data)
        p = data.indexOf('=');
    if(p && p != -1){
        var hrm = data.substring(p+1).trim();
        log.info("pubsh HRM:"+hrm);
        currentHRM = hrm;

    }else{

        currentHRM = undefined;
    }
});

child.on('close', function (code) {
    console.log('child process exited with code ' + code);
    
});


setInterval(function(){

    if(currentHRM){
        nats.publish('humix.sense.hrm.event', '{"sensor":"hrm","value":'+currentHRM+'}');
        //nats.publish('humix.sense.hrm.event', '{"sensor":"hrm","value":180}');
    }
   
}, 3000);


