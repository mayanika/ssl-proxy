module.exports = {
    port_https  : 443,
    port_http   : 80,
    base_url    : 'localhost',
    type        : 'both', //http, http, both
    log_requests: true,

    credentials : {
        cert    : '', //example: './ssl/cert.crt',
        key     : '', //example:'./ssl/key.key'
    },

    // Options for http-proxy library
    options: {

    },

    // Domains should be in your local hosts file
    proxies: [
        {
            domain          : 'test.com',
            port_destination: 4000
        },
        {
            domain          : 'test1.com',
            port_destination: 4001
        },
    ]
};