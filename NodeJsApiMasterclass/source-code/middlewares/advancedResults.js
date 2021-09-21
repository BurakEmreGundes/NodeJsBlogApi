const advancedResults=(model,populate)=> async (req,res,next)=>{
    let query;

    // Copy req.query
    let reqQuery={...req.query}
   

    // Fields to exclude
    const removeFields=["select","sort","page","limit"]

    // Loop over removeFiels and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param])         

    // Create query string
    let queryStr=JSON.stringify(reqQuery)

    // Create operators (gte,gt,lte,lt, etc)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)


   
  
    // Finding resorce
    query=model.find(JSON.parse(queryStr))

    if(populate){
        query=query.populate(populate)
    }
    

    // Select
    if(req.query.select){
            const selectStr=req.query.select.split(",").join(" ")
            console.log(selectStr)
            query=query.select(selectStr)
    }

    // Sort
    if(req.query.sort){
            const sortBy=req.query.sort.split(",").join(" ")
            query=query.sort(sortBy)
    }


     // Add Pagination
     let page=parseInt(req.query.page,10) || 1
     let limit=parseInt(req.query.limit,10) || 25
     let startIndex=(page-1) * limit
     let endIndex=limit * page
     let total=await model.countDocuments()

     query=query.skip(startIndex).limit(limit)

     const pagination={}

     if(endIndex < total){
             pagination.next={
                     page:page+1,
                     limit
             }
     }
     if(startIndex > 0){
             pagination.prev={
                     page:page-1,
                     limit
             }
     }
     const results=await query
     res.advancedResults={
        success:true,
        count:results.length,
        pagination,
        data:results 
     }
     next()
    
}



module.exports=advancedResults