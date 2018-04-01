# townhall-SMS-alerts [![Build Status](https://travis-ci.org/townhallproject/townhall-SMS-alerts.svg?branch=master)](https://travis-ci.org/townhallproject/townhall-SMS-alerts)

Motivation: Many people want to know when their member of congress is holding a town hall. Currently they can access this information by going to townhallproject.com and by signing up for email alerts. We want to make this information even more readily available by allowing people to access it with their phones via SMS.

## Running locally:
  - you will need a twilio number and a tunneling service, and a firebase database
  #### Setting up twilio
  - tunneling service: follow directions [here](https://www.twilio.com/docs/guides/how-to-set-up-your-node-js-and-express-development-environment#install-ngrok-for-local-development)
  #### Setting up firebase
  - the two endpoints you need are `townHalls` and `zipToDistrict` 
  - make a new firebase database, add these endpoints and upload JSONS from data folder. 
  #### in your .env file
  - FIREBASE_PROJECT_ID : project id from firebase, usually your project name
  - FIREBASE_PRIVATE_KEY : private key provided by firebase
  - FIREBASE_CLIENT_ID : provided by firebase, it's the client email
  - PORT : defaults to 3000
  - SESSION_SECRET : for express-session
  
  #### Running 
  - run `npm i`
  - run `npm start` or `nodemon`, will tell you the port you are on
  - open new terminal window, run `./ngrok http [PORT]`
  - text your twilio number

## MVP:
User will text a number their zip code, in response they will get all upcoming events in their district (including Senate events). The event information will include the Member of congress, the title, and a link to directions.

- Current testing phonenumber in production: 415-231-1324
- Zip with events: 27278


## Stretch Goals:
Ongoing SMS alerts
  - Users will be able to sign up for ongoing alerts in their area.
  - We will send texts when a new event is posted to the database.
  - First version:
     * add users with events to a temp queue endpoint, and then at ~1pm pacific time, send out all texts with events within a time cutoff (1 or 2 weeks), and delete from the queue.
  - Second version:
     * Be smarter about when we send texts, based on when and where the event is occuring
     * send out alerts when events are changed (but only date or location).

## Database:
We will be using town hall project's firebase database.
Firebase [docs](https://firebase.google.com/docs/).

## Messaging:
We will be using Twilio's API.
Twilio [docs](https://www.twilio.com/docs/quickstart/node/programmable-sms).
