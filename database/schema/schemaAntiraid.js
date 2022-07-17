const {
    Schema,
    model
} = require('mongoose');

const SchemaAntiraid = new Schema({
    _id: Schema.Types.ObjectId,
    server: String,
    antispam: {
        type: Boolean,
        required: false,
        default: true,
    },
    antilink: {
        type: Boolean,
        required: false,
        default: true,
    },
    antiwebhook: {
        type: Boolean,
        required: false,
        default: true,
    },
    antiban: {
        type: Boolean,
        required: false,
        default: true,
    },
    antichannel: {
        type: Boolean,
        required: false,
        default: true,
    },
    antieveryone: {
        type: Boolean,
        required: false,
        default: true,
    },
    antiword: {
        type: Boolean,
        required: false,
        default: true,
    },
    antirole: {
        type: Boolean,
        required: false,
        default: true,
    }
});

module.exports = model('Antiraid', SchemaAntiraid)