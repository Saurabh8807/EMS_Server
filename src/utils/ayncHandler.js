const asyncHnadler = (fn) => async (req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success:false,
            message:error.message
        })
    }
}
