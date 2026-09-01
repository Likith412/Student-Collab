const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

async function authenticateUser(req, res, next) {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not Authenticated" });
   }

   const token = authHeader.split(" ")[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const dbUser = await User.findById(decoded.userId);

      if (!dbUser) {
         return res.status(401).json({ message: "Not Authenticated" });
      }

      // Block check — only for non-admins
      if (dbUser.role !== "admin" && dbUser.isBlocked) {
         return res
            .status(403)
            .json({ message: "Your account is blocked. Access denied." });
      }

      req.user = decoded;
      next();
   } catch (err) {
      console.error("Authentication error:", err);
      return res.status(401).json({ message: "Not Authenticated" });
   }
}

// Same as authenticateUser, but never rejects the request. Public routes that
// personalise their response (project search sorted by `best_match`) use this so
// a signed-in visitor gets the tailored result and everyone else still gets a page.
async function attachUserIfAuthenticated(req, _res, next) {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
   }

   const token = authHeader.split(" ")[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const dbUser = await User.findById(decoded.userId);

      // Blocked or deleted accounts are treated as anonymous rather than refused.
      if (dbUser && !(dbUser.role !== "admin" && dbUser.isBlocked)) {
         req.user = decoded;
      }
   } catch {
      // An expired or malformed token just means "not signed in" here.
   }

   next();
}

function authorizeUserRoles(...allowedRoles) {
   return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
         return res
            .status(403)
            .json({ message: "Not authorized to perform this action" });
      }
      next();
   };
}

module.exports = { authenticateUser, attachUserIfAuthenticated, authorizeUserRoles };
