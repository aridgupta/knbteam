import MyContext from "../types/context";
import { verify } from "jsonwebtoken";

export default ({ req, res, uid, connection }: MyContext) => {
  if (connection) {
    return connection!.context;
  }
  const token =
    req && req.headers && req.headers.authorization
      ? req.headers.authorization.replace("Bearer ", "")
      : null;
  if (token) {
    try {
      const { id } = verify(token, "paPN6aHEGIhL^CPh$kD@S33R2YmW#MFB") as any;
      uid = id;
      return { req, res, uid };
    } catch {
      throw new Error("Invalid JWT token");
    }
  }
  return { req, res };
};
