# townhall-SMS-alerts
server side code alert people when their members of congress are holding town halls near them. 

## MVP:
User will text a number their zip code, in response they will get all upcoming events in their district (including Senate events). The event information will include the Member of congress, the title, and a link to directions. 

## Stretch Goals:
Ongoing SMS alerts
  - Users will be able to sign up for ongoing alerts in their area. 
  - We will send texts when a new event is posted to the database. 
  - First version: 
     * add users with events to a temp queue endpoint, and then at ~1pm pacific time, send out all texts, and delete the queue. 
  - Second version: 
     * Be smarter about when we send texts, based on when and where the event is occuring
     * send out alerts when events are changed (but only date or location). 
