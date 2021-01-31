let mongoose = require("mongoose");
// getting-started.js
const Message = require("./models/message");
const Divit = require("./models/divit");

const connectionstring = "mongodb://localhost:27018/apmanmsg";
mongoose.connect(
  connectionstring,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      throw err;
    } else {
      console.log("database connection successfully");
    }
  }
);

async function HasMessageControl(property) {
  return await Message.findOne({ property: property }, (err, dbres) => {
    if (err) return Promise.reject(err);
    else {
      return Promise.resolve(dbres);
    }
  });
}

async function InsertMessage(contract) {
  let message = new Message({
    property: contract.property,
    author: contract.author,
    description: contract.description,
  });

  message.save((err) => {
    if (err) {
      return Promise.reject(err);
    } else {
      console.log("saved new message:", contract);
      return Promise.resolve({ value: 1 });
    }
  });
}

async function DeleteMessage(property) {
  await Message.deleteOne({ property: property }, (err) => {
    if (err) console.log(err);
    else console.log("deleted message:", property);
  });
}

async function UpdateMessage(message) {
  await Message.updateOne(
    { property: message.property },
    { author: message.author, description: message.description },
    (err, res) => {
      if (err) console.log(err);
      else {
        console.log("updated", res);
      }
    }
  );
}

/**
 * bütün mesajları getirir.
 */
async function SelectAllMessages() {
  return await Message.find((err, data) => {
    if (err) {
      return Promise.reject(err);
    } else {
      console.log(data);

      return Promise.resolve(data);
    }
  });
}

async function SelectMessageByProperty(propertyName) {
  return await Message.find({ property: propertyName }, (err, data) => {
    if (err) {
      return Promise.reject(err);
    } else {
      return Promise.resolve(data);
    }
  });
}

//#region Divit transactions
/**
 * divit kaydı
 * @param {Divit} divitContract
 */
async function SaveNewDivit(divitContract) {
  console.log("kaydedilecek divit bilgileri:", divitContract);

  let divit = new Divit({
    divitInstanceId: divitContract.DivitInstanceId,
    title: divitContract.Title,
    description: divitContract.Description,
    content: divitContract.Content,
  });

  await divit.save((err) => {
    if (err) {
      return Promise.reject(err);
    } else {
      console.log("divit kaydedildi:", divit.divitInstanceId);
      return Promise.resolve({ value: 1 });
    }
  });
}

//#endregion

module.exports = {
  InsertMessage,
  DeleteMessage,
  UpdateMessage,
  SelectAllMessages,
  SelectMessageByProperty,
  HasMessageControl,
  SaveNewDivit,
};
