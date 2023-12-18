export const swaggerConfig = {
    swaggerDefinition: {
        info: {
            title: 'Technical knowledge',
            description: 'API básica con NodeJS, Express y MySQL',
            version: '1.0.1',
        },
        host: 'http:localhost:3030',
        basePath: '/api',
        produces: [ "application/json", "application/xml" ],
        schemes: ['http', 'https'],
        securityDefinitions: {
        }
    },
    basedir: __dirname,
    files: ['./controller/*.*', './models/*.*']
};