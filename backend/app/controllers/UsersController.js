import UsersModel from "../model/UsersModel.js";
import { TokenEncode } from "../utility/tokenUtility.js";
import SendEmail from "../utility/emailUtility.js";
import bcrypt from "bcryptjs";

export const Registration = async (req, res) => {
    try {
        let reqBody = req.body;
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        reqBody.password = await bcrypt.hash(reqBody.password, salt);
        await UsersModel.create(reqBody);
        return res.status(200).json({ status: "success", message: "Registration Successful" });
    } catch (error) {
        return res.json({ status: "failed", message: error.message });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await UsersModel.findOne({ email });
        if (!user) {
            return res.json({ status: "failed", message: "Login failed! Invalid credentials" });
        }
        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ status: "failed", message: "Login failed! Invalid credentials" });
        }
        let token = TokenEncode(user["email"], user["_id"]);
        return res.status(200).json({ status: "success", message: "Login Successful", token: token});
    } catch (error) {
        return res.json({ status: "failed", message: error.message });
    }
};

export const ProfileDetails = async (req, res) => {
    try {
        let user_id = req.headers["user_id"];
        let user = await UsersModel.findOne({ "_id": user_id });
        return res.json({ status: "success", message: "User details fetched successfully", userDetails: user });
    } catch (error) {
        return res.json({ status: "failed", message: error.message });
    }
};

export const UpdateProfile = async (req, res) => {
    try{
        let reqBody = req.body;
        let user_id = req.headers["user_id"];
        if (reqBody.password) {
            const salt = await bcrypt.genSalt(10);
            reqBody.password = await bcrypt.hash(reqBody.password, salt);
        }
        await UsersModel.updateOne({ "_id": user_id }, { $set: reqBody });
        return res.json({ status: "success", message: "Profile updated successfully" });
    }catch(error){ return res.json({ status: "failed", message: error.message }); }
}

export const EmailVerify = async (req, res) => {
    try{
        let email = req.params.email;
        let user = await UsersModel.findOne({ email : email });
        if(!user){
            return res.json({status: "failed", message: "Email not registered"});
        }else{
            let otp = Math.floor(100000 + Math.random() * 900000);
            let EmailTo = user.email;
            let EmailSubject = "OTP for Email Verification";
            let EmailText = `Your Otp code id ${otp}`
            await SendEmail(EmailTo, EmailSubject, EmailText)

            await UsersModel.updateOne({email:email},{otp:otp});
            return res.json({status: "Success", Message: "Verification successfully, cheack email"})
        }
    }catch(error){ return res.json({ status: "failed", message: error.message }); }
};

export const CodeVerify = async (req, res) => {
 try{
    let email = req.params.email;
    let code = req.params.code;

    let user = await UsersModel.findOne({ email : email, otp: code });
    if(!user){
        return res.json({status: "failed", message: "Invalid code"});
    }else{
        return res.json({status: "Success", Message: "Code verified successfully"})
    }
 }catch(error){ return res.json({ status: "failed", message: error.message }); }
}

export const ResetPassword = async (req, res) => {
    try{
        let reqBody = req.body;
        let user = await UsersModel.findOne({ email : reqBody.email, otp: reqBody.code });
        if(!user){
            return res.json({status: "failed", message: "Invalid code"});
        }else{
            const salt = await bcrypt.genSalt(10);
            reqBody.password = await bcrypt.hash(reqBody.password, salt);
            await UsersModel.updateOne({ email : reqBody.email }, { $set: { otp:"0", password: reqBody.password } });
            return res.json({status: "Success", Message: "Password reset successfully"})
        }   
    }catch(error){ return res.json({ status: "failed", message: error.message }); }
}