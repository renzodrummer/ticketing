import { RequestValidationError } from './../errors/request-validation-error';
import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validationRequest = (
  req: Request, 
  res: Response, 
  next: NextFunction
  ) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
      throw new RequestValidationError(error.array());
    }

    next();
}