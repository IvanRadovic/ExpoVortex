#!/usr/bin/env node
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Get the screen name from the command line arguments
const screenName = process.argv[2];


/*
* @param {string} screenName
* @description OPIIIIS
* @returns {void}
* */
if (!screenName) {
    console.log('Please specify a screen name');
    process.exit(1);
}

// Define the directories and files to be created
/*
* @param {string} screenName
* @description OPIIIIS
* @returns {void}
* */
const directories = {
    [`src/Screens/${screenName}`]: {
        [`${screenName}.jsx`]: `
            import React from 'react';
            import { View, Text, TouchableOpacity } from 'react-native';
            import { useNavigation } from '@react-navigation/native';
            import { styles } from './${screenName}.style';

            const ${screenName} = () => {
               const navigation = useNavigation();

                return (
                    <View style={styles.container}>
                        <Text style={styles.text}>${screenName} Screen</Text>
                        <TouchableOpacity onPress={() => navigation.navigate(${screenName})}>
                            <Text>Go to Home Screen</Text>
                        </TouchableOpacity>
                    </View>
                );
            };

            export default ${screenName};
        `,
        [`${screenName}.style.js`]: `
            import { StyleSheet } from 'react-native';

            export const styles = StyleSheet.create({
                container: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F5FCFF',
                },
                text: {
                    fontSize: 20,
                    textAlign: 'center',
                    margin: 10,
                },
            });
        `,
        ['index.js']: `
            export { default } from './${screenName}';
        `
    },
};

// Create the directories and files
for (const [dir, files] of Object.entries(directories)) {
    // Ensure the directory exists before creating files
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
        console.log(`Directory created: ${dir}`);
    }

    // Check if files in the directory exist
    for (const [file, content] of Object.entries(files)) {
        const filePath = path.join(dir, file);
        if (fs.existsSync(filePath)) {
            console.log(`File already exists: ${filePath}`);
        } else {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`File created: ${filePath}`);
        }
    }
}

// Get the list of screen files
const screensDir = 'src/Navigation/screens';
if (!fs.existsSync(screensDir)) {
    fs.mkdirSync(screensDir, {recursive: true});
    console.log(`Directory created: ${screensDir}`);
}
const screenFiles = fs.readdirSync(screensDir).filter(file => file.endsWith('.jsx'));

// If there are no screen files, create StackScreens.jsx
if (screenFiles.length === 0) {
    screenFiles.push('StackScreens.jsx');
    fs.writeFileSync(path.join(screensDir, 'StackScreens.jsx'), 'export const stackScreens = [];\n', 'utf8');
    console.log(`File created: ${path.join(screensDir, 'StackScreens.jsx')}`);
}

// If there is only one screen file, update it
if (screenFiles.length === 1) {
    updateScreenFile(screenFiles[0]);
} else {
    // If there are multiple screen files, let the user choose which one to update
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('Which file do you want to update?');
    screenFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
    });

    rl.question('Enter the number of your choice: ', (answer) => {
        const fileIndex = parseInt(answer, 10) - 1;
        if (fileIndex >= 0 && fileIndex < screenFiles.length) {
            updateScreenFile(screenFiles[fileIndex]);
        } else {
            console.log('Invalid choice. Please run the script again.');
        }
        rl.close();
    });
}

function updateScreenFile(fileName) {
    // Update the chosen screen file
    const screenFilePath = path.join(screensDir, fileName);
    let screenFileContent = fs.readFileSync(screenFilePath, 'utf8');

    // Add the new screen to the stackScreens array
    const importStatement = `import ${screenName} from '../../Screens/${screenName}';\n`;
    const screenObject = `    {
        name: "${screenName}",
        component: ${screenName},
        options: {headerShown: false}
    },\n`;

    // Find the exported array
    const exportedArrayMatch = screenFileContent.match(/export const (\w+) = \[\s*\n/);
    if (exportedArrayMatch) {
        const exportedArrayName = exportedArrayMatch[1];
        screenFileContent = screenFileContent.replace(`export const ${exportedArrayName} = [\n`, `export const ${exportedArrayName} = [\n${screenObject}`);
    } else {
        console.log(`No exported array found in ${fileName}`);
        return;
    }

    screenFileContent = importStatement + screenFileContent;

    fs.writeFileSync(screenFilePath, screenFileContent, 'utf8');
    console.log(`File updated: ${screenFilePath}`);
}