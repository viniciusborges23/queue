// https://github.com/amqp/rhea-promise
const { Connection, ReceiverEvents } = require('rhea-promise');
const { queueName, connectionOptions } = require('./config');

async function main() {
  const connection = new Connection(connectionOptions);
  await connection.open();

  const receiverOptions = {
    source: {
      address: queueName
    },
    credit_window: 2,
    autoaccept: false,
  };

  const receiver = await connection.createReceiver(receiverOptions);
  receiver.on(ReceiverEvents.message, (context) => {
    const { message, delivery } = context;
    
    try {
      console.log("Received message: %O", message);
      const obj = JSON.parse(message.body);

      // if (message.delivery_count > 2) {
      //   delivery.reject();
      //   return;
      // }

      // if (obj.id === undefined) {
      //   throw new Error('Object sem id!');
      // }
      
      delivery.accept();
    } catch (e) {
      console.log({error: e.message});

      // delivery.release({ delivery_failed: true });
    }

    receiver.addCredit(1);
  });

  // await receiver.close();
  // await connection.close();
}

main().catch((err) => console.log(err));