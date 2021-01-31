var express = require("express");
var router = express.Router();

let service = require("../data/mongo");

/**
 * apman general message list messages
 */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/addmessage", (req, res) => {
  console.log("body:", req.body);
  res.sendStatus(200);
});

router.post("/savemessage", function (req, res, next) {
  let message = req.body;
  if (!message) {
    res.json({ body: "parametre null olamaz." }).status(400);
  } else {
    service
      .HasMessageControl(message.property)
      .then((r) => {
        if (r) {
          res
            .send({ errorMessage: "Mesaj daha önce tanımlanmış." })
            .status(400);
        } else {
          service
            .InsertMessage(message)
            .then((data) => {
              res.sendStatus(200);
            })
            .catch((err) => {
              console.log(err);
              res.sendStatus(400);
            });
        }
      })
      .catch((er) => {
        console.log(er);
        res.sendStatus(400);
      });
  }
});

router.post("/deletemessage", function (req, res, next) {
  let message = req.body;
  if (!message) {
    res.json({ body: "parametre null olamaz." }).status(400);
  } else {
    service.DeleteMessage(message.property);
    res.send({ asdas: "dsds" }).status(200);
  }
});

router.post("/updatemessage", function (req, res, next) {
  let message = req.body;
  if (!message) {
    res.json({ body: "parametre null olamaz." }).status(400);
  } else {
    service.UpdateMessage(message);
    res.send({ asdas: "dsds" }).status(200);
  }
});

router.post("/getall", function (req, res, next) {
  service
    .SelectAllMessages()
    .then((data) => {
      res.send({ value: data }).status(200);
    })
    .catch((err) => {
      res.send({ errorMessage: "mesaj listesi alınamadı." }).status(500);
    });
});

router.post("/selectmessage", function (req, res, next) {
  if (!req.body.property) {
    res.sendStatus(400);
  } else {
    service
      .SelectMessageByProperty(req.body.property)
      .then((data) => {
        res.send({ value: data }).status(200);
      })
      .catch((err) => {
        res.send({ errorMessage: "mesaj listesi alınamadı." }).status(500);
      });
  }
});

module.exports = router;
