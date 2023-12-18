import { sendBadParam } from "./messages.utils";

export const forbiddenChars = [`'`, `"`, `;`, `-`, `/`, `*`, `#`, `+`, `=`, `%`, `|`, `|`]
export const forbbidenCharsUnicode = unicodeChars();


function transformRoute(route, excludedRoutes) {
    let routeFormated = '/'
    const routeParts = route.split('/').filter(elemento => elemento !== '');

    let newRoute = '';
    for (const excludedRoute of excludedRoutes) {
        newRoute = '';

        const excludedRouteParts = excludedRoute.split('/').filter(elemento => elemento !== '');

        for (let i = 0; i < excludedRouteParts.length; i++) {
            if(excludedRouteParts[i] == routeParts[i]){
                newRoute +='/'+ excludedRouteParts[i];
            }
            if (excludedRouteParts[i] !== routeParts[i]) {
                if (!excludedRouteParts[i]?.startsWith(':') && !routeParts[i]?.startsWith(':')) {
                    continue;
                }
                newRoute +='/'+ excludedRouteParts[i];
            }
        }
        if( newRoute == excludedRoute){
            break;
        }
    }
    return newRoute;
}

function unicodeChars() {
    let forbbidenCharsUnicode = [];
    for (let i in forbiddenChars) {
        const unicode = forbiddenChars[i].charCodeAt(0);

        const hexadecimalValue = unicode.toString(16).toUpperCase();
        forbbidenCharsUnicode.push(`\\\\u00` + hexadecimalValue);
    }
    return forbbidenCharsUnicode;
}

export const generalInvalidParams = (req: any, res: any, next: any) => {
    for (let i in req.body) {
        if (typeof req.body[i] != 'string') { continue; }
        for (let j in forbiddenChars) {
            if (typeof req.body[i] != 'string') { continue; }
            if (req.body[i].includes(forbiddenChars[j])) {
                sendBadParam(res, `Param ${i} bad form. Problem with character ${forbiddenChars[j]}`); return;
            }
        }
    }

    for (let i in req.params) {
        for (let j in forbiddenChars) {
            if (typeof req.body[i] != 'string') { continue; }
            if (req.params[i].includes(forbiddenChars[j])) {
                sendBadParam(res, `Param ${i} bad form. Problem with character ${forbiddenChars[j]}`); return;
            }
        }
    }

    for (let i in req.query) {
        for (let j in forbiddenChars) {
            if (typeof req.body[i] != 'string') { continue; }
            if (req.query[i].includes(forbiddenChars[j])) {
                sendBadParam(res, `Param ${i} bad form. Problem with character ${forbiddenChars[j]}`); return;
            }
        }
    }
    next();
};

export const individualInvalidParams = (req: any, res: any, next: any, checkAndNotForbidden: any, checkAndReplace) => {
    for (let element in req.body) {
        if (typeof req.body[element] != 'string') { continue; }
        for (let index in forbiddenChars) {
            if ((checkAndReplace.includes(element)) && req.body[element].includes(forbiddenChars[index])) {
                req.body[element] = req.body[element].replaceAll(forbiddenChars[index], forbbidenCharsUnicode[index]);
            } else if (checkAndNotForbidden.includes(element)) {
                continue;
            }
            else if (req.body[element].includes(forbiddenChars[index])) {
                sendBadParam(res, `Param ${element} bad form. Problem with character ${forbiddenChars[index]}`); return;
            }
        }
    }
    next();
}


/**
 * 
 * checkAndNotForbidden - check if the param is in the array and if it is, don´t check if it has forbidden chars
 * checkAndReplace - check if the param is in the array and if it is, change the forbbiden char for the unicode char
 */
export const checkInvalidChars = (req: any, res: any, next: any) => {
    const excludedRoutes = [
        { path: '/api/advice', checkAndNotForbidden: [], checkAndReplace: ['title', 'description'] },
        { path: '/api/register', checkAndNotForbidden: ['password', 'birthdate'], checkAndReplace: ['email', 'description'] },
    ];

    const { path } = req;

    const formattedRoute = transformRoute(path, excludedRoutes.map(route => route.path).filter(route => /:/.test(route)));

    if (excludedRoutes.map(route => route.path).includes(path)) {
        const index = excludedRoutes.map(route => route.path).indexOf(path);
        return individualInvalidParams(req, res, next, excludedRoutes[index].checkAndNotForbidden, excludedRoutes[index].checkAndReplace);
    } else if (excludedRoutes.map(route => route.path).includes(formattedRoute)) {
        const index = excludedRoutes.map(route => route.path).indexOf(formattedRoute);
        return individualInvalidParams(req, res, next, excludedRoutes[index].checkAndNotForbidden, excludedRoutes[index].checkAndReplace);
    }

    generalInvalidParams(req, res, next);

};