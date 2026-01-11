import { type Request, type Response } from "express";
import { validationResult } from 'express-validator';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default async function signup(req: Request, res: Response){
    const errors = validationResult(req);
    console.log(req.body.email);


    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //replace with sanitization and signup logic
    return res.status(200).json('valid email and password'); 
}


