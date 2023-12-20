# CC

## Tech used ##
Project is created with:
* Node version: v18.13.0
* NPM version: V8.19.3
* Firestore
* Google cloud app engine

# Deploy to App engine
1. Clone this repo 
    `git clone https://github.com/yeetologist/CC` 

2. Create app engine using command 
    `gcloud init` 

3. Configure firestore for database
    - make firestore database with collection : Users, Predictions
    - make serviaccount to acces the database then create key, format: json
    - copy the key to the deploy/src/config/serviceaccount.json

4. Rename .env.example to .env
    - change the ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET variable as you wish (optional)

5. Configure Node_Modules
    install all the dependencies using command `npm install`

5. Run the app engine using command 
    `gcloud app deploy`

