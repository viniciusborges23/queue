// https://github.com/amqp/rhea-promise
const { Connection } = require('rhea-promise');
const { queueName, connectionOptions } = require('./config');

async function main() {
  const connection = new Connection(connectionOptions);
  await connection.open();
  
  const awaitableSenderOptions = {
    target: {
      address: queueName
    },
    sendTimeoutInSeconds: 3
  };
  const sender = await connection.createAwaitableSender(awaitableSenderOptions);

  for (let i = 1; i <= 10; i++) {
    const message = {
      body: JSON.stringify({id: i})
    };
    
    const delivery = await sender.send(message);
    console.log(
      "[%s] await sendMessage -> Delivery id: %d, settled: %s",
      connection.id,
      delivery.id,
      delivery.settled
    );
  }

  // await sender.send({ body: '1' });

  await sender.close();
  await connection.close();
}

main().catch((err) => console.log(err));