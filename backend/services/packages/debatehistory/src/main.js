"use strict";
// import awsExportsJs from './aws-exports.js';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var _this = this;
exports.__esModule = true;
var express = require("express");
// import * as mysql from 'promise-mysql';
var pg_1 = require("pg");
var port = process.env.PORT || 8000;
var sqloptions = {
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'dtc'
};
var app = express();
// const mysql = require('mysql');
var connection;
app.get('/db', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var e_1, qres, ctx, ctxstr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!connection) return [3 /*break*/, 4];
                // throw new Error('db not init yet');
                console.log('starting');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                connection = new pg_1.Client(); // sqloptions
                return [4 /*yield*/, connection.connect()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                throw new Error(e_1.toString());
            case 4: return [4 /*yield*/, connection.query('select * from debate_session')];
            case 5:
                qres = _a.sent();
                console.log(qres.rows); // Hello world!
                ctx = JSON.parse(req.headers['x-context']);
                ctxstr = JSON.stringify(ctx, null, 2);
                res.send({ rows: qres.rows, ctx: ctxstr });
                return [2 /*return*/];
        }
    });
}); });
app.get('/hello', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send({ rows: ['ok'] });
        return [2 /*return*/];
    });
}); });
// app.use(bodyParser.json());
// app.use(AWSXRay.express.closeSegment());
app.listen(port, function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // await connection.connect();
        console.log("Live on port: " + port + "!");
        sqloptions.password = 'removed';
        return [2 /*return*/];
    });
}); });
