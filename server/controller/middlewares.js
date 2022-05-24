import jwt from "jsonwebtoken";

export const authenticateTokenAndSendUserDetails = (req, res, next) => {
     const authHeader = req.headers?.authorization;
     const token = authHeader && authHeader.split(" ")[1];

     if (token) {
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
               if (err) return res.status(403).json({ message: "Invalid token." });
               // const { role: tokenRole, email: tokenEmail, id: tokenId } = user;
               const { role, email, id } = user;
               // const { id, role, email, phoneNumber, years } = await Owner.findById(tokenId);
               return res.json({
                    message: "Authenticated",
                    user: {
                         id,
                         role,
                         email,
                         // phoneNumber,
                         // years,
                         accessToken: token,
                    },
               });
          });
     } else next();
};

export const isUserAuthorized = (req, res, next) => {
     const authHeader = req.headers?.authorization;
     const token = authHeader && authHeader.split(" ")[1];

     if (!token) return res.status(401).json({ message: "Please login first." });
     else
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
               if (err) return res.status(403).json({ message: "Invalid token." });
               req.user = user;
               next();
          });
};
