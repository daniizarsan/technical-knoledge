export class Validation {
  key: string;
  type: any;
  required: boolean;
  rule: string;
  enum: any;
  constructor(key: string, type: any, required = false, rule?: string, enumerator?: any) {
    this.key = key;
    this.type = type;
    this.required = required;
    this.rule = rule;
    this.enum = enumerator
  }
}