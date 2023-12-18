import fs from "fs";
import config from '@config';

/**
 * Genera un nombre de archivo aleatorio con la extensión del archivo proporcionado.
 * @param {string} fileName - El nombre del archivo original con su extensión.
 * @returns {string} - El nombre generado para el archivo con una extensión.
 */
function getRandomFileName(fileName: string): string {
    const extension = fileName.split('.').pop();

    return `${Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)}.${extension}`;
}

/**
 * Guarda una imagen en el directorio público especificado en la configuración.
 * @param {Object} image - El objeto de imagen que contiene los datos de la imagen y su tipo de contenido.
 * @param {Function} callback - La función de devolución de llamada que maneja la respuesta de la operación.
 * @returns {void}
 */
export function saveImage(image:any, callback:Function):void {
    if (!config.ALLOWED_IMAGE.includes(image.mimetype)) {
         callback(false, 400); return;
    }

    const randomName = getRandomFileName(image.name);
    fs.writeFile(`${config.PUBLIC_PATH}/${randomName}`, image.data, (err:any) => {
        if ( err ) {
            console.log("FS Save - Error:", err); callback(false, 500); return;
        }

        callback(true, randomName); return;
    })
}

/**
 * Elimina una imagen del directorio público especificado en la ruta proporcionada.
 * @param {string} imagePath - La ruta de la imagen que se eliminará.
 * @param {Function} callback - La función de devolución de llamada que maneja la respuesta de la operación.
 * @returns {void}
 */
export function deleteImage(imagePath:string, callback:Function):void {
    fs.exists(`${config.PUBLIC_PATH}/public/${imagePath}`, (err: any) => {
        if (err) { callback(false, 404); return; }

        fs.unlink(`${config.PUBLIC_PATH}/${imagePath}`, (err:any) => {
            if (err) { 
                if ( err['syscall'] == 'unlink' ) { console.error(`FS DELETE - Error: Can't unlink file. ${err['path']}`); callback(true, 500); return; }
                else { console.error(`FS DELETE - Error: ${err}`); callback(true, 500); return; }
            }
            callback(true, "Ok.");
        });
    });

}