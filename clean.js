const del = require('del');

del(['lib/**/*.js', 'commands/**/*.js', "actions/**/*.js", "bin/**/*.js"]).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
});