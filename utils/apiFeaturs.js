class ApiFeaturs {
    constructor(queryString, mongooseQuery) {
        this.queryString = queryString
        this.mongooseQuery = mongooseQuery
    }

    filter() {
        const queryStringObj = { ...this.queryString }
        const excludesFields = ["page", "limit", "sort", "fields", "keyword"]
        excludesFields.forEach((field) => delete queryStringObj[field])
        let queryStr = JSON.stringify(queryStringObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr))
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.replace(/\b(,)\b/g, () => ` `)
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.replace(/\b(,)\b/g, () => ` `)
            this.mongooseQuery = this.mongooseQuery.select(fields)
            // console.log(this.queryString.fields);
            console.log("fildes:", fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v")
        }
        return this
    }

    search() {
        if (this.queryString.keyword) {
            const query = {}
            query.$or = [
                { title: { $regex: this.queryString.keyword, $options: "i" } },
                { description: { $regex: this.queryString.keyword, $options: "i" } },
                { name: { $regex: this.queryString.keyword, $options: "i" } }
            ]
            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this
    }

    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit
        const pagination = {}
        pagination.currentPage = page
        pagination.limit = limit
        pagination.numberOfPages = Math.ceil(countDocuments / limit)
        pagination.nextPage = page <= pagination.numberOfPages
        pagination.prev = page !== 1

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
        this.paginationResult = pagination
        return this
    }

}

module.exports = ApiFeaturs