import { type Request, type Response } from "express";
import { validationResult } from 'express-validator';

export async function validateSignup(req: Request, res: Response){
    const errors = validationResult(req);


    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    return res.status(200).json('valid email and password'); 
}

export async function validateLogin(req: Request, res: Response){
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    return res.status(200).json('valid email and password'); 
}


