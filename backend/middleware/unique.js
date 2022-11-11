module.exports = (req, res, next) => {
  let sauceExistante = false;

  Object.entries(req.body).forEach((value) => {
    if (typeof value[1] === "object") {
      console.log("Detected ====> " + value[0] + " Value =====>", value[1]);
      sauceExistante = true;
    }
  });

  if (sauceExistante) {
    return res.status(403).json({ error: "Detected !" });
  }
  next();
};
