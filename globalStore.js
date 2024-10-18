// Global object to store the received data
let projectData = {};

// Function to set the project data
export const setProjectData = (data) => {
    projectData = data;
};

// In `globalStore.js`
export const logProjectData = () => {
    console.log('Current projectData:', projectData);
};

// Function to get the project data
export const getProjectData = () => {
    return projectData;
};