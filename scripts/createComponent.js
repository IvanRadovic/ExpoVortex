#!/usr/bin/env node
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
import {input, select} from "@inquirer/prompts";

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Get the component name from the command line arguments
const componentName = process.argv[2];

if (!componentName) {
    console.log('Please specify a component name');
    process.exit(1);
}

// Define the component types
const componentTypes = {
    'Button': {
        [`${componentName}.jsx`]:
        `import React from 'react';
        import { Button } from 'react-native';
        import { styles } from './${componentName}.style';

        const ${componentName} = ({ onPress, title }) => {
            return (
                <Button
                    onPress={onPress}
                    title={title}
                    style={styles.button}
                />
            );
        };

        export default ${componentName};`,
        [`${componentName}.style.js`]:
        `import { StyleSheet } from 'react-native';

        export const styles = StyleSheet.create({
            button: {
                // Add your styles here
            },
        });`,
        ['index.js']:
        `export { default } from './${componentName}';`
    },
    'TouchableOpacity': {
        [`${componentName}.jsx`]:
        `import React from 'react';
        import { TouchableOpacity, Text } from 'react-native';
        import { styles } from './${componentName}.style';

        const ${componentName} = ({ onPress, title }) => {
            return (
                <TouchableOpacity onPress={onPress} style={styles.container}>
                    <Text style={styles.text}>{title}</Text>
                </TouchableOpacity>
            );
        };

        export default ${componentName};`,
        [`${componentName}.style.js`]:
        `import { StyleSheet } from 'react-native';

        export const styles = StyleSheet.create({
            container: {
                // Add your styles here
            },
            text: {
                // Add your styles here
            },
        });`,
        ['index.js']:
        `export { default } from './${componentName}';`
    },
    'View': {
        [`${componentName}.jsx`]:
        `import React from 'react';
        import { View, Text } from 'react-native';
        import { styles } from './${componentName}.style';

        const ${componentName} = ({ children }) => {
            return (
                <View style={styles.container}>
                    {children}
                </View>
            );
        };

        export default ${componentName};`,
        [`${componentName}.style.js`]:
        `import { StyleSheet } from 'react-native';

        export const styles = StyleSheet.create({
            container: {
                // Add your styles here
            },
        });`,
        ['index.js']:
        `export { default } from './${componentName}';`
    },
    'Text': {
        [`${componentName}.jsx`]:
        `import React from 'react';
        import { Text } from 'react-native';
        import { styles } from './${componentName}.style';

        const ${componentName} = ({ children }) => {
            return (
                <Text style={styles.text}>{children}</Text>
            );
        };

        export default ${componentName};`,
        [`${componentName}.style.js`]:
        `import { StyleSheet } from 'react-native';

        export const styles = StyleSheet.create({
            text: {
                // Add your styles here
            },
        });`,
        ['index.js']:
        `export { default } from './${componentName}';`
    },
    'Scrollview': {
        [`${componentName}.jsx`]:
        `import React from 'react';
        import { ScrollView, View, Text } from 'react-native';
        import { styles } from './${componentName}.style';

        const ${componentName} = ({ children }) => {
            return (
                <ScrollView style={styles.container}>
                    {children}
                </ScrollView>
            );
        };

        export default ${componentName};`,
        [`${componentName}.style.js`]:
        `import { StyleSheet } from 'react-native';

        export const styles = StyleSheet.create({
            container: {
                // Add your styles here
            },
        });`,
        ['index.js']: `
            export { default } from './${componentName}';
        `
    },
    'Modal': {
        [`${componentName}.jsx`]:
        `import React from 'react';
        import { Modal, View, Text } from 'react-native';
        import { styles } from './${componentName}.style';
        
        const ${componentName} = ({ visible, children }) => {
            return (
                <Modal visible={visible} style={styles.modal}>
                    <View style={styles.container}>
                        {children}
                    </View>
                </Modal>
            );
        };
        
        export default ${componentName};`,
        [`${componentName}.style.js`]:
        `import { StyleSheet } from 'react-native';
        
        export const styles = StyleSheet.create({
            modal: {
                // Add your styles here
            },
            container: {
                // Add your styles here
            },
        });`,
        ['index.js']: `
            export { default } from './${componentName}';
        `
    },
};

// Let the user choose the component type
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Which type of component do you want to create?');
Object.keys(componentTypes).forEach((type, index) => {
    console.log(`${index + 1}. ${type}`);
});

rl.question('Which type of component do you want to create? ', (componentAnswer) => {
    const typeIndex = parseInt(componentAnswer, 10) - 1;
    if (typeIndex >= 0 && typeIndex < Object.keys(componentTypes).length) {
        const chosenComponent = componentTypes[Object.keys(componentTypes)[typeIndex]];

        // Ask the user if they want to add additional elements
        rl.question('Do you want to add additional elements to the component? (yes/no) ', (additionalElementsAnswer) => {
            if (additionalElementsAnswer.toLowerCase() === 'yes') {
                // Ask the user which elements they want to add
                rl.question('Which elements do you want to add? (Text, View, Image, etc..) ', (elementsAnswer) => {
                    const elements = elementsAnswer.split(',').map(element => element.trim());

                    // Generate the code for the additional elements
                    let additionalCode = '';
                    for (const element of elements) {
                        additionalCode += `
                            <${element}>
                                {/* Add your ${element} code here */}
                            </${element}>
                        `;
                    }

                    // Add the additional code to the component code
                    chosenComponent[`${componentName}.jsx`] = chosenComponent[`${componentName}.jsx`].replace('{children}', additionalCode);

                    createComponent(chosenComponent);
                });
            } else {
                createComponent(chosenComponent);
            }
        });
    } else {
        console.log('Invalid choice. Please run the script again.');
        rl.close();
    }
});

function createComponent(files) {
    // Create the directories and files
    const dir = `components/${componentName}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
        console.log(`Directory created: ${dir}`);
    }

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