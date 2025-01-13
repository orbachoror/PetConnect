import User, { IUser } from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface RegisterUserParams {
    name: string,
    email: string,
    password: string,
    phone?: string,
    address?: string,
    dateOfBirth?: Date
}
interface TokenPayload extends JwtPayload {
    _id: string;
    random: string;
    email: string;
}
const register = async ({ name, email, password, ...rest }: RegisterUserParams): Promise<IUser> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword, ...rest });
    return user;
}

const login = async ({ email, password }: { email: string, password: string }):
    Promise<{ user: IUser, accessToken: string, refreshToken: string }> => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('incorrect email or password')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('incorrect email or password')
    }
    const tokens = await generateTokens(user)
    if (!user.refreshTokens) {
        user.refreshTokens = []
        await user.save()
    }
    user.refreshTokens.push(tokens.refreshToken)
    await user.save()
    return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
}

const logout = async (refreshToken: string) => {
    const user = await validateRefreshToken(refreshToken);
    user.refreshTokens = user.refreshTokens?.filter(token => token !== refreshToken);
    await user.save();


}
const refresh = async (refreshToken: string) => {
    const user = await validateRefreshToken(refreshToken);
    const tokens = await generateTokens(user);
    if (!tokens) {
        throw new Error('Error while generating tokens');
    }
    user.refreshTokens = user.refreshTokens?.filter(token => token !== refreshToken);
    user.refreshTokens?.push(tokens.refreshToken);
    await user.save();
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
}

/*------------------Helper functions for tokens------------------*/

const generateTokens = async (user: IUser) => {
    if (!process.env.TOKEN_SECRET) {
        throw new Error('TOKEN_SECRET is not defined');
    }
    const random = Math.random().toString(36).substring(2);
    const accessToken = jwt.sign(
        { _id: user._id, random, email:user.email },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign(
        { _id: user._id, random,email:user.email },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    return { accessToken, refreshToken };
}

const validateRefreshToken = async (refreshToken: string | undefined) => {
    if (!refreshToken) {
        throw new Error('Refresh token is required');
    }
    if (!process.env.TOKEN_SECRET) {
        throw new Error('TOKEN_SECRET is not defined');
    }
    const payload = await verifyToken(refreshToken, process.env.TOKEN_SECRET);
    const user = await User.findById(payload._id);
    if (!user) {
        throw new Error('User not found');
    }
    if (!user.refreshTokens || !user.refreshTokens?.includes(refreshToken)) {
        user.refreshTokens = [];
        await user.save();
        throw new Error('Invalid refresh token');
    }
    return user;
}

export const verifyToken = async (token: string, tokenSecret: string): Promise<TokenPayload> => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, tokenSecret, (err, payload) => {
            if (err) {
                reject(err);
            }
            resolve(payload as TokenPayload);
        });
    });
}
export default { register, login, logout, refresh };
