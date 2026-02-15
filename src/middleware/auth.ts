import {NextFunction, Request, Response} from 'express'
import {auth as betterAuth} from '../lib/auth'

const auth = (...roles: any) =>{
      return async(req: Request, res: Response, next: NextFunction) =>{
            //* get user session
            const session = await betterAuth.api.getSession
            
            next();
      }
}