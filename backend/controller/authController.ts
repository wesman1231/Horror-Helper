import { json, type Request, type Response } from "express";
import { validationResult } from 'express-validator';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default async function signup(req: Request, res: Response){
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    return res.status(200).json('valid email and password');
}


