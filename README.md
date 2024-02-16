# ReactNativePushNotification
Learn how to send and receive push notifications in your mobile apps using Node.js for server-side logic and React Native for client-side implementation.

# create an react native app with expo 

 npx create-expo-app React_native_push_notification

# Step 1 : Install all the packages required for the frontend (react native)

   >`npx expo install expo-notifications expo-device expo-constants`

   >`npm install -g expo-cli`

   >`npm install --global eas-cli`

# Step 2 : Generate a expo project_id

   >First log into your account. If you dont have create One. Once you logged in click **Projects** in the side navbar. Now click **Create new project** then give a name for you project.
   
   >It will genarate a project id like this:
   
      copy this : eas init --id 2aa0ef9b-c03e-4e7d-93e6-yourid 
	 
  >Now to go to you terminal of frontend 
   
      Type command : npx expo login

   >Give your username and password in the terminal  after successfull login 

      Type command : eas init --id 2aa0ef9b-c03e-4e7d-93e6-yourid
	   
# Step 3 : Add this code to app.js in React native
```import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet, StatusBar } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const { expoConfig } = Constants;
    const { extra } = expoConfig;
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: extra.projectId,
    })).data;
    console.log('Expo Push Token:', token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  console.log("Yourexpotoken:   "+expoPushToken);
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```
# Hurray you successfully completed the ReactNative frontend

  >Type command : `npx expo start` to check whether the token is printed in the terminal and also copy it

# Step 4 : Install the neccessary packages for Node server

 >Type command:`npm init`

 >Type command:`npm install body-parser express node-fetch`

# Step 5 : create an index file and add this code.

```const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


app.post('/send-push-notification', async (req, res) => {
  try {
    const { expoPushToken, title, body, data } = req.body;

    
    let fetch;
    try {
      fetch = await import('node-fetch');
    } catch (error) {
      console.error('Error importing node-fetch:', error);
      return res.status(500).json({ success: false, message: 'Failed to send push notification' });
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title || 'Default Title',
      body: body || 'Default Body',
      data: data || {},
    };
    console.log(message);

    const response = await fetch.default('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('Push notification sent:', result);

    res.status(200).json({ success: true, message: 'Push notification sent successfully' });
  } catch (error) {
    console.error('Error sending push notification:', error);
    res.status(500).json({ success: false, message: 'Failed to send push notification' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
# Hurray you also completed the Node backend now check it in the post man;
 >Postman : http://localhost:3000/send-push-notification
 >Go to body and choose raw then json
 ```
  {
  "expoPushToken": "ExponentPushToken[G_1gKGE8wWzH_7EzXDhl_-]",
  "sound": "default",
  "title": "If it worked!",
  "body": "subscribe to my youtube channel!"
  }
```
### “Success is not final; failure is not fatal: It is the courage to continue that counts." — Winston S. Churchill“
  

