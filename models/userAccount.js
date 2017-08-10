var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserAccountSchema   = new Schema({
    userid:String,
    userlogon:{type:String, ref:'user'},
    firstname: String,
    lastname: String,
    addressline1: String,
    addressline2: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    personalemail: String,
    businessemail: String,
    homephone: String,
    cellphone: String,
    friends:{type: Schema.Types.ObjectId, ref: 'friendship'}
});

module.exports = mongoose.model('userAccount', UserAccountSchema);