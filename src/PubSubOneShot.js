import PubSub from 'pubsub-js';

export function oneShot(reqTopic, reqData, respTopic) {
  return new Promise((resolve, reject) => {
    let token = PubSub.subscribe(respTopic, (topic, data) => {
      PubSub.unsubscribe(token);
      resolve(data);
    });

    PubSub.publish(reqTopic, reqData);
  });
}
