const Sauce = require("../models/sauces");
const fs = require("fs");

exports.create = (req, res, next) => {
  const objetSauce = JSON.parse(req.body.sauce);
  delete objetSauce._id;
  delete objetSauce._userId;
  const sauce = new Sauce({
    ...objetSauce,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modify = (req, res, next) => {
  let sauceObject = {};
  req.file
    ? (Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${filename}`);
      }),
      (sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }))
    : (sauceObject = { ...req.body });
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.like = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.usersDisliked.indexOf(req.body.userId) >= 0) {
        return res
          .status(400)
          .json({ message: "Impossible d'aimer une sauce qui a été dislike." });
      }
      if (sauce.usersLiked.indexOf(req.body.userId) >= 0) {
        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
        sauce.likes -= 1;
      } else {
        sauce.usersLiked.push(req.body.userId);
        sauce.likes += 1;
      }
      Sauce.updateOne({ _id: sauce._id }, sauce)
        .then(() => res.status(200).json({ message: "Sauce liké" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
exports.dislike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.usersLiked.indexOf(req.body.userId) >= 0) {
        return res
          .status(400)
          .json({ message: "Impossible de dislike une sauce qui a été liké." });
      }
      if (sauce.usersDisliked.indexOf(req.body.userId) >= 0) {
        sauce.usersDisliked.splice(
          sauce.usersDisliked.indexOf(req.body.userId),
          1
        );
        sauce.dislikes -= 1;
      } else {
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes += 1;
      }
      Sauce.updateOne({ _id: sauce._id }, sauce)
        .then(() => res.status(200).json({ message: "Sauce disliké" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
exports.delete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
exports.getOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAll = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};
