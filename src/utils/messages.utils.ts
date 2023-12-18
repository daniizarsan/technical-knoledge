/**
 * Sends a response with a successful status code (default 200) and a message.
 * @param res - The Express response object.
 * @param code - Optional HTTP status code to send. Default is 200.
 * @param message - Optional message to send in the JSON response. Default is 'OK'.
 */
export const sendOk = (res: any, code?: number, message?: any): void => {
    res.status(code || 200).json(message || 'OK');
};

/**
 * Sends a response with a bad parameter error status code (400) and a message.
 * @param res - The Express response object.
 */
export const sendBadParam = (res: any, message?: any): void => {
    res.status(400).json({ message: message || 'Bad parameter' });
};

/**
 * Sends a response with an unauthorized error status code (401) and a message.
 * @param res - The Express response object.
 */
export const sendUnauthorized = (res: any, message?: any): void => {
    res.status(401).json({ message: message||'Unauthorized' });
};

/**
 * Sends a response with a forbidden error status code (403) and a message.
 * @param res - The Express response object.
 */
export const sendForbidden = (res: any): void => {
    res.status(403).json({ message: 'Forbidden' });
};

/**
 * Sends a response with a not found error status code (404) and a message.
 * @param res - The Express response object.
 */
export const sendNotFound = (res: any, message?:any): void => {
    res.status(404).json({ message: message|| 'Not found' });
};

/**
 * Sends a response with a not found error status code (409) and a message.
 * @param res - The Express response object.
 */
export const sendConflict = (res: any, message?: any): void => {
    res.status(409).json({ message: message || 'Conflict' });
};

/**
 * Sends a response with a server error status code (500) and a message.
 * @param res - The Express response object.
 */
export const sendServerError = (res: any): void => {
    res.status(500).json({ message: 'Internal server error' });
};

/**
 * Sends a response with a server error status code (500) and a message.
 * @param code - Control the status code.
 * @param res - The Express response object.
 */
export const controlResponse = (code: any, res: any,message=null): void => {
    switch (code) {
        case 200: case 201: case 202: case true: break;
        case 400: sendBadParam(res,message); break;
        case 401: sendUnauthorized(res); break;
        case 403: sendForbidden(res); break;
        case 404: sendNotFound(res); break;
        case 409: sendForbidden(res); break;
        case 500: case false: sendServerError(res); break;
        default: console.log(`Default response - ${code}`); sendServerError(res); break;
    }
};
