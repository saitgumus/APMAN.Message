const { Kafka } = require("kafkajs");
let MongoService = require("../../data/mongo");

console.log("lets Kafka...");

const kafka = new Kafka({
  clientId: "apman-message-service",
  brokers: ["localhost:9092"],
});

async function createTopic() {
  const adminKafka = kafka.admin();
  console.log("kafka broker bağlanıyor.");

  await adminKafka.connect();

  console.log(" bağlantı başarılı.");

  await adminKafka.createTopics({
    topics: [
      {
        topic: "apmandivit",
        numPartitions: 1,
      },
      {
        topic: "messagetopic",
        numPartitions: 2,
      },
    ],
  });
  console.log("topics generated.");

  await adminKafka.disconnect();
}

const producer = kafka.producer();

const sendKafkaMessage = async () => {
  await producer.connect();
  // await producer.send({
  //   topic: "messagetopic",
  //   messages: [{ value: "hello from apman message service!!" }],
  // });
  let counter = 0;
  setInterval(async () => {
    counter++;
    await producer.send({
      topic: "apmandivit",
      messages: [
        {
          value: JSON.stringify({
            title: "test title",
            description: "açıklama",
          }),
        },
      ],
    });
  }, 3000);

  //await producer.disconnect();
};

const consumer = kafka.consumer({
  groupId: "apman-message",
});
const consumeKafkaMessage = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "messagetopic",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

const consumeApmanDivit = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "apmandivit",
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let divitMessage = message;
      let divit = JSON.parse(divitMessage.value.toString());
      console.log("divit alındı.");
      MongoService.SaveNewDivit({ ...divit })
        .then((res) => {
          if (res && res.value) console.log("divit added successfully..");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
};

//createTopic();
//sendKafkaMessage();
consumeApmanDivit();
