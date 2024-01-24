const express = require('express');
const router = express.Router();
// import * as Onesignal from '@onesignal/node-onesignal';
const sdk = require('api')('@onesignal/v9.0#7bax30lfo8ah5k');
const OneSignal = require('@onesignal/node-onesignal');




//this router for sending notifications to all subscribed devices
router.post('/sendNotifications/allUsers', async (req, res, next) => {
    console.log(req.body.message)
    
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
    notification.included_segments = ['Total Subscriptions'];
    notification.headings = { en: 'My Notification' };
    notification.contents = { en: req.body.message };
  
    try {
      const response = await client.createNotification(notification);
      res.json(response);
    } catch (error) {
  
      if (error.body && error.body.errors && error.body.errors.length > 0) {
        console.error('OneSignal Error:', error.body.errors[0].message);
      }
  
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  //this router for sending notification to specific device using player Ids
router.post('/sendNotifications/specificUsers', async (req, res, next)=> {
    console.log(req.body.message)

    const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID; 
        
    const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

    const app_key_provider = {
        getToken(){
            return ONESIGNAL_API_KEY;
        
        },
        
    };
    const configuration = OneSignal.createConfiguration({
        authMethods: {
            app_key: {
                tokenProvider: app_key_provider
            },
        
        },
    });
    const client = new OneSignal.DefaultApi(configuration);

    const notification = new OneSignal.Notification();
    notification.app_id = ONESIGNAL_APP_ID;
    
    // getting all the users who installed the application
    const players = await client.getPlayers(ONESIGNAL_APP_ID);
    console.log(players.players);

    const playerIdArr = players.players.map(player => player.id); // returning only id's of all the players 
    console.log(playerIdArr);

    notification.include_player_ids = [playerIdArr[1]]; // providing multiple "subscription id's" in an array 
    notification.headings = { en: 'My Notification' }; // notification heading 
    notification.contents = {    // notification content
        en: req.body.message
    };
    



    try {
        const response = await client.createNotification(notification);
        res.json(response);
    } catch (error) {
        console.error('Error sending notification:', error);

        if (error.body && error.body.errors && error.body.errors.length > 0) {
        console.error('OneSignal Error:', error.body.errors[0].message);
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/onesignalPlayerId', async (req, res) => {
  console.log(req.body.playerID)
})


module.exports = router;