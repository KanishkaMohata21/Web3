const { createServer } = require('http');
const next = require('next');
const routes = require('./routes');

const app = next({
    dev: process.env.NODE_ENV !== 'production'
});

console.log("Initializing Next app...");

const handler = routes.getRequestHandler(app);

console.log("Handler created...");

app.prepare()
    .then(() => {
        console.log("App prepared...");
        createServer(handler).listen(3000, (err) => {
            if (err) {
                throw err;
            }
            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch((err) => {
        console.error("Error during app preparation:", err);
    });
