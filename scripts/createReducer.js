#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const createReducer = (reducerName) => {
    // Check if src/Redux or src/redux directory exists
    let reduxDir = '';
    if (existsSync('src/Redux')) {
        reduxDir = 'src/Redux';
    } else if (existsSync('src/redux')) {
        reduxDir = 'src/redux';
    } else {
        mkdirSync('src/Redux', { recursive: true });
        reduxDir = 'src/Redux';
    }

    // Create reducer directory
    const reducerDir = join(reduxDir, reducerName);
    if (existsSync(reducerDir)) {
        console.log(`Reducer already exists: ${reducerDir}`);
        return;
    }
    mkdirSync(reducerDir);

    const reducerFile = join(reducerDir, `${reducerName}-reducer.js`);
    const reducerContent = `
import { createSlice } from "@reduxjs/toolkit";

const ${reducerName}Slice = createSlice({
  name: "${reducerName}",
  initialState: [],
  reducers: {
    defaultReducer: (state, action) => {
      // Add your reducer logic here
    },
  },
});

export const { defaultReducer } = ${reducerName}Slice.actions;

export const ${reducerName}Reducer = ${reducerName}Slice.reducer;
    `;
    writeFileSync(reducerFile, reducerContent, 'utf8');
    console.log(`Reducer created: ${reducerFile}`);

    // Check if root-reducer.js exists
    const rootReducerFile = join(reduxDir, 'root-reducer.js');
    let rootReducerContent = '';
    if (existsSync(rootReducerFile)) {
        // If root-reducer.js exists, read its content
        rootReducerContent = readFileSync(rootReducerFile, 'utf8');
        // Add new import and update combineReducers
        rootReducerContent = rootReducerContent.replace('export const rootReducer = combineReducers({',
            `import { ${reducerName}Reducer } from "./${reducerName}/${reducerName}Reducer";\n\nexport const rootReducer = combineReducers({\n  ${reducerName}: ${reducerName}Reducer,`);
    } else {
        // If root-reducer.js doesn't exist, create it with basic combineReducers call
        rootReducerContent = `
import { combineReducers } from "@reduxjs/toolkit";
import { ${reducerName}Reducer } from "./${reducerName}/${reducerName}-reducer";

export const rootReducer = combineReducers({
  ${reducerName}: ${reducerName}Reducer
});
        `;
    }
    writeFileSync(rootReducerFile, rootReducerContent, 'utf8');
    console.log(`Root reducer updated: ${rootReducerFile}`);
};

// Run the function
createReducer(process.argv[2]);