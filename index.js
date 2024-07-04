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
const docspring_ts_1 = __importDefault(require("docspring-ts"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Type for the DocSpring configuration
const config = new docspring_ts_1.default.Configuration({
    basePath: process.env.DOCSPRING_BASE_PATH || '',
    username: process.env.DOCSPRING_USERNAME || '',
    password: process.env.DOCSPRING_PASSWORD || '',
});
const api = new docspring_ts_1.default.PDFApi(config);
const templateId = "tpl_zdJ2RYLaACttxtkybs";
const submissionData = {
    data: {
        someText: "John Doe is a very generic man",
    },
};
// Function to generate PDF and get submission ID
function generatePDF(api, templateId, submissionData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield api.generatePDF({
                templateId: templateId,
                submission: submissionData,
            });
            return result.submission.id;
        }
        catch (error) {
            console.error("Error generating PDF:", error);
            throw error;
        }
    });
}
// Function to download PDF from URL and convert to base64
function downloadPdfAsBase64(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url, { responseType: "arraybuffer" });
            const buffer = Buffer.from(response.data, "binary");
            const base64 = buffer.toString("base64");
            return base64;
        }
        catch (error) {
            console.error("Error downloading or converting PDF:", error);
            throw error;
        }
    });
}
// Function to wait for submission to be processed
function waitForSubmission(api, submissionId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const checkSubmission = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield api.getSubmission({ submissionId });
                    if (result.state === "pending") {
                        setTimeout(checkSubmission, 1000);
                    }
                    else {
                        console.log("Submission is:", result.state);
                        resolve(result);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
            yield checkSubmission();
        }));
    });
}
// Main execution
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Generate PDF and get submission ID
        const submissionId = yield generatePDF(api, templateId, submissionData);
        console.log("Submission ID:", submissionId);
        // Step 2: Wait for submission to be processed
        const result = yield waitForSubmission(api, submissionId);
        const downloadUrl = result.downloadUrl;
        if (typeof downloadUrl !== 'string') {
            throw new Error('Invalid download URL');
        }
        // Step 3: Download PDF and convert to base64
        const base64Pdf = yield downloadPdfAsBase64(downloadUrl);
        console.log("Base64 PDF (truncated):", base64Pdf.substring(0, 64));
    }
    catch (error) {
        console.error("Error in the process:", error);
    }
}))();
