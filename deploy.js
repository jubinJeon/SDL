const fs = require('fs')
const path = require('path')
const config = require('./deploy.config')
const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH()

let remotePath = '';
let host='';
let username='';
let password='';

var args = process.argv.slice(2);
console.log(args[0]);
if(args && args.length > 0){
  if(args[0] ==='dev'){
    host=config.dev.host;
    username=config.dev.user;
    password=config.dev.pass;
    remotePath=config.dev.remotePath;
  }else if(args[0]==='prd1'){
    host=config.prd_01.host;
    username=config.prd_01.user;
    password=config.prd_01.pass;
    remotePath=config.prd_01.remotePath;
  }else if(args[0]==='prd2'){
    host=config.prd_02.host;
    username=config.prd_02.user;
    password=config.prd_02.pass;
    remotePath=config.prd_02.remotePath;
  }else{
    console.log('command error! 배포 중지');
    return;
  }
}else{
  console.log('command error! 배포 중지');
  return;
}

ssh.connect({
//   privateKey: '/home/sss/.ssh/id_rsa'
    host: host,
    username: username,
    password : password,
    port: 22
})
.then(function() {
  if (!fs.existsSync('./build/backup')){
    fs.mkdirSync('./build/backup');
  }
})
.then(function() {
  const failed = []
  const successful = []  
  ssh.getDirectory('./build/backup', remotePath, {
    recursive: true,
    concurrency: 10,
    validate: function(itemPath) {
      const baseName = path.basename(itemPath)
      return baseName.substr(0, 1) !== '.' && // do not allow dot files
             baseName !== 'node_modules' && // do not allow node_modules
             baseName !== 'etc'
    },
    tick: function(localPath, remotePath, error) {
      if (error) {
        failed.push(localPath)
      } else {
        successful.push(localPath)
      }
    }
  }).then(function(status) {
    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
    console.log('failed transfers', failed.join('\r\n'))
    console.log('successful transfers', successful.join('\r\n'))
    console.log('deploy complete');
    // ssh.dispose();
  })
})
.then(function(){
  ssh.execCommand('rm -rf '+remotePath+'/*.js')
  .then(function(status){
    if(status.stderr)console.log("ERROR : \r\n", status.stderr );
    ssh.execCommand('rm -rf '+remotePath+'/static/js/*.*')
    .then(function(status){
      if(status.stderr)console.log("ERROR : \r\n", status.stderr );
      // ssh.dispose();
    });
  });
})
.then(function() {
  const failed = []
  const successful = []
  ssh.putDirectory('./build', remotePath, {
    recursive: true,
    concurrency: 10,
    validate: function(itemPath) {
      const baseName = path.basename(itemPath)
      return baseName.substr(0, 1) !== '.' && // do not allow dot files
             baseName !== 'node_modules' // do not allow node_modules
    },
    tick: function(localPath, remotePath, error) {
      if (error) {
        failed.push(localPath)
      } else {
        successful.push(localPath)
      }
    }
  }).then(function(status) {
    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
    console.log('failed transfers', failed.join('\r\n'))
    console.log('successful transfers', successful.join('\r\n'))
    console.log('deploy complete');
    ssh.dispose();
  })
});