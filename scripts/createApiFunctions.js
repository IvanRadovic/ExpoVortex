#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const apiFunctionsPath = path.join('app', 'Api', 'api.functions.js');

// Get the function name from the command line arguments
const functionName = process.argv[2];

// Define the HTTP methods
let httpMethod = ['get', 'post', 'put', 'delete', 'all'];

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask the user for the HTTP method
rl.question('Select the HTTP method (get, post, put, delete, all): ', (httpMethod) => {
    let functionCode = '';
    if (httpMethod === 'all') {
        functionCode += `// ======= ${functionName} =======\n`;
        for (const method of ['get', 'post', 'put', 'delete']) {
            functionCode += generateFunctionCode(functionName, method);
        }
    } else {
        functionCode += generateFunctionCode(functionName, httpMethod);
    }

    // Check if the api.functions.js file exists
    if (!fs.existsSync(apiFunctionsPath)) {
        // Create the file and add the import statement
        fs.writeFileSync(apiFunctionsPath, 'import { BASE_URL } from \'./api.config.js\';\n\n', 'utf8');
        // Add the rest of the code
        fs.appendFileSync(apiFunctionsPath, '/* Add your code here */\n', 'utf8');
    }

    // Append the function code to the file
    fs.appendFileSync(apiFunctionsPath, functionCode, 'utf8');

    // Log a success message
    console.log(`Function ${functionName} was successfully created.`);

    rl.close();
});

function generateFunctionCode(functionName, httpMethod) {
    const action = httpMethod === 'put' ? 'update' : httpMethod === 'post' ? 'create' : httpMethod;
    const actionFunctionName = `${action}${functionName.charAt(0).toUpperCase() + functionName.slice(1)}`;

    let functionBody = '';
    let functionParameters = '';

    if (httpMethod === 'post') {
        functionBody =
        `const response = await axios.${httpMethod}(\`\${BASE_URL}/${functionName.toLowerCase()}/create\`, data);
        console.log("${functionName}", response.data);
        return response.data;`;
        functionParameters = '(data)';
    } else if (httpMethod === 'put') {
        functionBody =
        `const response = await axios.${httpMethod}(\`\${BASE_URL}/${functionName.toLowerCase()}/\${id}/update\`, data);
        console.log("${functionName}", response.data);
        return response.data;`;
        functionParameters = '(id, data)';
    } else if (httpMethod === 'delete') {
        functionBody =
        `const response = await axios.${httpMethod}(\`\${BASE_URL}/${functionName.toLowerCase()}/\${id}\`);
        console.log("${functionName}", response.data);
        return response.data;`;
        functionParameters = '(id)';
    } else {
        functionBody =
        `const response = await axios.${httpMethod}(\`\${BASE_URL}/${functionName.toLowerCase()}\`);
        console.log("${functionName}", response.data);
        return response.data;`;
        functionParameters = '()';
    }

    return `
export const ${actionFunctionName} = async ${functionParameters} => {
    try {
        ${functionBody}
    } catch (error) {
        console.error(error);
    }
}
`;
}