import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String, default: "" },
    otp: { type: String, default: 0 },
},
    { timestamps: true,
        versionKey: false 
    }
);

const UsersModel = mongoose.model('Users', UserSchema);
export default UsersModel;