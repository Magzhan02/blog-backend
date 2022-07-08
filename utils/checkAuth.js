import jwt from 'jsonwebtoken';

export default (request, resp, next) => {
  const token = (request.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'jwtKey');

      request.userId = decoded._id;

      next();
    } catch (error) {
      return resp.status(403).json({
        message: 'No access',
      });
    }
  } else {
    return resp.status(403).json({
      message: 'No access',
    });
  }
};
