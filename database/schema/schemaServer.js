const {
    Schema,
    model
} = require('mongoose');

const SchemaServer = new Schema({
    _id: Schema.Types.ObjectId,
    id: {
        type: String,
        required: true
    },
    logs: {
        channel: {
            type: String,
            required: false
        },
        bans: {
            type: Boolean,
            required: false,
            default: true
        },
        channels: {
            type: Boolean,
            required: false,
            default: true
        },
        roles: {
            type: Boolean,
            required: false,
            default: true
        },
        roleMenuChannel: {
            type: String,
            required: false
        },
        messages: {
            type: Boolean,
            required: false,
            default: true,
        }
    },
    tempvoc: {
        channel: {
            type: String,
            required: false,
            default: ""
        },
        category: {
            type: String,
            required: false,
            default: ""
        },
        channels: {
            type: [String],
            required: false,
            default: []
        },
    },
    role_menu: {
        type: [{
            id_message: {
                required: true,
                type: String,
            },
            reacts: {
                type: [{
                    reaction: {
                        required: true,
                        type: String
                    },
                    role: {
                        required: true,
                        type: String
                    }
                }],
                required: true,
            }
        }],
        required: false,
        default: []
    },
    owner: {
        type: Array,
        required: false,
        default: [],
    },
    whitelist: {
        users: {
            type: Array,
            required: false,
            default: []
        },
        channels: {
            type: Array,
            required: false,
            default: []
        }
    },
    color: {
        type: String,
        required: false,
        default: "114393"
    },
    language: {
        type: String,
        required: false,
        default: "fr"
    },
    sanction: {
        type: String,
        required: false,
        default: "ban"
    },
    prefix: {
        type: String,
        required: false,
        default: 'mts!'
    },
    antiWords: {
        type: Array,
        required: false,
        default: []
    },
    ticket: {
        type: String,
        required: false,
        default: ""
    },
    roleMuted: {
        type: String,
        required: false,
    },
    users: {
        type: [{
            id: {
                type: String
            },
            warnings: {
                type: Number,
                required: false,
                default: 0
            },
            tempvoc: {
                type: String,
                required: false
            },
            everyone: {
                type: Number,
                required: false,
                default: 0
            }
        }],
        required: false,
        default: []
    }
});
module.exports = model('guilds', SchemaServer);