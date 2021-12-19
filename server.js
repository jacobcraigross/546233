const log_events = require('./log_events'); // --> custom module we created. 
const EventEmitter = require('events'); // --> common core
const http = require('http'); // common core 
const path = require('path'); // common core 
const fs = require('fs'); // common core 
const fsPromises = require('fs').promises; // common core 
class JakesEmitter extends EventEmitter {};
const jakes_emitter = new JakesEmitter();

jakes_emitter.on("log", (msg, fileName) => log_events(msg, fileName));

// define a dev PORT on our localhost
const PORT = process.env.PORT || 3500;

// function to re-use and serve different pages. 
const serve_file = async (filePath, contentType, response) => {
    try {
        const raw_data = await fsPromises.readFile(filePath, !contentType.includes('image') ? 'utf-8' : "");
        const data = contentType === 'application/json'
            ? JSON.parse(raw_data) : raw_data;
        response.writeHead(filePath.includes('404.html') ? 404 : 200, {"Content-Type": contentType});
        response.end(contentType === 'application/json' ? JSON.stringify(data) : data);
    } catch (err) {
        console.log(err);
        jakes_emitter.emit('log', `${err.name} : ${err.message}`, 'error_log.txt');
        response.statusCode = 500;
        response.end();
    }
}

// create the bare bones server. 
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    jakes_emitter.emit('log', `${req.url} \t ${req.method}`, 'request_log.txt'); // emit to the log.
    const extension = path.extname(req.url);
    let contentType;
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    // chained ternary statement. (essentially one big ass if else statement)
    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    // last catch all condition. (.html extension not required in the browser)              
    if (!extension && req.url.slice(-1) !== '/') {
        filePath += '.html';
    }

    const file_exists = fs.existsSync(filePath);
    if (file_exists) {
        serve_file(filePath, contentType, res);
    } else {
        switch(path.parse(filePath).base) {
            case "old_page.html": 
                res.writeHead(301, {"Location": "/new_page.html"});
                res.end();
                break;
            case "www_page.html":
                res.writeHead(301, {"Location": "/"});
                res.end();
                break;
            default: 
                serve_file(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }
});

// listen for server request on the PORT we defined. (always at the end of the file)
server.listen(PORT, () => console.log(`nuke deployed here ${PORT}`));
