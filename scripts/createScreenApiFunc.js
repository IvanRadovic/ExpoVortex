#!/usr/bin/env node
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const functionName = process.argv[2];

// Let the user choose the screen
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Check if screens directory exists
if (!fs.existsSync('app/screens')) {
    console.log('Screens directory does not exist.');
    process.exit(1);
}

// Get all screen directories
const screens = fs.readdirSync('app/screens', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

if (screens.length === 0) {
    console.log('No screens found.');
    process.exit(1);
}

// Ask the user in which screen they want to create the api.js
console.log('In which screen do you want to create the api.js?');
screens.forEach((screen, index) => {
    console.log(`${index + 1}. ${screen}`);
});

rl.question('In which screen do you want to create the api.js? ', (screenAnswer) => {
    const screenIndex = parseInt(screenAnswer, 10) - 1;
    if (screenIndex >= 0 && screenIndex < screens.length) {
        const chosenScreen = screens[screenIndex];

        // Create api.js file
        const apiFile = `app/screens/${chosenScreen}/api.js`;
        let apiContent = '';

        // If the file does not exist, add the imports
        if (!fs.existsSync(apiFile)) {
            apiContent = `import axios from 'axios';
            import {BASE_URL} from "../../Api/api.config";`;
        }

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

            // If the file already exists, prepend the function code to the existing content
            if (fs.existsSync(apiFile)) {
                const existingContent = fs.readFileSync(apiFile, 'utf8');
                apiContent = `${functionCode}\n${existingContent}`;
            } else {
                // If the file does not exist, just write the function code
                apiContent = `${apiContent}\n${functionCode}`;
            }

            // Write the content to the file
            fs.writeFileSync(apiFile, apiContent, 'utf8');
            console.log(`File created: ${apiFile}`);

            // Log a success message
            console.log(`Function ${functionName} was successfully created.`);

            rl.close();
        });
    } else {
        console.log('Invalid choice. Please run the script again.');
        rl.close();
    }
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