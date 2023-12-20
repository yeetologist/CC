// index.js

const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const port = 8000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'This is the homepage of the API' });
});

app.post('/prediction', (req, res) => {
  try {
    const { Sex, Age, Height, Weight } = req.body;

    console.log(`Received data: ${JSON.stringify(req.body)}`);

    // Use PythonShell to run the prediction script
    const pythonProcess = spawn('python', ['predict.py', Sex, Age, Height, Weight]);

    let prediction = '';  // Variable to store the prediction

    pythonProcess.stdout.on('data', (data) => {
      prediction = data.toString().trim();
      console.log(`Prediction: ${prediction}`);
    });

    // pythonProcess.stderr.on('data', (data) => {
    //   console.error(`Error: ${data}`);
    //   res.status(500).json({ error: 'Internal Server Error' });
    // });

    pythonProcess.on('close', (code) => {
      // Send the response only once when the Python process is closed
      res.json({ prediction });
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
