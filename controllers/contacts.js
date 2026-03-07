const mongoDB = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

async function getAll(req, res) {
  const contacts = await mongoDB.getDatabase().collection("contacts").find().toArray();
  if (!contacts || contacts.length === 0) {
    return res.status(404).json({ message: "Contacts not found" });
  }
  return res.json(contacts);
}

async function getById(req, res) {
  const contactId = req.params.id;
  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }
  const contactObjectId = new ObjectId(contactId);
  const contact = await mongoDB.getDatabase().collection("contacts").findOne({ _id: contactObjectId });
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  return res.json(contact);
}

module.exports = { getAll, getById };