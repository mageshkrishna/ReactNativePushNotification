const express = require('express');
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