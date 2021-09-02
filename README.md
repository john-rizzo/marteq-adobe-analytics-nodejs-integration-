# Setup steps

### Prerequisites

- NodeJS 13.7.0 or latest
- Create .env file from .env.sample
- Run `npm i` to install the required packages

## Step 1: Acquire MarteQ API Key from Marketer Portal

- Login to your marketer account
- In Left Sidebar find API Keys section
- Create and notdown API Key and add it in .env file for `MARTEQ_API_KEY` variable
- Add MarteQ API Url as MARTEQ_API_URL, you can get this from support

## Step 2: Create project and generate access token

- Create Project on Adobe Analytics Console
- Create New Analytics project with Service account
- Once done you should be able to see Client ID (same as API Key), Client Secret
- Add your keypair for generation of JWT Token in order to acquire actual access token for submitting data to analytics api
- Generate JWT Token by submitting your private key
- Replace those variables in .env file `ADOBE_CLIENT_ID`, `ADOBE_CLIENT_SECRET`, `ADOBE_JWT_TOKEN`
- Now run the project using `npm start` and hit this api on server `/access_token` this will print access token in console. Add its value for ADOBE_ANALYTICS_API_ACCESS_TOKEN variable

## Step 3: Create report suite

- Go to adobe experience cloud and create Analytics report Suit
- Add its value for `ANALYTICS_REPORT_SUIT_ID` in `.env` file. This will be used when generating csv files as `reportSuitID` is required paremeter when submitting those files

## Step 4: Requesting data and submit to Analytics

- `/generate_and_submit_file` this route requests default limited data and submits to adobe analytics

This should generate response like:

![Adobe Analytics File Submit Response](https://i.imgur.com/mZcX3bi.png "Adobe Analytics File Submit Response")


- Maximum number of records returned is 500.
- You can modify data using following parameters `page`, `limit`, `from_date` in 'YYYY-MM-DD' format, `to_date`

## Customization of code for additional data

- You can modify helper files Marteq.js and AdobeAnalytics.js for additional changes as per your needs

