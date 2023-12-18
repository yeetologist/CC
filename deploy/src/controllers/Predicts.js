const Users = require ("../models/UserModel.js");
const Predictions = require("../models/PredictModel.js");
const { spawn } = require('child_process');

const createPredict = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const { Sex, Age, Height, Weight } = req.body;
  if ( !Age || !Height || !Weight ) return res.status(400).json({ msg: "Lengkapi Data" });

  
  
  
  
  const userSnapshot = await Users.where('refresh_token', '==', refreshToken).get();
  if (userSnapshot.empty) return res.sendStatus(204);

  const userId = userSnapshot.docs[0].id;
  // Get current date and time
    const currentDate = new Date();
  // Get various components of the date and time
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Note: Months are zero-based, so we add 1
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

  // Format the date and time as needed
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
  try {
    // console.log(`Received data: ${JSON.stringify(req.body)}`);

    // // Use PythonShell to run the prediction script
    // const pythonProcess = spawn('python', ['predict.py', Sex, Age, Height, Weight]);

    // let prediction = '';  // Variable to store the prediction

    // pythonProcess.stdout.on('data', (data) => {
    //   prediction = data.toString().trim();
    //   console.log(`Prediction: ${prediction}`);
    // });

    // pythonProcess.stderr.on('data', (data) => {
    //   console.error(`Error: ${data}`);
    //   res.status(500).json({ error: 'Internal Server Error' });
    // });

    // pythonProcess.on('close', (code) => {
    //   // Send the response only once when the Python process is closed
    //   res.json({ prediction });
    // });

    await Predictions.add({
      id_user : userId,
      sex: Sex,
      age: Age,
      height: Height,
      weight: Weight,
      timestamp: formattedDateTime
    });

    res.json({ msg: "Berhasil menambah data prediksi" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { createPredict };