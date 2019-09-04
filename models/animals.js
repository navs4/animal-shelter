const mongoose = require('mongoose');
const moment = require('moment');
const paginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const AnimalSchema = new Schema({
    name: String,
    type: String,
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    adopted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdOn: Date,
    updatedOn: Date,
    data: {
        data: Buffer,
        contentType: String
    },
    mimetype: {
        type: String,
        default: '',
        trim: true
    },
    size: {
        type: Number,
        default: 0
    },
    fileName: {
        type: String,
        default: '',
        trim: true
    }
});



AnimalSchema.pre('save', (next) => {
    this.createdOn = moment.utc().valueOf();
    next();
});

AnimalSchema.plugin(paginate);
mongoose.model('Animals', AnimalSchema);