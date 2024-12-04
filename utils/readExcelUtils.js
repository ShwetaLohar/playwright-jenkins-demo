// import * as fs from 'fs';
// import path from 'path';
// import XLSX from 'xlsx';

// const excelFolderPath = 'data_files' + path.sep;

// function getTestData(fileName, sheetName) {
//   const fullPath = excelFolderPath + fileName;
//   console.log(`Reading XLSX FILE ${fullPath}`);

//   if (!fs.existsSync(fullPath)) {
//     throw new Error(`CANNOT FIND FILE ${fullPath}. PLEASE MAKE SURE IT EXISTS`);
//   }

//   const workbook = XLSX.readFile(fullPath);
  
//   if (!workbook.Sheets[sheetName]) {
//     throw new Error(`Sheet ${sheetName} does not exist in file ${fileName}`);
//   }

//   const dataFromSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//   return dataFromSheet;
// }

// module.exports = { getTestData };


// function getFilePaths(sheetName) {
//   const filePath = path.resolve('data_files/kycFiles.xlsx');
//   const workbook = xlsx.readFile(filePath);
//   const worksheet = workbook.Sheets[sheetName];  // Get specific sheet by name

//   const filePaths = [];
//   const data = xlsx.utils.sheet_to_json(worksheet);

//   // Loop through Excel rows and extract file paths
//   data.forEach(row => {
//       filePaths.push(row['File Path']);
//   });

//   return filePaths;
// }

// module.exports = { getFilePaths };



import * as fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// Define the base folder for Excel files
const excelFolderPath = 'data_files' + path.sep;

// Function to get test data from any Excel sheet
function getTestData(fileName, sheetName) {
  const fullPath = excelFolderPath + fileName;
  console.log(`Reading XLSX FILE ${fullPath}`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`CANNOT FIND FILE ${fullPath}. PLEASE MAKE SURE IT EXISTS`);
  }

  const workbook = XLSX.readFile(fullPath);

  if (!workbook.Sheets[sheetName]) {
    throw new Error(`Sheet ${sheetName} does not exist in file ${fileName}`);
  }

  const dataFromSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return dataFromSheet;
}

function getFilePaths(sheetName) {
  const filePath = path.resolve('data_files/kycFiles.xlsx'); // Path to kycFiles.xlsx
  console.log(`Reading file paths from: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} not found`);
  }

  // Define a mapping for specific sheet names
  const sheetNameMapping = {
    'SOCIETY/CLUB/ASSOCIATION': 'SOCIETY'
  };

  // Map to a valid sheet name if necessary
  const validSheetName = sheetNameMapping[sheetName] || sheetName;

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[validSheetName];

  if (!worksheet) {
    throw new Error(`Sheet ${validSheetName} does not exist in file kycFiles.xlsx`);
  }

  const filePaths = [];
  const data = XLSX.utils.sheet_to_json(worksheet);

  // Extract file paths from the specified column
  data.forEach(row => {
    filePaths.push(row['File_Paths']);  // Ensure 'File_Paths' matches the column name in Excel
  });

  return filePaths;
}

// function getFilePaths(sheetName) {
//   const filePath = path.resolve('data_files/kycFiles.xlsx'); // Path to kycFiles.xlsx
//   console.log(`Reading file paths from: ${filePath}`);

//   if (!fs.existsSync(filePath)) {
//     throw new Error(`File ${filePath} not found`);
//   }

//   const workbook = XLSX.readFile(filePath);
//   const worksheet = workbook.Sheets[sheetName];

//   if (!worksheet) {
//     throw new Error(`Sheet ${sheetName} does not exist in file kycFiles.xlsx`);
//   }

//   const filePaths = [];
//   const data = XLSX.utils.sheet_to_json(worksheet);

//   // Loop through each row to extract the file paths
//   data.forEach(row => {
//     filePaths.push(row['File_Paths']);  // Assuming 'File Path' is the column name
//   });

//   return filePaths;
// }

function getSubmerchantKYC(sheetName) {
  const filePath = path.resolve('data_files/kycFiles.xlsx'); // Path to kycFiles.xlsx
  console.log(`Reading file paths from: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} not found`);
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet ${sheetName} does not exist in file kycFiles.xlsx`);
  }

  const filePaths = [];
  const data = XLSX.utils.sheet_to_json(worksheet);

  // Loop through each row to extract the file paths
  data.forEach(row => {
    filePaths.push(row['File_Paths']);  // Assuming 'File Path' is the column name
  });

  return filePaths;
}


// Export both functions
module.exports = {
  getTestData,
  getFilePaths,
  getSubmerchantKYC
};
