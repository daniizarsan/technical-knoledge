import db from '@database';

/**
 * Función para la abstracción de hacer consultas genéricas
 * 
 * @param name_table La columna sobre la que ejecutar la consulta
 * @param columna Las claves de los filtros
 * @param valor Los valores de los filtros
 * @param callback La función a llamar con el resultado de la consulta
 */
export function query(query:string, callback:Function): void {
    db.query(query, (err:any, result:any) => {
        if (!err) { callback(true, result); return; }

        rollback(); console.log(`[DATABASE] Error trying to make a QUERY.\nQUERY: ${query}\nERROR: ${err}`); callback(false, err); return;
    });
}

export function startTransaction(){
    db.query(`START TRANSACTION`)
}

export function commit(){
    db.query(`COMMIT`)
}

export function rollback(){
    db.query(`ROLLBACK`)
}

/**
 * Función para la abstracción de las consultas Select
 * 
 * @param tableName La columna sobre la que ejecutar la consulta
 * @param columna Las claves de los filtros
 * @param valor Los valores de los filtros
 * @param callback La función a llamar con el resultado de la consulta
 */
export function select(tableName:string, columna:string[], valor:string[], callback:Function): void {
    const query = 'SELECT * FROM ' + tableName + checkValuesAndAssign(columna, valor);
    db.query(query, (err:any, result:any) => {
        if (!err) { callback(true, result); return; }

        rollback(); console.log(`[DATABASE] Error trying to make a SELECT.\nQUERY: ${query}\nERROR: ${err}`); callback(false, err); return;
    });
}

/**
 * Función para la abstracción de las consultas Insert
 * 
 * @param tableName Nombre de la tabla sobre la que ejecutar el insert
 * @param columna Nombre de los campos donde insertar los valores
 * @param valor Los valores a insertar en los campos
 * @param callback La función a llamar pasándole el resultado dela consulta
 */
export function insert(tableName:string, columna:string[], valor:string[], callback:Function): void {
    let query = `INSERT INTO ${tableName} (`;
    let values = 'values (';

    if (columna.length > 0 && valor.length > 0 && columna.length == valor.length) {
        for (let i = 0; i < columna.length; i++) {
            query += ((i !== 0) ? ', ' : ' ') + columna[i];
            values += ((i !== 0) ? `', '` : ` '`) + valor[i];
            
        }
        query += `) ${values}')`;
        query = query.replace(/'null'/g, "null");
        
        db.query(query, (err:any, result:any) => {
            if (!err) { callback(true, result, result.insertId); return; }

            rollback(); console.log(`[DATABASE] Error trying to make a INSERT.\nQUERY: ${query}\nERROR: ${err}`); callback(false, err); return;
        });
    }
}

/**
 * Función para la abstracción de las consultas update
 * 
 * @param tableName Nombre de la tabla sobre la que ejecutar el update
 * @param dataCol Los campos los cuales se quieren modificar
 * @param dataVal Los nuevos datos a asignar a los campos
 * @param filterCol Los campos que se van a usar en las condiciones where
 * @param filterVal Los valores de esas condiciones
 * @param callback La función a llamar pasándole por parámetro el resultado de la consulta
 */
export function update(tableName:string, dataCol:string[], dataVal:string[], filterCol:string[], filterVal:string[], callback:Function): void {
    let query = 'UPDATE ' + tableName;

    let update = '';

    if ( !(dataCol.length > 0 && dataVal.length > 0 && dataCol.length == dataVal.length)) {
        console.log(`[ ERROR UPDATE ] Set params and values bad form`); callback(false, `Set params and values bad form`);
    }

    update += ' SET';

    for (let i = 0; i < dataCol.length; i++) {
        update += ((i !== 0) ? ', ' : ' ') + dataCol[i] + '= "' + dataVal[i] + '"';
    }

    query += update + checkValuesAndAssign(filterCol, filterVal);
    db.query(query, (err:any, result:any) => {
        if (!err) { callback(true, result); return; }

        rollback(); console.log(`[DATABASE] Error trying to make a UPDATE.\nQUERY: ${query}\nERROR: ${err}`); callback(false, err); return;
    });
}

/**
 * Función para la abstracción de las consultas delete
 * 
 * @param tableName El nombre de la tabla en la que ejecutar el delete
 * @param columna El nombre de los campos sobre los que se va a filtrar
 * @param valor El valor de esos filtros
 * @param callback La función a ejecutar con el resultado de la columna
 */
export function deleteField(tableName:string, columna:string[], valor:string[], callback:Function): void {
    const query = 'DELETE FROM ' + tableName + checkValuesAndAssign(columna, valor);

    db.query(query, (err:any, result:any) => {
        if (!err) { callback(true, result); return; }

        rollback(); console.log(`[DATABASE] Error trying to make a DELETE.\nQUERY: ${query}\nERROR: ${err}`); callback(false, err); return;
    });
}

/**
 * Función de apoyo para crear la parte WHERE resultante
 * 
 * @param columna Los campos sobre los que se va a realizar el filtro
 * @param valor Los valores de esos filtros
 * @returns Una cadena con el WHERE
 */
function checkValuesAndAssign(columna:string[], valor:string[]):string {
    let where = '';

    if (columna.length > 0 && valor.length > 0 && columna.length == valor.length) {
        where += ' WHERE';

        for (let i = 0, j=0; i < columna.length; i++) {
            if (valor[i]!=null){
                where += ((j !== 0) ? ' AND ' : ' ') + columna[i] + ` = '` + valor[i]+`'`;
                j++;
            }
        }
    }

    return where;
}