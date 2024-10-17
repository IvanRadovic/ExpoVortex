#!/usr/bin/env node
import {createRequire} from 'module';
import { exec } from 'child_process';
const require = createRequire(import.meta.url);

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Define the directories and files to be created
let directories = {
    'src/Navigation': {
        'AppNavigation.jsx': `
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { stackScreens } from './screens/StackScreens';

const Stack = createStackNavigator();

function AppNavigation() {
    return (
        <Stack.Navigator>
            {stackScreens.map((screen, index) => (
                <Stack.Screen
                    key={index}
                    name={screen.name}
                    component={screen.component}
                    options={screen.options}
                />
            ))}
        </Stack.Navigator>
    );
}

export default AppNavigation;
        `,
        'MainNavigation.jsx': `
import { NavigationContainer } from '@react-navigation/native';

import AppNavigation from './AppNavigation';

export default function MainNavigation() {
    return (
        <NavigationContainer>
            <AppNavigation />
        </NavigationContainer>
    );
}
        `,
        'LoginNavigation.js': `
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { loginScreens } from './screens/LoginScreens';

const Stack = createStackNavigator();

function LoginNavigation() {
    return (
        <Stack.Navigator>
            {loginScreens.map((screen, index) => (
                <Stack.Screen
                    key={index}
                    name={screen.name}
                    component={screen.component}
                    options={screen.options}
                />
            ))}
        </Stack.Navigator>
    );
}

export default LoginNavigation;
        `,
    },
    'src/Navigation/screens': {
        'StackScreens.jsx': `
import HomeScreen from '../Screens/HomeScreen';
import AboutScreen from "../Screens/AboutScreen";

export const stackScreens = [
    {
        name: "Home",
        component: HomeScreen,
        options: {headerShown: false}
    },
    {
        name: "About",
        component: AboutScreen,
        options: {headerShown: false}
    }
];
        `,
        'LoginScreens.jsx': `
import LoginScreen from '../../Screens/LoginScreen';

export const loginScreens = [
    {
        name: "Login",
        component: LoginScreen,
        options: {headerShown: false}
    },
];
        `,
    },
    'src/Screens': {
        'HomeScreen.jsx': `
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
   const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('About')}>
                <Text>Go to About Screen</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default HomeScreen;
        `,
        'AboutScreen.jsx': `
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function AboutScreen() {
    const navigation = useNavigation();

    return (
        <View>
            <Text>About Screen</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text>Go back to Home Screen</Text>
            </TouchableOpacity>
        </View>
    );
}

export default AboutScreen;
        `,
        'LoginScreen': {
            'LoginScreen.jsx': `
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './LoginScreen.style';

const LoginScreen = () => {
   const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login Screen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text>Go to Home Screen</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
            `,
            'LoginScreen.style.js': `
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
            'index.js': `
export { default } from './LoginScreen';
            `,
        },
    },
};

let projectName = '';
let numberOfScreens = 0;
let screenNames = [];
let createApi = false;
let baseUrl = '';

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askCreateLogin = () => {
    askQuestion('Do you want to create Login/SignUp? (yes/no) ', (answer) => {
        const lowerCaseAnswer = answer.toLowerCase();
        if (lowerCaseAnswer === 'yes') {
            createLoginNavigation();
            createLoginScreens();
            createLoginScreen();
            updateMainNavigation();
        }
    });
};

// const createLoginNavigation = () => {
//     const loginNavigationPath = path.join(projectName, 'src/Navigation/LoginNavigation.jsx');
//     const loginNavigationContent = `
// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { loginScreens } from './screens/LoginScreens';
//
// const Stack = createStackNavigator();
//
// function LoginNavigation() {
//     return (
//         <Stack.Navigator>
//             {loginScreens.map((screen, index) => (
//                 <Stack.Screen
//                     key={index}
//                     name={screen.name}
//                     component={screen.component}
//                     options={screen.options}
//                 />
//             ))}
//         </Stack.Navigator>
//     );
// }
//
// export default LoginNavigation;
//     `;
//     fs.writeFileSync(loginNavigationPath, loginNavigationContent, 'utf8');
//     console.log(`File created: ${loginNavigationPath}`);
// };
//
// const createLoginScreens = () => {
//     const loginScreensPath = path.join(projectName, 'src/Navigation/screens/LoginScreens.jsx');
//     const loginScreensContent = `
// import LoginScreen from '../../Screens/LoginScreen';
//
// export const loginScreens = [
//     {
//         name: "Login",
//         component: LoginScreen,
//         options: {headerShown: false}
//     },
// ];
//     `;
//     fs.writeFileSync(loginScreensPath, loginScreensContent, 'utf8');
//     console.log(`File created: ${loginScreensPath}`);
// };
//
// const createLoginScreen = () => {
//     const loginScreenPath = path.join(projectName, 'src/Screens/LoginScreen.jsx');
//     const loginScreenContent = `
// import React from 'react';
// import { View, Text } from 'react-native';
//
// const LoginScreen = () => {
//     return (
//         <View>
//             <Text>Login Screen</Text>
//         </View>
//     );
// };
//
// export default LoginScreen;
//     `;
//     fs.writeFileSync(loginScreenPath, loginScreenContent, 'utf8');
//     console.log(`File created: ${loginScreenPath}`);
// };
//
// const updateMainNavigation = () => {
//     const mainNavigationPath = path.join(projectName, 'src/Navigation/MainNavigation.jsx');
//     let mainNavigationContent = fs.readFileSync(mainNavigationPath, 'utf8');
//     mainNavigationContent = `import LoginNavigation from './LoginNavigation';\n` + mainNavigationContent;
//     fs.writeFileSync(mainNavigationPath, mainNavigationContent, 'utf8');
//     console.log(`File updated: ${mainNavigationPath}`);
// };
const askQuestion = (question, callback) => {
    rl.question(question, (answer) => {
        callback(answer);
    });
};

const askForProjectName = () => {
    askQuestion('Enter the name of your Expo project: ', (answer) => {
        projectName = answer;
        askForScreens();
    });
};

const askForScreens = () => {
    askQuestion('Do you want to create screens? (yes/no) ', (answer) => {
        if (answer.toLowerCase() === 'yes') {
            // Ask user how many screens they want to create
            askQuestion('How many screens do you want to create? ', (numScreens) => {
                let count = parseInt(numScreens);
                if (isNaN(count)) {
                    console.log('Invalid number of screens. Exiting.');
                    rl.close();
                    return;
                }

                numberOfScreens = count;
                directories['src/Screens'] = {};
                askScreenNames(0);
            });
        } else {
            askCreateApi();
        }
    });
};

const askScreenNames = (index) => {
    if (index === numberOfScreens) {
        askCreateApi();
        return;
    }

    // Ask user for screen name
    askQuestion(`Name for screen ${index + 1}: `, (screenName) => {
        screenNames.push(screenName);
        directories[`src/Screens/${screenName}`] = {
            [`${screenName}.jsx`]:
            `import React from 'react';
            import { View, Text, TouchableOpacity } from 'react-native';
            import { useNavigation } from '@react-navigation/native';
            import { styles } from './${screenName}.style';

            const ${screenName} = () => {
               const navigation = useNavigation();

                return (
                    <View style={styles.container}>
                        <Text style={styles.text}>${screenName} Screen</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                            <Text>Go to Home Screen</Text>
                        </TouchableOpacity>
                    </View>
                );
            };

            export default ${screenName};`,
            [`${screenName}.style.js`]:
            `import { StyleSheet } from 'react-native';

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
            });`,
            ['index.js']: `
                export { default } from './${screenName}';
            `
        };
        askScreenNames(index + 1);
    });
};

const askCreateApi = () => {
    askQuestion('Do you want to create an Api folder? (yes/no) ', (answer) => {
        const lowerCaseAnswer = answer.toLowerCase();
        if (lowerCaseAnswer === 'yes') {
            createApi = true;
            directories['src/Api'] = {};
            directories['src/Api'][`api.config.js`] = '';
            directories['src/Api'][`api.functions.js`] = 'import { BASE_URL } from "./api.config.js";\n'; // Dodajte ovu liniju
            askQuestion('Enter the BASE_URL: ', (answer) => {
            baseUrl = answer;
            directories['src/Api']['api.config.js'] =
            `import axios from 'axios';
             export const BASE_URL = 'http://${baseUrl}';`;
            initializeExpoProject();
            });
        } else {
            console.log('Exiting the library.');
            rl.close();
        }
    });
};

const initializeExpoProject = () => {
    try {
        console.log('Initializing Expo project...');
        execSync(`npx create-expo-app@latest ${projectName} --template blank`, { stdio: 'inherit' });
        console.log('Expo project initialized successfully.');
        console.log('Creating directories and files...');
        createDirectoriesAndFiles();
    } catch (error) {
        console.error(`Error initializing Expo project: ${error.message}`);
    }
};

const updateStackScreens = () => {
    // Update StackScreens.jsx file
    const stackScreensPath = path.join(projectName, 'src/Navigation/screens/StackScreens.jsx');
    let stackScreensContent = '';
    for (const screenName in directories['src/Screens']) {
        const screenNameWithoutExtension = screenName.replace('.jsx', '');
        stackScreensContent += `import ${screenNameWithoutExtension} from '../../Screens/${screenName}';\n`;
    }
    stackScreensContent += '\nexport const stackScreens = [\n';
    for (const screenName in directories['src/Screens']) {
        const screenNameWithoutExtension = screenName.replace('.jsx', '');
        stackScreensContent += `{
        name: "${screenNameWithoutExtension}",
        component: ${screenNameWithoutExtension},
        options: {headerShown: false}
    },\n`;
    }
    stackScreensContent += '];\n';
    fs.writeFileSync(stackScreensPath, stackScreensContent, 'utf8');
    console.log(`File updated: ${stackScreensPath}`);
};
const createDirectoriesAndFiles = () => {
    // Ensure the project directory exists before creating files
    if (!fs.existsSync(projectName)) {
        console.log(`Project directory does not exist: ${projectName}`);
        return;
    }

    for (const [dir, files] of Object.entries(directories)) {
        // Add the project name as a prefix to the directory path
        const dirPath = path.join(projectName, dir);
        if (fs.existsSync(dirPath)) {
            console.log(`Directory already exists: ${dirPath}`);
        } else {
            fs.mkdirSync(dirPath, {recursive: true});
            console.log(`Directory created: ${dirPath}`);
        }

        // Check if files in the directory exist
        for (const [file, content] of Object.entries(files)) {
            const filePath = path.join(dirPath, file);
            if (fs.existsSync(filePath)) {
                console.log(`File already exists: ${filePath}`);
            } else {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`File created: ${filePath}`);
            }
        }
    }

    // Call the updateStackScreens function after all the new screens have been created
    updateStackScreens();
    installPackages();
};


const installPackages = () => {
    try {
        console.log('Installing packages...');
        // Define the array of packages
        const packages = [
            // '@react-navigation/bottom-tabs',
            // '"@react-navigation/drawer"',
            '@react-navigation/native',
            '@react-navigation/stack',
            '@react-navigation/native-stack',
            'axios',
            'react-native-safe-area-context',
            'react-native-screens',
            'react-native-gesture-handler',
            'react-native-toast-message',
            '@tanstack/react-query',
            'react-hook-form'
        ];

        // Loop through the array and install each package
        for (const pack of packages) {
            execSync(`cd ${projectName} && npm install ${pack}`, { stdio: 'inherit' });
        }

        console.log('Packages installed successfully.');
    } catch (error) {
        console.error(`Error installing packages: ${error.message}`);
    }
};


// Run the function
askForProjectName();