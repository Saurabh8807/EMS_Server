class ApiResponse{
    constructor(statuscode,data, message="success"){
        this.statuscode = statuscode
        // this.status = statuscode
        this.message = message
        this.data = data
        this.success = statuscode == 200
    }
}

export {ApiResponse}