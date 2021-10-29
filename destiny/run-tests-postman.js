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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var newman_1 = __importDefault(require("newman"));
var fs_1 = __importDefault(require("fs"));
var listOfCollections = [];
var runner = function () { return __awaiter(void 0, void 0, void 0, function () {
    var configFile, configData, configDataJson_1, testCollections_1, fileExtension_1;
    return __generator(this, function (_a) {
        try {
            console.info("Starting test runner");
            configFile = "./environments/test.postman_environment.json";
            configData = fs_1.default.readFileSync(configFile, "utf8");
            configDataJson_1 = JSON.parse(configData);
            testCollections_1 = "./exploratory";
            fileExtension_1 = ".postman_collection.json";
            listOfCollections = listOfCollections.concat(fs_1.default.readdirSync(testCollections_1).filter(function (fn) { return fn.endsWith(fileExtension_1); }));
            listOfCollections.forEach(function (element) {
                console.info("Running " + element + " collection first");
                newman_1.default
                    .run({
                    collection: require(testCollections_1 + "/" + element),
                    environment: configDataJson_1,
                    insecure: true,
                    reporters: ["cli", "htmlextra"],
                    reporter: {
                        htmlextra: {
                            export: "./reports/" + element + "-executionResults.html"
                        }
                    }
                })
                    .on("start", function () {
                    console.info("****Execution of " + element + " collection started");
                })
                    .on("done", function (err, summary) {
                    if (err || (summary.run.failures && summary.run.failures.length > 0)) {
                        console.error("Logging error found for " + element);
                    }
                    else {
                        console.info("Execution of " + element + " - Completed");
                    }
                })
                    .on("exception", function (err) {
                    console.error("Exception for " + element);
                })
                    .on("console", function (err, logs) {
                    console.log(logs.messages);
                });
            });
        }
        catch (_b) {
            console.log("Exception found while running collections through Newman");
        }
        return [2 /*return*/];
    });
}); };
runner()
    .then(console.log)
    .catch(console.error);
