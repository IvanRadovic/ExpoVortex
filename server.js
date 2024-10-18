import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {logProjectData, setProjectData} from './globalStore.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/project-data', (req, res) => {
    const { projectName, numOfScreen, screenNames, apiRoute } = req.body;

    if (!projectName || typeof numOfScreen !== 'number' || !Array.isArray(screenNames) || !apiRoute) {
        return res.status(400).send('Invalid data format');
    }

    // Set the project data globally
    setProjectData(req.body);

    res.send('Project data received and stored successfully');

    logProjectData();

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});