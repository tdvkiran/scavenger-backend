const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BranchSchema = new Schema({
    insitutionName: String,
    branchName: String,
    address: String,
    city: String,
    contactNumber: Array,
    branchIncharge: String,
    pincode: Array,
    password: {
        type: String,
    },
    created_date:{
        type: Date,
        default:Date.now()
    }
})

const Branch = mongoose.model('Branch', BranchSchema)

module.exports = Branch;

