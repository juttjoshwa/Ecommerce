class ApiFeatures {
    constructor(query,queryStr){
        this.query =  query
        this.queryStr =  queryStr
    }

    // Search feature
    search(){
        const keyword = this.queryStr.keyword ? {
            name :{
                $regex: this.queryStr.keyword,
                $options : "i",
            }
        }:{} 


        this.query= this.query.find({...keyword})
        return this ;

    }

    filter(){
        const queryCopy = {...this.queryStr}


        //removing some fileds for catagory 
        const removeFileds = ["keyword","page","limit"];

        removeFileds.forEach(key =>delete queryCopy[key])

        // filter for price and rating

        console.log(queryCopy);
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key => `$${key}` );

        this.query = this.query.find(JSON.parse(queryStr));


        return this;
    }
    // pagination 
    pagination(resultperPage){
        const currentPage = Number(this.queryStr.page) ||1

        const skip = resultperPage * (currentPage - 1)

        this.query = this.query.limit(resultperPage).skip(skip)

        return this
    }
}

export default ApiFeatures;