#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const createStore = () => {
    // Check if app/Redux or app/redux directory exists
    let reduxDir = '';
    if (existsSync('app/Redux')) {
        reduxDir = 'app/Redux';
    } else if (existsSync('app/redux')) {
        reduxDir = 'app/redux';
    } else {
        // Create app/Redux directory if it doesn't exist
        mkdirSync('app/Redux', { recursive: true });
        reduxDir = 'app/Redux';
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