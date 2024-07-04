import DocSpring, { CreateSubmissionData } from "docspring-ts";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Type for the DocSpring configuration
const config: DocSpring.Configuration = new DocSpring.Configuration({
  basePath: process.env.DOCSPRING_BASE_PATH || '',
  username: process.env.DOCSPRING_USERNAME || '',
  password: process.env.DOCSPRING_PASSWORD || '',
});

const api: DocSpring.PDFApi = new DocSpring.PDFApi(config);
const templateId = "tpl_zdJ2RYLaACttxtkybs";
const submissionData: CreateSubmissionData = {
  data: {
    someText: "John Doe is a very generic man",
  },
};

// Function to generate PDF and get submission ID
async function generatePDF(api: DocSpring.PDFApi, templateId: string, submissionData: CreateSubmissionData): Promise<string> {
  try {
    const result = await api.generatePDF({
      templateId: templateId,
      submission: submissionData,
    });
    return result.submission.id;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

// Function to download PDF from URL and convert to base64
async function downloadPdfAsBase64(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    const base64 = buffer.toString("base64");
    return base64;
  } catch (error) {
    console.error("Error downloading or converting PDF:", error);
    throw error;
  }
}

// Function to wait for submission to be processed
async function waitForSubmission(api: DocSpring.PDFApi, submissionId: string): Promise<DocSpring.Submission> {
  return new Promise(async (resolve, reject) => {
    const checkSubmission = async () => {
      try {
        const result = await api.getSubmission({ submissionId });
        if (result.state === "pending") {
          setTimeout(checkSubmission, 1000);
        } else {
          console.log("Submission is:", result.state);
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    };

    await checkSubmission();
  });
}

// Main execution
(async () => {
  try {
    // Step 1: Generate PDF and get submission ID
    const submissionId = await generatePDF(api, templateId, submissionData);
    console.log("Submission ID:", submissionId);

    // Step 2: Wait for submission to be processed
    const result = await waitForSubmission(api, submissionId);
    const downloadUrl = result.downloadUrl;

    if (typeof downloadUrl !== 'string') {
      throw new Error('Invalid download URL');
    }

    // Step 3: Download PDF and convert to base64
    const base64Pdf = await downloadPdfAsBase64(downloadUrl);
    console.log("Base64 PDF (truncated):", base64Pdf.substring(0, 64));
  } catch (error) {
    console.error("Error in the process:", error);
  }
})();

