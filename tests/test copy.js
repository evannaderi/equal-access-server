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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const htmlDir = './html-files';
const PORT = 3000;
const guidelineIds = ['WCAG_2_2'];
function runTests() {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield promises_1.default.readdir(htmlDir);
        const outputDir = path_1.default.join(__dirname, 'output');
        yield promises_1.default.mkdir(outputDir, { recursive: true });
        for (let i = 0; i < 100; i++) {
            for (const file of files) {
                if (path_1.default.extname(file) !== '.html')
                    continue;
                const filePath = path_1.default.join(htmlDir, file);
                const html = yield promises_1.default.readFile(filePath, 'utf-8');
                const start = Date.now();
                try {
                    console.log(`starting request ${i} for ${file}`);
                    axios_1.default.post(`http://localhost:${PORT}/scan`, {
                        html,
                        guidelineIds: guidelineIds
                    }).then((response) => __awaiter(this, void 0, void 0, function* () {
                        console.log(`${file}: ${Date.now() - start}ms`);
                        const outPath = './output/' + i + file.replace('.html', '.json');
                        yield promises_1.default.writeFile(outPath, JSON.stringify(response.data, null, 2));
                        console.log(`Output written to ${outPath}`);
                    }));
                }
                catch (err) {
                    console.error(`${file} error after ${Date.now() - start}ms:`, err.message);
                }
            }
        }
    });
}
runTests();
