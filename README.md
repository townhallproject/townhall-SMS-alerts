# townhall-SMS-alerts
https://travis-ci.org/townhallproject/townhall-SMS-alerts.svg?branch=feature%2Ftravis

Motivation: Many people want to know when their member of congress is holding a town hall. Currently they can access this information by going to townhallproject.com and by signing up for email alerts. We want to make this information even more readily available by allowing people to access it with their phones via SMS.

## MVP:
User will text a number their zip code, in response they will get all upcoming events in their district (including Senate events). The event information will include the Member of congress, the title, and a link to directions.

Current testing phonenumber in production: 415-231-1324
Zip with events: 27278


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
