import { IController } from '../interfaces/IController';
import { UserService } from '../services/UserService';
import { Application, Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import { validateInput } from '../middleware/RequestValidation';
import { UserValidator } from '../middleware/schemas';

export class AuthController implements IController {
  init (app: Application) {
    app.post(
      '/auth/login',
      validateInput(UserValidator.login),
      passport.authenticate('local', { session: false }),
      this.login);

    app.post('/auth/register', validateInput(UserValidator.register), this.register);
  }

  private login (req: Request, res: Response) {
    res.json({
      user: req.user,
      token: UserService.generateToken(req.user)
    });
  }

  private async register (req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);

      res.json({
        user: user.toJSON(),
        token: UserService.generateToken(user.toJSON())
      });
    } catch (err) {
      next(err);
    }
  }
}
