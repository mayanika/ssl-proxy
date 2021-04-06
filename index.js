const fs = require('fs');
const config = require('./config');

const domains = {};
config.proxies.forEach((item) => {
    domains[item.domain] = item;
});

let proxy = require('http-proxy').createProxyServer(config.options);
let express = require('express');
let app = express();
app.use(function(req, res){
    let info = domains[req.hostname];

    if (info) {
        if (config.log_requests) {
            console.log(`[${req.hostname}]:`, req.method, req.originalUrl);
        }
        proxy.web(req, res, {target: `http://${config.base_url}:${info.port_destination}`});
    }
    else {
        res.sendStatus(404);
    }
});

let servers = {};
if (config.type === 'https' || config.type === 'both') {
    let credentials = config.credentials;
    if (credentials) {
        [
            'cert',
            'key',
            'ca'
        ].forEach((key) => {
            if (!credentials[key]) {
                return;
            }

            credentials[key] = fs.readFileSync(credentials[key]);
        });
    }

    servers.https = require('https')
        .createServer(credentials, app)
        .listen(config.port_https)
        .on('listening', () => {
            console.log(`HTTPS Proxy started on port ${config.port_https}`)
        })
        .on('error', function(error){
            console.error(`HTTPS Proxy error`, error);
            process.exit(1);
        });
}

if (config.type === 'http' || config.type === 'both') {
    servers.http = require('http')
        .createServer(app)
        .listen(config.port_http)
        .on('listening', () => {
            console.log(`HTTP Proxy started on port ${config.port_http}`)
        })
        .on('error', function(error){
            console.error(`HTTP Proxy error`, error);
            process.exit(1);
        });
}
