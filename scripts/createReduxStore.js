#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const createStore = () => {
    // Check if src/Redux or src/redux directory exists
    let reduxDir = '';
    if (existsSync('src/Redux')) {
        reduxDir = 'src/Redux';
    } else if (existsSync('src/redux')) {
        reduxDir = 'src/redux';
    } else {
        // Create src/Redux directory if it doesn't exist
        mkdirSync('src/Redux', { recursive: true });
        reduxDir = 'src/Redux';
    }

    // Create store.js file
    const storeFile = join(reduxDir, 'store.js');
    if (existsSync(storeFile)) {
        console.log(`Store already exists: ${storeFile}`);
        return;
    }
    const storeContent = `
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { rootReducer } from "./root-reducer";

const middleWares = [process.env.NODE_ENV === 'development' && logger].filter(
    Boolean
);

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleWares),
});
    `;
    writeFileSync(storeFile, storeContent, 'utf8');
    console.log(`Store created: ${storeFile}`);
};

// Create the store
createStore();