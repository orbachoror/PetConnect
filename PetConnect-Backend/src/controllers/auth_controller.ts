import { Request, Response } from 'express';
import authService from '../services/auth_service';
import logger from '../utils/logger';


const register = async (req: Request, res: Response) => {
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
                email: user.email,
                message: "User logged in successfully",
                _id: user._id,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        );
    } catch (error) {
        logger.error('Error while logging in user: ' + error);
        res.status(500).json({ message: "Error while logging in user: ", error });
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

export default { register, login, logout, refresh };