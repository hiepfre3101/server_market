export const authenticattion = async (req, res, next) => {
    try {
        if(!req.cookies.jwt) {
            return res.status(401).json({
                error: 'Yêu cầu đăng nhập',
            });
        }
        next()
    } catch (error) {
        return res.status(401).json({
            error: error.message
        })
    }
}