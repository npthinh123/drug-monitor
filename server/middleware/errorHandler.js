function errorHandler(err, req, res, next) {
    try{
        console.error('Error stack:', err.stack);
    if(req.method === 'GET'){
        res.status(500).json({
            error: 'Internal Server Error',
            message: err.message,
        });
    }else{
        res.status(400).json({
            error: 'Bad Request',
            message: err.message,
        });
    }
    }
    catch(error){
        next(error);
    }
}
module.exports = errorHandler;