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
  const objetSauce = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete objetSauce._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non authorisé !" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...objetSauce, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Succés !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
exports.like = (req, res) => {
  const userId = req.body.userId;

  Sauce.findById(req.params._id)
    .then((sauce) => {
      let userVoteDB = 0;
      if (sauce.usersLiked.includes(userId)) userVoteDB = 1;
      if (sauce.usersDisliked.includes(userId)) userVoteDB = -1;
      return { sauce, userVoteDB };
    })
    .then((data) => {
      let userVoteDB = data.userVoteDB;
      let update = {};
      let message;

      switch (req.body.like) {
        case 1:
          update.$push = { usersLiked: userId };
          update.$inc = { likes: +1 };

          message = "Like successfully send !";
          break;
        case -1:
          update.$push = { usersDisliked: userId };
          update.$inc = { dislikes: +1 };

          message = "DisLike  successfully sent !";
          break;
        case 0:
          switch (userVoteDB) {
            case 1:
              update.$pull = { usersLiked: userId };
              update.$inc = { likes: -1 };
              message = "Like successfully remove !";
              break;
            case -1:
              update.$pull = { usersDisliked: userId };
              update.$inc = { dislikes: -1 };
              message = "Dislike successfully remove !";

              break;
            case 0:
              return res.status(200).json({ message: "Same !" });
          }
          break;
      }

      Sauce.findByIdAndUpdate(req.params._id, update, () => {
        return res.status(200).json({ message: message });
      });
    });
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
