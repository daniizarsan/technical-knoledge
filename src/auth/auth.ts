import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import config from '@config'

interface IPayload {
    id?: number;
    level?: string;
}

/**
 * 
 */
function isParamValid(element?: any) {
    return !(element == null || element == undefined)
}

/**
 * 
 */
function checkPayload(payload:any) {
    try {
        let toCheck:IPayload = payload

        if ( !(typeof toCheck.id === 'number') ) {
            return false
        }
        
        if ( !(typeof toCheck.level === 'string') ) {
            return false
        }

        return toCheck;
    } catch (error) {
        console.log(`[ERROR CHECK PAYLOAD] Can't parse to payload obj`); return false;
    }
}

/**
 * 
 */
export function getToken(payload:any, callback: (status:boolean, token:any) => any) {
    let checkedPayload = checkPayload(payload)
    if ( !checkedPayload ){
        console.log(`Bad form payload`); callback(false, `Bad form payload`); return;
    }
    callback(true, jwt.sign(payload, config.JWT_SECRET, { 'expiresIn': '1 week' })); return;
}

/**
 * 
 */
export function checkPasswords(clear_passwd: string, hash_passwd: string, payload: any, callback: (success: boolean, token: string) => any): void {
    bcrypt.compare(clear_passwd, hash_passwd, function (err: any, result: boolean) {
        if (err) {
            console.error(`[AUTH CHECK PASSWORD] Error: ${err}`); callback(false, `Internal error`); return;
        }
        if (!result) {
            callback(false, `Incorrect password`); return;
        }

        getToken(payload, (status:any, payload:any) => { callback(status, payload); return; }); return;
    })
}

/**
 * 
 */
export async function validateUser(token: string | undefined) {
    if (!isParamValid(token) || token == "") {
        console.error(`[AUTH VALIDATE USER] Token invalid. Received: ` + token); return false;
    }
    const full_token = token?.split(` `)[1];
    try {
        const data = await jwt.verify(full_token, config.JWT_SECRET); return true;
    } catch (error) {
        console.error(`[AUTH VALIDATE USER] Error: ` + error); return false;
    }
}

/**
 * 
 */
export function generatePasswordHash(password: string, callback: (status: boolean, hash: string) => any): void {
    bcrypt.hash(password, 10, function (err: any, hash: string) {
        if (err) {
            console.error(`[AUTH generatePasswordHash] Error with salt: ` + err); callback(false, err); return;
        }
        callback(true, hash); return;
    })
}