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
// ... (existing componentTypes code) ...

// Let the user choose the component type
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

console.log('Which type of component do you want to create?');
Object.keys(componentTypes).forEach((type, index) => {
    console.log(`${index + 1}. ${type}`);
});

rl.question('Which type of component do you want to create? ', (componentAnswer) => {
    const typeIndex = parseInt(componentAnswer, 10) - 1;
    if (typeIndex >= 0 && typeIndex < Object.keys(componentTypes).length) {
        const chosenComponent = componentTypes[Object.keys(componentTypes)[typeIndex]];

        // Check if screens directory exists
        if (!fs.existsSync('app/screens')) {
            console.log('Screens directory does not exist.');
            return;
        }

        // Get all screen directories
        const screens = fs.readdirSync('app/screens', { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        // Ask the user in which screen they want to create the component
        console.log('In which screen do you want to create the component?');
        screens.forEach((screen, index) => {
            console.log(`${index + 1}. ${screen}`);
        });

        rl.question('In which screen do you want to create the component? ', (screenAnswer) => {
            const screenIndex = parseInt(screenAnswer, 10) - 1;
            if (screenIndex >= 0 && screenIndex < screens.length) {
                const chosenScreen = screens[screenIndex];

                // Create component directory
                const componentDir = `app/screens/${chosenScreen}/components/${componentName}`;
                if (!fs.existsSync(componentDir)) {
                    fs.mkdirSync(componentDir, { recursive: true });
                    console.log(`Directory created: ${componentDir}`);
                }

                // Create component files
                for (const [file, content] of Object.entries(chosenComponent)) {
                    const filePath = path.join(componentDir, file);
                    if (fs.existsSync(filePath)) {
                        console.log(`File already exists: ${filePath}`);
                    } else {
                        fs.writeFileSync(filePath, content, 'utf8');
                        console.log(`File created: ${filePath}`);
                    }
                }
            } else {
                console.log('Invalid choice. Please run the script again.');
            }
            rl.close();
        });
    } else {
        console.log('Invalid choice. Please run the script again.');
        rl.close();
    }
});