
import { deleteField, insert, select, update } from "@queries";
import { validateParams } from "@utils/params.utils";

export class Base {
  protected name_table: string;
  protected obj: object;

  protected assignValues(required = false): any {
    throw new Error('Method not implemented.');
  }

  constructor(name_table: string, obj: object) {
    this.name_table = name_table;
    this.obj = obj;
  }

  getAll(cb: Function): void {
    select(this.name_table, [], [], (status: boolean, result: any) => {
      cb(status ? 200 : 500, result);
    });
  }

  add(cb: Function): void {
    let [status, message, c, v] = validateParams(this.assignValues(true), this.obj, false);
    if (!status) { cb(400, message); return; }

    let columna: any = c, valores: any = v;
    insert(this.name_table, columna, valores, (status: boolean, result: any, insertID: any) => {
      cb(status ? 201 : 500, result, insertID);
    });
  }

  select(cb: Function): void {
    let [status, message, c, v] = validateParams(this.assignValues(), this.obj, false);
    if (!status) { cb(400, message); return; }

    let columna: any = c, valores: any = v;
    select(this.name_table, columna, valores, (status: boolean, result: any) => {
      cb(status ? (result.length ? 200 : 404) : 500, result);
    });
  }

  delete(cb: Function): void {
    let [status, message, c, v] = validateParams(this.assignValues(), this.obj, false);
    if (!status) { cb(400, message); return; }

    let columna: any = c, valores: any = v;
    deleteField(this.name_table, columna, valores, (status: boolean, result: any) => {
      cb(status ? 202 : 500, result);
    });
  }

  updateByID(cb: Function): void {
    let [status, message, c, v] = validateParams(this.assignValues(), this.obj, false);
    if (!status) { cb(400, message); return; }

    let columna: any = c, valores: any = v;

    update(this.name_table, columna, valores, ['id'], [this.obj['id']], (status: boolean, result: any) => {
      cb(status ? 200 : 500, result);
    });
  }

  update(oldata: any, cb: Function): void {
    let keys = this.assignValues()
    let [status, message, c, v] = validateParams(this.assignValues(), this.obj, false);
    //let [status, message, cf, vf] = validateParams(this.assignValues(), oldata, false);
    if (!status) { cb(400, message); return; }

    let columna: any = c, valores: any = v;
    update(this.name_table, columna, valores, columna, oldata, (status: boolean, result: any) => {
      cb(status ? 202 : 500, result);
    });
  }
}