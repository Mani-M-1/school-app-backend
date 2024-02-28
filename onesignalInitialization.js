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


module.exports = onesignalInitialization;