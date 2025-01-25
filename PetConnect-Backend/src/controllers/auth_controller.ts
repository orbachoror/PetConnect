import { Request, Response } from 'express';
import authService from '../services/auth_service';
import logger from '../utils/logger';
import { OAuth2Client } from 'google-auth-library';
const usersUploadPath = 'uploads/users_pictures/';
import User from '../models/user_model';



const register = async (req: Request, res: Response) => {
    req.body.profilePicture = req.file ? `${usersUploadPath}${req.file.filename}` : null;
    const { name, email, password, ...rest } = req.body
    if (!email || !password || !name) {
        logger.error('Email ,password and name are required');
        res.status(400).json({ message: "Email, password and name are required" });
        return;
    }
    try {
        const user = await authService.register({ name, email, password, ...rest });
        logger.info('User registered: ' + user);
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        logger.error('Error while registering user: ' + error);
        res.status(500).json({ message: "Error while registering user: ", error });
    }
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        logger.error('Email and password are required');
        res.status(400).json({ message: "Email and password are required" });
        return;
    }
    try {
        const { user, accessToken, refreshToken } = await authService.login({ email, password });
        logger.info('User logged in: ' + user);
        res.status(200).json(
            {
                message: "User logged in successfully",
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        );
    } catch (error) {
        logger.error('Error while logging in user: ' + error);
        res.status(500).json({ message: "Error while logging in user: ", error });
    }
}

const client = new OAuth2Client();
const googleSignIn = async (req: Request, res: Response) => {
   try {
       const ticket = await client.verifyIdToken({
           idToken: req.body.credentialResponse.credential,
           audience: process.env.GOOGLE_CLIENT_ID,
       });
       const payload = ticket.getPayload();
       const email=payload?.email;
       if(email!=null){
            let user= await User.findOne({'email':email});
            if(user==null){
                user= await User.create({
                    'name':email,
                    'email':email,
                    'password':'',
                    'phone':'',
                    'address':'',
                    'dateOfBirth':'',
                    'profilePicture':''
                }); 
            }
            const {user:newUser,accessToken,refreshToken}=await authService.login({email:email,password:user.password});
            logger.info('User logged in: ' + user);
            res.status(200).json(
                {
                    message: "User logged in successfully by google",
                    user: newUser,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            );
        }
   } catch (err) {
    logger.error('Error while google sign in: ' + err);
    res.status(400).send("error missing email or password"+ err);
   }
}


const logout = async (req: Request, res: Response) => {
    try {
        await authService.logout(req.body.refreshToken);
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        logger.error('Error while logging out user: ' + error);
        res.status(500).json({ message: "Error while logging out user: ", error });
    }
}

const refresh = async (req: Request, res: Response) => {
    try {
        const { accessToken, refreshToken } = await authService.refresh(req.body.refreshToken);
        logger.info('Token refreshed: \n' + accessToken + "\n" + refreshToken);
        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        logger.error('Error while refreshing token: ' + error);
        res.status(500).json({ message: "Error while refreshing token: ", error });
    }
}

export default { register, login, logout, refresh, googleSignIn };