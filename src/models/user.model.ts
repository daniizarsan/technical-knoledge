import { Base } from "./base";
import { Validation } from "./validation";

/**
 * @typedef User
 * @property {number} id - Field id of the USER
 * @property {string} name - Field name of the USER
 * @property {string} lastname - Field lastname of the USER
 */

interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
}

export class User extends Base {
  constructor(user: IUser) {
    super("user", user)
  }

  assignValues(required = false) {
    let keys: any = [];

    keys.push(new Validation('id', 'number'));
    keys.push(new Validation('name', 'string', required));
    keys.push(new Validation('lastname', 'string', required));

    return keys;
  }

}