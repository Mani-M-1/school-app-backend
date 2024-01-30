const express = require('express');
const router = express.Router();
// import * as Onesignal from '@onesignal/node-onesignal';
const sdk = require('api')('@onesignal/v9.0#7bax30lfo8ah5k');
const OneSignal = require('@onesignal/node-onesignal');





function onesignalInitialization() {
  const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID; 
        
    const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

    const app_key_provider = {
      getToken() {
        return ONESIGNAL_API_KEY;
      },
    };
  
    const configuration = OneSignal.createConfiguration({
      authMethods: {
        app_key: {
          tokenProvider: app_key_provider,
        },
      },
    });
  
    const client = new OneSignal.DefaultApi(configuration);
  
    const notification = new OneSignal.Notification();
    notification.app_id = ONESIGNAL_APP_ID;

    return {client, notification};
}




//this router for sending notifications to all subscribed devices
router.post('/sendNotifications/allUsers', async (req, res, next) => {

    const {client, notification} = onesignalInitialization(); // getting "client" & "notification" from the "onesignalInitialization()" function

    notification.included_segments = ['Total Subscriptions'];
    notification.headings = { en: req.body.heading };
    notification.contents = { en: req.body.content };
  
    try {
      const response = await client.createNotification(notification);
      res.json(response);
    } 
    catch (error) {

      if (error.body && error.body.errors && error.body.errors.length > 0) {
        console.error('OneSignal Error:', error.body.errors[0].message);
      }
  
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  //this router for sending notification to specific device using player Ids
router.post('/sendNotifications/specificUsers', async (req, res, next)=> {
  
  const {client, notification} = onesignalInitialization(); // getting "client" & "notification" from the "onesignalInitialization()" function

  // const playersExternalIdsArr = players.players.map(player => player.external_user_id); // returning only id's of all the players 
  // console.log(playersExternalIdsArr);

  // notification.include_player_ids = [playerIdArr[1]]; // providing multiple "subscription id's" in an array 
  notification.include_external_user_ids = req.body.externalIdsArr; // providing multiple "subscription id's" in an array 
  notification.headings = { en: req.body.heading }; // notification heading 
  notification.contents = { en: req.body.content}; // notification content
  
  // fetchUsersByExternalId(req.body.externalId);
      


  try {
    const response = await client.createNotification(notification);
    res.json(response);
  } 
  catch (error) {
    console.error('Error sending notification:', error);

    if (error.body && error.body.errors && error.body.errors.length > 0) {
    console.error('OneSignal Error:', error.body.errors[0].message);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// router.post('/onesignalPlayerId', async (req, res) => {
//   console.log(req.body.playerID)
//   // res.status(200).json(req.body.playerID);
// })


// async function fetchUsersByExternalId(externalId) {
//   const url = `https://onesignal.com/api/v1/players?app_id=${process.env.ONESIGNAL_APP_ID}&external_user_id=${externalId}`
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json; charset=utf-8',
//       'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`
//     }
//   }
//   const response = await fetch(url, options)
//   const data = await response.json();
//   console.log(data);

// }

// fetchUsersByExternalId("d9b4ed7a-cf64-4505-a522-06aad8447dcc");

// const axios = require('axios');

// const appId = 'YOUR_ONESIGNAL_APP_ID';
// const restApiKey = 'YOUR_REST_API_KEY';
// const externalId = 'USER_EXTERNAL_ID'; // Replace with the actual external ID of the user

// const headers = {
//   'Content-Type': 'application/json; charset=utf-8',
//   'Authorization': `Basic ${restApiKey}`
// };

// axios.get(`https://onesignal.com/api/v1/players?app_id=${appId}&external_user_id=${externalId}`, { headers: headers })
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });

module.exports = router;