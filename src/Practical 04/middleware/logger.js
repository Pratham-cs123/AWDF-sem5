function logger(req, res, next) {
    console.log(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}

module.exports = logger