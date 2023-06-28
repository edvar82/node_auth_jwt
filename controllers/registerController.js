const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, email, pwd } = req.body;
  if (!user || !email || !pwd) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) {
    return res.status(409).json({ error: "Email já cadastrado!" });
  }

  try {
    const hash = await bcrypt.hash(pwd, 10);

    const result = await User.create({
      username: user,
      email: email,
      password: hash,
    });

    console.log(result);

    res.status(201).json({ sucesso: "Usuario criado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
