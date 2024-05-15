import User from "@/models/User";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    res.status(401).send("Admin signin required");
  }
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "PUT") {
    return putHandler(req, res);
  } else if (req.method === "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    return res.send({ message: "User deleted successfully" });
  } else {
    await db.disconnect();
    return res.status(404).send({ message: "User Not Found" });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
};

const putHandler = async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  console.log(req.body.isAdmin);
  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin;
    await user.save();
    await db.disconnect();
    return res.send({ message: "User updated successfully" });
  } else {
    await db.disconnect();
    return res.status(404).send({ message: "User not found" });
  }
};

export default handler;
