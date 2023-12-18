import { Base } from "./base";
import { Validation } from "./validation";

/**
 * @typedef Home
 * @property {number} id - Fieñd id of the HOME
 * @property {string} address - Field address of the HOME
 * @property {string} alias - Field lastname of the HOME
 * @property {string} type - Field lastname of the HOME
 * @property {string} id_country - Field lastname of the HOME
 */

interface IHome {
  id?: number;
  address?: string;
  alias?: string;
  type?: TypeHome;
  id_country?: string;
}
export enum TypeHome {
  PISO = 'piso',
  CHALET = 'chalet',
  DUPLEX = 'dúplex',
  ESTUDIO = 'estudio'
}

export class Home extends Base {
  constructor(home: IHome) {
    super("home", home)
  }

  assignValues(required = false) {
    let keys: any = [];

    keys.push(new Validation('id', 'number'));
    keys.push(new Validation('address', 'string', required));
    keys.push(new Validation('alias', 'string'));
    keys.push(new Validation('type', 'string', required));
    keys.push(new Validation('id_country', 'number', required));

    return keys;
  }

}