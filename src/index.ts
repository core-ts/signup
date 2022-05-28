import * as util from 'util';

export interface Phones {
  [key: string]: string;
}
// tslint:disable-next-line:class-name
export class resources {
  static phonecodes?: Phones;
  static email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/i;
  static phone = /^\d{5,14}$/;
  static password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  static isPhone(str: string|null|undefined): boolean {
    if (!str || str.length === 0 || str === '+') {
      return false;
    }
    if (str.charAt(0) !== '+') {
      return resources.phone.test(str);
    } else {
      const phoneNumber = str.substring(1);
      if (!resources.phonecodes) {
        return resources.phone.test(phoneNumber);
      } else {
        if (resources.phone.test(phoneNumber)) {
          for (let degit = 1; degit <= 3; degit++) {
            const countryCode = phoneNumber.substr(0, degit);
            if (countryCode in resources.phonecodes) {
              return true;
            }
          }
          return false;
        } else {
          return false;
        }
      }
    }
  }
}
export interface User {
  username: string;
  password: string;
  contact: string;
  /*
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  givenName?: string;
  middleName?: string;
  familyName?: string;
  */
}
export type Info = User;
export type Signup = User;
export interface ErrorMessage {
  field: string;
  code: string;
  message?: string;
}
export interface Result {
  status: number|string;
  errors?: ErrorMessage[];
  message?: string;
}
export interface Status {
  success: string|number;
  username: string|number;
  contact: string|number;
  error: string|number;
  format_username: string|number;
  format_contact: string|number;
  format_password: string|number;
}
export interface StatusConf {
  error?: string|number;
  success?: string|number;
  username?: string|number;
  contact?: string|number;
  format_username: string|number;
  format_contact: string|number;
  format_password: string|number;
}
export function initStatus(s?: StatusConf): Status {
  const error: number | string = (s && s.error ? s.error : 0);
  const success: number | string = (s && s.success ? s.success : 1);
  const username: number | string = (s && s.username ? s.username : 2);
  const contact: number | string = (s && s.contact ? s.contact : 2);
  const format_username: number | string = (s && s.format_username ? s.format_username : -1);
  const format_contact: number | string = (s && s.format_contact ? s.format_contact : -2);
  const format_password: number | string = (s && s.format_password ? s.format_password : -3);
  return { error, success, username, contact, format_username, format_contact, format_password };
}
export const initializeStatus = initStatus;
export interface UserStatus {
  registered: string;
  codeSent: string;
  activated: string;
}
export interface FieldConfig {
  username?: string;
  contact?: string;
  password?: string;
  status?: string;
  maxPasswordAge?: string;
}
export interface Track {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  version?: string;
}
export interface StringMap {
  [key: string]: string;
}
export interface SignupConf {
  status?: StatusConf;
  expires: number;
  userStatus: UserStatus;
  maxPasswordAge?: number;
  map?: StringMap;
  track?: Track;
  fields?: FieldConfig;
  url: string;
}
export interface Template {
  subject: string;
  body: string;
}
export interface SignupTemplateConfig extends SignupConf {
  template: Template;
}
export interface SignupTemplateConf {
  email: Template;
  user?: string;
  password?: string;
}
export interface SignupConfig {
  user?: string;
  password?: string;
}
export interface SignupUrlConfig {
  expires: number;
  domain: string;
  port: number;
  secure: string;
}
export type SignupConfirmUrlConfig = SignupUrlConfig;
export interface Repository<ID, T extends User> {
  checkUsername(username: string): Promise<boolean>;
  checkContact(contact: string): Promise<boolean>;
  save(id: ID, info: T): Promise<boolean>;
  verify(id: ID): Promise<boolean>;
  activate(id: ID, password?: string): Promise<boolean>;
}
export interface Comparator {
  compare(data: string, encrypted: string): Promise<boolean>;
  hash(plaintext: string): Promise<string>;
}
export interface Passcode {
  expiredAt: Date;
  code: string;
}
export interface PasscodeRepository<ID> {
  save(id: ID, passcode: string, expireAt: Date): Promise<number>;
  load(id: ID): Promise<Passcode>;
  delete(id: ID): Promise<number>;
}
/*
export interface PasscodeSender {
  send(to: string, passcode: string, expireAt: Date, params: any): Promise<boolean>;
}
export interface PasscodeGenerator {
  generate(): string;
}
export interface Validator {
  validate(model: any): ErrorMessage[];
}
*/
// tslint:disable-next-line:max-classes-per-file
export class SignupService<ID, T extends User> {
  constructor(
    public status: Status,
    public repository: Repository<ID, T>,
    public generateId: () => ID,
    public comparator: Comparator,
    public passcodeComparator: Comparator,
    public passcodeRepository: PasscodeRepository<ID>,
    public send: (to: string, passcode: string, expireAt: Date, params?: any) => Promise<boolean>,
    public expires: number,
    public validate?: (model: User) => ErrorMessage[],
    public checkContact?: (username: string) => Promise<boolean>,
    gen?: () => string,
  ) {
    this.generate = (gen ? gen : generate);
    this.register = this.register.bind(this);
    this.signup = this.signup.bind(this);
    this.verify = this.verify.bind(this);
    this.check = this.check.bind(this);
    this.createConfirmCode = this.createConfirmCode.bind(this);
  }
  generate: () => string;
  register(info: T): Promise<Result|string|number> {
    return this.signup(info);
  }
  async signup(info: T): Promise<Result|string|number> {
    if (this.validate) {
      const errors = this.validate(info);
      if (errors && errors.length > 0) {
        let out = false;
        for (const err of errors) {
          const f = err.field;
          if (f !== 'username' && f !== 'contact' && f !== 'password') {
            out = true;
          } else {
            if (f === 'username') {
              return this.status.format_username;
            } else if (f === 'contact') {
              return this.status.format_contact;
            } else if (f === 'password') {
              return this.status.format_password;
            }
          }
        }
        if (!out) {
          return { status: this.status.error, errors };
        }
      }
    }

    const u = await this.repository.checkUsername(info.username);
    if (u) {
      return this.status.username;
    }
    if (this.checkContact) {
      const c = await this.checkContact(info.contact);
      if (c) {
        return this.status.contact;
      }
    }
    const hashPassword = await this.comparator.hash(info.password);
    info.password = hashPassword;

    const userId = this.generateId();
    const ok = await this.repository.save(userId, info);

    if (!ok) {
      return this.status.error;
    }

    const res = await this.createConfirmCode(userId, info);
    return res ? this.status.success : this.status.error;
  }

  private async createConfirmCode(userId: ID, info: User): Promise<boolean> {
    const codeSendToEmail = this.generate();
    const codeHashed = await this.passcodeComparator.hash(codeSendToEmail);

    const expiredAt = addSeconds(new Date(), this.expires);
    const saved = await this.passcodeRepository.save(userId, codeHashed, expiredAt);
    if (saved <= 0) {
      return false;
    }

    const sent = await this.send(info.contact, codeSendToEmail, expiredAt, userId);
    if (sent) {
      const ok = await this.repository.verify(userId);
      if (ok) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  verify(userId: ID, code: string, password?: string): Promise<boolean> {
    return this.check(userId, code).then(valid => {
      if (!valid) {
        return false;
      } else {
        if (!password || password.length === 0) {
          this.passcodeRepository.delete(userId);
          return this.repository.activate(userId);
        } else {
          return this.comparator.hash(password).then(hashPassword => {
            this.passcodeRepository.delete(userId);
            return this.repository.activate(userId, hashPassword);
          });
        }
      }
    });
  }
  private check(userId: ID, code: string): Promise<boolean> {
    return this.passcodeRepository.load(userId).then(pass => {
      if (after(new Date, pass.expiredAt)) {
        return false;
      } else {
        return this.passcodeComparator.compare(code, pass.code);
      }
    });
  }
}
export const UserRegistrationService = SignupService;
export function addSeconds(date: Date, seconds: number) {
  const d = new Date(date);
  d.setSeconds(d.getSeconds() + seconds);
  return d;
}
export function after(d1?: Date, d2?: Date): boolean {
  if (!d1 || !d2) {
    return false;
  }
  if (d1.getTime() - d2.getTime() > 0) {
    return true;
  }
  return false;
}

export function generate(length?: number, pad?: string): string {
  if (!length) {
    length = 6;
  }
  return padLeft(Math.floor(Math.random() * Math.floor(Math.pow(10, length) - 1)).toString(), length, pad);
}
export function padLeft(str: string, length: number, pad?: string) {
  if (!str) {
    return str;
  }
  if (typeof str !== 'string') {
    str = '' + str;
  }
  if (str.length >= length) {
    return str;
  }
  if (!pad) {
    pad = '0';
  }
  let str2 = str;
  while (str2.length < length) {
    str2 = pad + str2;
  }
  return str2;
}
export function isPhone(str: string|null|undefined): boolean {
  return resources.isPhone(str);
}
export function isEmail(email: string|null|undefined): boolean {
  if (!email || email.length === 0) {
    return false;
  }
  return resources.email.test(email);
}
export function isUsername(u: string|null|undefined): boolean {
  if (isEmail(u)) {
    return true;
  }
  if (isPhone(u)) {
    return true;
  }
  const v = u + '@gmail.com';
  return isEmail(v);
}
export function isPassword(password: string): boolean {
  return resources.password.test(password);
}
// tslint:disable-next-line:max-classes-per-file
export class Validator<T extends User> {
  min: number;
  passwordRequired: boolean;
  checkContact: (u: string|null|undefined) => boolean;
  checkUsername: (u: string|null|undefined) => boolean;
  constructor(checkUsername?: (u: string|null|undefined) => boolean, checkContact?: (u: string|null|undefined) => boolean, passwordRequired?: boolean, min?: number, public max?: number) {
    this.min = (min !== undefined && min != null ? min : 6);
    this.passwordRequired = (passwordRequired !== undefined && passwordRequired != null ? passwordRequired : true);
    this.checkUsername = (checkUsername ? checkUsername : isUsername);
    this.checkContact = (checkContact ? checkContact : isEmail);
    this.validate = this.validate.bind(this);
  }
  validate(u: T): ErrorMessage[] {
    const errs: ErrorMessage[] = [];
    if (!this.checkUsername(u.username)) {
      errs.push({field: 'username', code: 'username', message: 'username is not valid'});
    } else {
      if (u.username.length < this.min) {
        errs.push({field: 'username', code: 'username', message: 'username must have at least ' + this.min + 'characters'});
      } else if (this.max && u.username.length > this.max) {
        errs.push({field: 'username', code: 'username', message: 'username must be less than ' + this.max + 'characters'});
      }
    }
    if (!this.checkContact(u.contact)) {
      errs.push({field: 'contact', code: 'contact', message: 'contact is not valid'});
    }
    if (this.passwordRequired) {
      if (!isPassword(u.password)) {
        errs.push({field: 'password', code: 'password', message: 'password is not valid'});
      }
    }
    return errs;
  }
}
export const SignupValidator = Validator;
export const UserRegistrationValidator = Validator;
export type EmailData = string|{ name?: string; email: string; };
export interface MailContent {
  type: string;
  value: string;
}
export interface MailData {
  to?: EmailData|EmailData[];

  from: EmailData;
  replyTo?: EmailData;

  subject?: string;
  html?: string;
  content?: MailContent[];
}

// tslint:disable-next-line:max-classes-per-file
export class MailSender {
  constructor(
    public url: string,
    public sendMail: (mailData: MailData) => Promise<boolean>,
    public from: EmailData,
    public data: string,
    public subject: string
  ) {
    this.send = this.send.bind(this);
  }
  send(to: string, passcode: string, expireAt: Date, params?: any): Promise<boolean> {
    const confirmUrl = buildConfirmUrl(this.url, params as string, passcode);
    const diff =  Math.abs(Math.round(((Date.now() - expireAt.getTime()) / 1000) / 60));
    const body = util.format(this.data, ...[confirmUrl, confirmUrl, confirmUrl, diff, confirmUrl, confirmUrl, confirmUrl, diff]);
    const msg = {
      to,
      from: this.from,
      subject: this.subject,
      html: body
    };
    return this.sendMail(msg);
  }
}
export const EmailSender = MailSender;
export const SignupSender = MailSender;
export function buildConfirmUrl(url: string, userId: string, passcode: string): string {
  // return `${this.config.secure ? 'https' : 'http'}://${this.config.domain}${port}/signup/verify/${userId}/${passcode}`;
  return `${url}/${userId}/${passcode}`;
}
