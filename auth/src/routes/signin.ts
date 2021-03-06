import { body, validationResult } from 'express-validator';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken'

import { validationRequest } from './../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from './../services/password';
import { BadRequestError } from './../errors/bad-request-error';

import { RequestValidationError } from './../errors/request-validation-error';

const router = express.Router();

router.post('/api/users/signin', 
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    
    const { email, password } = req.body;

    const existingUser = await User.findOne({email});

    if(!existingUser){
      throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if(!passwordsMatch){
      throw new BadRequestError('Invalid Credentials');
    }

     // Generate json webtoken
    const userJWT = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);

    // Store it on session object
    req.session = {
      jwt: userJWT
    }

    res.status(200).send(existingUser)
  }
);

export { router as signinRouter }