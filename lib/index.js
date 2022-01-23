"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("util");
var resources = (function () {
  function resources() {
  }
  resources.email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/i;
  resources.phone = /^\d{5,14}$/;
  resources.password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return resources;
}());
exports.resources = resources;
function initStatus(s) {
  var error = (s && s.error ? s.error : 0);
  var success = (s && s.success ? s.success : 1);
  var username = (s && s.username ? s.username : 2);
  var contact = (s && s.contact ? s.contact : 2);
  var format_username = (s && s.format_username ? s.format_username : -1);
  var format_contact = (s && s.format_contact ? s.format_contact : -2);
  var format_password = (s && s.format_password ? s.format_password : -3);
  return { error: error, success: success, username: username, contact: contact, format_username: format_username, format_contact: format_contact, format_password: format_password };
}
exports.initStatus = initStatus;
exports.initializeStatus = initStatus;
var SignupService = (function () {
  function SignupService(status, repository, generateId, comparator, passcodeComparator, passcodeRepository, send, gen, expires, validate, checkContact) {
    this.status = status;
    this.repository = repository;
    this.generateId = generateId;
    this.comparator = comparator;
    this.passcodeComparator = passcodeComparator;
    this.passcodeRepository = passcodeRepository;
    this.send = send;
    this.expires = expires;
    this.validate = validate;
    this.checkContact = checkContact;
    this.generate = gen;
    this.register = this.register.bind(this);
    this.signup = this.signup.bind(this);
    this.verify = this.verify.bind(this);
    this.check = this.check.bind(this);
    this.createConfirmCode = this.createConfirmCode.bind(this);
  }
  SignupService.prototype.register = function (info) {
    return this.signup(info);
  };
  SignupService.prototype.signup = function (info) {
    return __awaiter(this, void 0, void 0, function () {
      var errors, out, _i, errors_1, err, f, u, c, hashPassword, userId, ok, res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.validate) {
              errors = this.validate(info);
              if (errors && errors.length > 0) {
                out = false;
                for (_i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
                  err = errors_1[_i];
                  f = err.field;
                  if (f !== 'username' && f !== 'contact' && f !== 'password') {
                    out = true;
                  }
                  else {
                    if (f === 'username') {
                      return [2, this.status.format_username];
                    }
                    else if (f === 'contact') {
                      return [2, this.status.format_contact];
                    }
                    else if (f === 'password') {
                      return [2, this.status.format_password];
                    }
                  }
                }
                if (!out) {
                  return [2, { status: this.status.error, errors: errors }];
                }
              }
            }
            return [4, this.repository.checkUsername(info.username)];
          case 1:
            u = _a.sent();
            if (u) {
              return [2, this.status.username];
            }
            if (!this.checkContact) return [3, 3];
            return [4, this.checkContact(info.contact)];
          case 2:
            c = _a.sent();
            if (c) {
              return [2, this.status.contact];
            }
            _a.label = 3;
          case 3: return [4, this.comparator.hash(info.password)];
          case 4:
            hashPassword = _a.sent();
            info.password = hashPassword;
            userId = this.generateId();
            return [4, this.repository.save(userId, info)];
          case 5:
            ok = _a.sent();
            if (!ok) {
              return [2, this.status.error];
            }
            return [4, this.createConfirmCode(userId, info)];
          case 6:
            res = _a.sent();
            return [2, res ? this.status.success : this.status.error];
        }
      });
    });
  };
  SignupService.prototype.createConfirmCode = function (userId, info) {
    return __awaiter(this, void 0, void 0, function () {
      var codeSendToEmail, codeHashed, expiredAt, saved, sent, ok;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            codeSendToEmail = this.generate();
            return [4, this.passcodeComparator.hash(codeSendToEmail)];
          case 1:
            codeHashed = _a.sent();
            expiredAt = addSeconds(new Date(), this.expires);
            return [4, this.passcodeRepository.save(userId, codeHashed, expiredAt)];
          case 2:
            saved = _a.sent();
            if (saved <= 0) {
              return [2, false];
            }
            return [4, this.send(info.contact, codeSendToEmail, expiredAt, userId)];
          case 3:
            sent = _a.sent();
            if (!sent) return [3, 5];
            return [4, this.repository.verify(userId)];
          case 4:
            ok = _a.sent();
            if (ok) {
              return [2, true];
            }
            else {
              return [2, false];
            }
            return [3, 6];
          case 5: return [2, false];
          case 6: return [2];
        }
      });
    });
  };
  SignupService.prototype.verify = function (userId, code, password) {
    var _this = this;
    return this.check(userId, code).then(function (valid) {
      if (!valid) {
        return false;
      }
      else {
        if (!password || password.length === 0) {
          _this.passcodeRepository.delete(userId);
          return _this.repository.activate(userId);
        }
        else {
          return _this.comparator.hash(password).then(function (hashPassword) {
            _this.passcodeRepository.delete(userId);
            return _this.repository.activate(userId, hashPassword);
          });
        }
      }
    });
  };
  SignupService.prototype.check = function (userId, code) {
    var _this = this;
    return this.passcodeRepository.load(userId).then(function (pass) {
      if (after(new Date, pass.expiredAt)) {
        return false;
      }
      else {
        return _this.passcodeComparator.compare(code, pass.code);
      }
    });
  };
  return SignupService;
}());
exports.SignupService = SignupService;
exports.UserRegistrationService = SignupService;
function addSeconds(date, seconds) {
  var d = new Date(date);
  d.setSeconds(d.getSeconds() + seconds);
  return d;
}
exports.addSeconds = addSeconds;
function after(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }
  if (d1.getTime() - d2.getTime() > 0) {
    return true;
  }
  return false;
}
exports.after = after;
function generate(length, pad) {
  if (!length) {
    length = 6;
  }
  return padLeft(Math.floor(Math.random() * Math.floor(Math.pow(10, length) - 1)).toString(), length, pad);
}
exports.generate = generate;
function padLeft(str, length, pad) {
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
  var str2 = str;
  while (str2.length < length) {
    str2 = pad + str2;
  }
  return str2;
}
exports.padLeft = padLeft;
var Tel = (function () {
  function Tel() {
  }
  Tel.isPhone = function (str) {
    if (!str || str.length === 0 || str === '+') {
      return false;
    }
    if (str.charAt(0) !== '+') {
      return resources.phone.test(str);
    }
    else {
      var phoneNumber = str.substring(1);
      if (!resources.phonecodes) {
        return resources.phone.test(phoneNumber);
      }
      else {
        if (resources.phone.test(phoneNumber)) {
          for (var degit = 1; degit <= 3; degit++) {
            var countryCode = phoneNumber.substr(0, degit);
            if (countryCode in resources.phonecodes) {
              return true;
            }
          }
          return false;
        }
        else {
          return false;
        }
      }
    }
  };
  return Tel;
}());
exports.Tel = Tel;
exports.tel = Tel;
function isPhone(str) {
  return Tel.isPhone(str);
}
exports.isPhone = isPhone;
function isEmail(email) {
  if (!email || email.length === 0) {
    return false;
  }
  return resources.email.test(email);
}
exports.isEmail = isEmail;
function isUsername(u) {
  if (isEmail(u)) {
    return true;
  }
  if (isPhone(u)) {
    return true;
  }
  var v = u + '@gmail.com';
  return isEmail(v);
}
exports.isUsername = isUsername;
function isPassword(password) {
  return resources.password.test(password);
}
exports.isPassword = isPassword;
var Validator = (function () {
  function Validator(checkUsername, checkContact, passwordRequired, min, max) {
    this.max = max;
    this.min = (min !== undefined && min != null ? min : 6);
    this.passwordRequired = (passwordRequired !== undefined && passwordRequired != null ? passwordRequired : true);
    this.checkUsername = (checkUsername ? checkUsername : isUsername);
    this.checkContact = (checkContact ? checkContact : isEmail);
    this.validate = this.validate.bind(this);
  }
  Validator.prototype.validate = function (u) {
    var errs = [];
    if (!this.checkUsername(u.username)) {
      errs.push({ field: 'username', code: 'username', message: 'username is not valid' });
    }
    else {
      if (u.username.length < this.min) {
        errs.push({ field: 'username', code: 'username', message: 'username must have at least ' + this.min + 'characters' });
      }
      else if (this.max && u.username.length > this.max) {
        errs.push({ field: 'username', code: 'username', message: 'username must be less than ' + this.max + 'characters' });
      }
    }
    if (!this.checkContact(u.contact)) {
      errs.push({ field: 'contact', code: 'contact', message: 'contact is not valid' });
    }
    if (this.passwordRequired) {
      if (!isPassword(u.password)) {
        errs.push({ field: 'password', code: 'password', message: 'password is not valid' });
      }
    }
    return errs;
  };
  return Validator;
}());
exports.Validator = Validator;
exports.SignupValidator = Validator;
exports.UserRegistrationValidator = Validator;
var MailSender = (function () {
  function MailSender(url, sendMail, from, data, subject) {
    this.url = url;
    this.sendMail = sendMail;
    this.from = from;
    this.data = data;
    this.subject = subject;
    this.send = this.send.bind(this);
  }
  MailSender.prototype.send = function (to, passcode, expireAt, params) {
    var confirmUrl = buildConfirmUrl(this.url, params, passcode);
    var diff = Math.abs(Math.round(((Date.now() - expireAt.getTime()) / 1000) / 60));
    var body = util.format.apply(util, __spreadArrays([this.data], [confirmUrl, confirmUrl, confirmUrl, diff, confirmUrl, confirmUrl, confirmUrl, diff]));
    var msg = {
      to: to,
      from: this.from,
      subject: this.subject,
      html: body
    };
    return this.sendMail(msg);
  };
  return MailSender;
}());
exports.MailSender = MailSender;
exports.EmailSender = MailSender;
exports.SignupSender = MailSender;
function buildConfirmUrl(url, userId, passcode) {
  return url + "/" + userId + "/" + passcode;
}
exports.buildConfirmUrl = buildConfirmUrl;
