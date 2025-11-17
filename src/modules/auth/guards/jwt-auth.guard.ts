// External libraries imports
import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtUserAuthGuard extends AuthGuard("authUser") {
  JSON_WEB_TOKEN_ERROR = "JsonWebTokenError";

  TOKEN_EXPIRED_ERROR = "TokenExpiredError";
  async canActivate(context: ExecutionContext) {
    // Call the default passport authentication flow first
    const result = (await super.canActivate(context)) as boolean;
    // You could add additional checks here if needed
    return result;
  }

  // Keep a permissive signature and do explicit checks — return the user when valid
  handleRequest(err: any, user: any, info: any, context: any, status?: any) {

    if (info?.name === this.JSON_WEB_TOKEN_ERROR) {
      throw new UnauthorizedException(this.JSON_WEB_TOKEN_ERROR);
    }

    if (info?.name === this.TOKEN_EXPIRED_ERROR) {
      throw new UnauthorizedException(this.TOKEN_EXPIRED_ERROR);
    }

    if (info) {
      // info may be a message or Error-like object
      const message = (info && (info.message || info.toString())) || 'Unauthorized';
      throw new UnauthorizedException(message);
    }

    if (err) {
      throw err;
    }

    // If there's no error/info, return the validated user object
    return user;
  }
}
