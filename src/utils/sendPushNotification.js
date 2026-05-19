// utils/sendPushNotification.js
import webpush from "../config/webPush.js";
import PushSubscription from "../models/pushSubscription.model.js";

const sendPushNotification = async ({ title, body, url }) => {
  const subs = await PushSubscription.find({ role: "admin" });

  const payload = JSON.stringify({
    title,
    body,
    url,
  });

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys,
        },
        payload,
      );
    } catch (err) {
      // Remove invalid subscriptions
      if (err.statusCode === 410 || err.statusCode === 404) {
        await PushSubscription.deleteOne({
          endpoint: sub.endpoint,
          user: sub.user,
        });
      }
    }
  }
};

export default sendPushNotification;
