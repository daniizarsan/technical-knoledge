import { Validation } from "@models/validation";
/**
 * validates different parameters from an object
 * @param {Array<Validation>} keys 
 * @param {any} obj 
 * @returns {object} true 200 - CORRECT
 * @returns {object} false 400 - msg ( error message )
 */
export function validateParams(keys: Array<Validation>, obj: object, body: boolean = true) {
    let columnas = [];
    let valores = [];
    for (const validation of keys) {
        let c: any = body ? obj['body'][validation.key] : obj[validation.key]
        if (validation.required) {
            if (c == null || c == undefined) return [false, `The parameter ${validation.key} must be defined`]
        };

        if (c == null || c == undefined) continue;

        switch (validation.type) {
            case "string":
                if (c == '') { return [false, `The parameter ${validation.key} is empty`] };

                switch (validation.rule) {
                    case "NOSPACES": if (c.split(" ").length != 1) { return [false, `There can no be spaces in the ${validation.key}`] }
                    case "MAIL":
                        let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                        if (!c.match(regexEmail)) { return [false, `The mail is badly compose`] }; break;
                    case "ENUM": if (!(c in validation.enum)) { return [false, `Problem with the param ${validation.key}`] } break;
                }
                break;
            case "object":
                if (c == null) { [false, `The parameter ${validation.key} must be an object`] }

                switch (validation.rule) {
                    case "ARRAY": if (c == undefined || !Array.isArray(c)) { return [false, `The parameter ${validation.key} must be an array and can´t be empty`] }
                }
                break;
            case "number":
                if (isNaN(c)) { return [false, `The parameter ${validation.key} must be a number`] }; break;
        }

        columnas.push(validation.key);
        valores.push(c);
    }


    let col: any = columnas.filter((value, index) => valores[index] !== '' && valores[index] !== null && valores[index] !== undefined && valores[index].toString().toUpperCase() !== 'NULL');
    let val: any = valores.filter(value => value !== '' && value !== null && value !== undefined && value.toString().toUpperCase() !== 'NULL');

    return [true, 'OK', col, val]
}

/**
 * validate if id is positive number
 * @param {any} id 
 * @returns {boolean} true 
 * @returns {boolean} false 
 */
export function validateID(id: any) {
    if (id > 0) {
        return true
    }
    return false
}