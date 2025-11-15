import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Token is not Valid!" });
    }
    
    req.user = {
      id: payload.id,
      company: payload.company,
      parentCompany: payload.parentCompany,
      userType: payload.userType
    };
    
    next();
  });
};

// Middleware to verify parent company access
export const verifyParent = (req, res, next) => {
  if (req.user.userType !== "Admin") {
    return res.status(403).json({ 
      message: "Access Denied! Only parent company can access this." 
    });
  }
  next();
};

// Middleware to verify child company access
export const verifyChild = (req, res, next) => {
  if (req.user.userType !== "User") {
    return res.status(403).json({ 
      message: "Access Denied! Only child company can access this." 
    });
  }
  next();
};