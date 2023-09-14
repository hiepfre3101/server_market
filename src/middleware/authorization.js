import jwt from 'jsonwebtoken';
import User from '../models/user'
import dotenv from 'dotenv';
dotenv.config()

export const authorization = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt
        const { _id } = jwt.verify(token, process.env.SERECT_KEY)
        const user = await User.findById(_id)
        if(!user) {
            return res.status(401).json({
                error: 'Invalid authorization'
            })
        }    
        if(user.role !== 'admin') {
            return res.status(401).json({
                error: 'You are not allowed to access this application'
            })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            error: error.message
        })
    }
}