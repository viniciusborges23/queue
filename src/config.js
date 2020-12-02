const connectionOptions = {
  host: 'localhost',
  username: 'admin',
  password: 'admin',
  scheme: 'amqp',
  port: '5672'
};

const queueName = 'test';

module.exports = {
  queueName,
  connectionOptions
};
