import {NextFunction, Request, Response} from 'express'
import {auth as betterAuth} from '../lib/auth'

declare global{
      namespace Express{
            interface Request{
                  user?:{
                        id: String
                        email: String
                        name: Storage
                        role: 
                  }
            }
      }
}

const auth = (...roles: any) =>{
      return async(req: Request, res: Response, next: NextFunction) =>{
            //* get user session
            const session = await betterAuth.api.getSession({
                  headers: req.headers as any
            })

            if(!session){
                  return res.status(400).json({
                        success: false,
                        message: "You are not authorize."
                  })
            }

            if(!session.user.emailVerified){
                 return res.status(403).json({
                        success: false,
                        message: "Email verification required. Please verify your email."
                  }) 
            }
            
            next();
      }
}