function logger(req, res, next) {
    console.log(`${req.method} ${res.url} - ${new Date().toLocaleDateString()}`);
    
    next();
}

module.exports = logger