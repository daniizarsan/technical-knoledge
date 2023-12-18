import { Base } from "./base";
import { Validation } from "./validation";

/**
 * @typedef UserHome
 * @property {Number} id_user - Field id_user of the HOME
 * @property {Number} id_home - Field lastname of the HOME
 */

interface IUserHome {
  id_user?: Number;
  id_home?: Number;
}

export class UserHome extends Base {
  constructor(user_home: IUserHome) {
    super("user_home", user_home)
  }

  assignValues(required = false) {
    let keys: any = [];

    keys.push(new Validation('id_user', 'Number', required));
    keys.push(new Validation('id_home', 'Number', required));

    return keys;
  }

}