var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var friendshipSchema   = new Schema({
    owner_useraccountid: String,
    useraccountid: [{type: Schema.Types.ObjectId, ref:'userAccount'}],
    pendinguseraccountid: [{type: Schema.Types.ObjectId, ref:'userAccount'}],
    twoway: Boolean
});

module.exports = mongoose.model('friendship', friendshipSchema);