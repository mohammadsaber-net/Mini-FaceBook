export const catchErrorMidelware=(catchError)=>{
    return(req,res,next)=>{
        catchError(req,res,next).catch(err=>{
            console.log("errrrr,",err.message)
            next(err)
        })
    }
}
export const handleError=(massege,status,next)=>{
    let error=new Error()
    error.message=massege
    error.httpError=false
    error.status=status
    next(error)
}
export const protect=async(req,res,next)=>{
    try {
        const {userId}=req.auth()
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"not Authenticated"
            })
        }
        next()
    } catch (error) {
        return res.json({
                success:false,
                message:"an error =>"+error.message
            })
    }
}