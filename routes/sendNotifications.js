const express = require('express');
const router = express.Router();
// import * as Onesignal from '@onesignal/node-onesignal';
const sdk = require('api')('@onesignal/v9.0#7bax30lfo8ah5k');
const OneSignal = require('@onesignal/node-onesignal');

router.post('/sendNotification', async (req, res, next)=> { 
    console.log("hello");

    try {
        const ONESIGNAL_APP_ID = 'd3feb1d4-dcd3-468f-826f-5481d02c64d3';
        console.log(ONESIGNAL_APP_ID);

        const app_key_provider = {
            getToken(){
                return 'MzU1ZjFkYWUtOGQwNS00ZmJiLWIzZmMtYTZlZmIwYzU2MTE3';
            
            }
            
        };
        const configuration = OneSignal.createConfiguration({
            authMethods: {
                app_key: {
                    tokenProvider: app_key_provider
                }
            
            }
        });
        const client = new OneSignal.DefaultApi(configuration);

        const notification = new OneSignal.Notification();
        
        notification.app_id = ONESIGNAL_APP_ID;
        
        notification.included_segments = ['Subscribed Users'];
        
        // written by "manikanta" 
        //start
        // const targetUserId = '654c7c8da6e94f0a9695919b';

        // notification.include_player_ids = [targetUserId]
        // end


        notification.contents = {
            en: req.body.hello
        };

        const {id} = await client.createNotification(notification);
        
        const response = await client.getNotification(ONESIGNAL_APP_ID, id);
        console.log(response);
        res.status(200).json(response)

        // console.log(`Notification sent to user ${targetUserId}, Notification ID: ${id}`);


        // res.status(200).json("notification sent successfully")
    }
    catch(err) {
        res.status(500).json({
            err_msg: "API Error occured while sending notification",
            error: err.message
        });
    }
});

// const sdk = require('api')('@onesignal/v9.0#7bax30lfo8ah5k');

// router.post('/notifications', (req, res, next) => {
//     console.log("hello");
//     sdk.createNotification({
//       included_segments: ['Subscribed Users'],
//       contents: {
//         en: 'English or Any Language Message',
//         es: 'Spanish Message'
//       },
//     //   name: 'INTERNAL_CAMPAIGN_NAME'
//     }, {
//       authorization: 'Basic MzU1ZjFkYWUtOGQwNS00ZmJiLWIzZmMtYTZlZmIwYzU2MTE3'
//     })
//       .then(({ data }) => console.log(data))
//       .catch(err => console.error(err)); 
// })
module.exports = router;