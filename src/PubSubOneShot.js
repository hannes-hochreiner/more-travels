import PubSub from 'pubsub-js';
import uuid from 'uuid';

export function oneShot(topic, data) {
  return new Promise((resolve, reject) => {
    let id = uuid();
    let respToken = PubSub.subscribe(`${topic}.response.${id}`, (respTopic, respData) => {
      PubSub.unsubscribe(respToken);
      PubSub.unsubscribe(errToken);
      resolve(respData);
    });
    let errToken = PubSub.subscribe(`${topic}.error.${id}`, (respTopic, respData) => {
      PubSub.unsubscribe(respToken);
      PubSub.unsubscribe(errToken);
      reject(respData);
    });

    PubSub.publish(`${topic}.request.${id}`, data);
  });
}
