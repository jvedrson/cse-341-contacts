const mongoDB = require("../db/database");
const ObjectId = require("mongodb").ObjectId;

async function getAll(req, res) {
  // #swagger.tags = ["Contacts"]
  const contacts = await mongoDB
    .getDatabase()
    .collection("contacts")
    .find()
    .toArray();

  if (!contacts || contacts.length === 0) {
    return res.status(404).json({ message: "Contacts not found" });
  }

  return res.json(contacts);
}

async function getById(req, res) {
  // #swagger.tags = ["Contacts"]
  const contactId = req.params.id;
  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  const contactObjectId = new ObjectId(contactId);

  const contact = await mongoDB
    .getDatabase()
    .collection("contacts")
    .findOne({ _id: contactObjectId });

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  return res.json(contact);
}

async function create(req, res) {
  // #swagger.tags = ["Contacts"]
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({
      message:
        "firstName, lastName, email, favoriteColor, and birthday are required",
    });
  }

  const newContact = { firstName, lastName, email, favoriteColor, birthday };
  const result = await mongoDB
    .getDatabase()
    .collection("contacts")
    .insertOne(newContact);

  if (result.acknowledged) {
    return res.status(201).json({ id: result.insertedId });
  }

  return res.status(500).json({ message: "Failed to create contact" });
}

async function update(req, res) {
  // #swagger.tags = ["Contacts"]
  const contactId = req.params.id;
  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }
  const contactObjectId = new ObjectId(contactId);

  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  const updateFields = {};

  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (email) updateFields.email = email;
  if (favoriteColor) updateFields.favoriteColor = favoriteColor;
  if (birthday) updateFields.birthday = birthday;

  if (Object.keys(updateFields).length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field is required to update" });
  }

  const result = await mongoDB
    .getDatabase()
    .collection("contacts")
    .updateOne({ _id: contactObjectId }, { $set: updateFields });

  if (result.modifiedCount > 0) {
    return res.json({ message: "Contact updated" });
  }

  return res
    .status(404)
    .json({ message: "Some error occurred, contact not updated" });
}

async function deleteContact(req, res) {
  // #swagger.tags = ["Contacts"]
  const contactId = req.params.id;
  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID" });
  }

  const contactObjectId = new ObjectId(contactId);

  const result = await mongoDB
    .getDatabase()
    .collection("contacts")
    .deleteOne({ _id: contactObjectId });

  if (result.deletedCount > 0) {
    return res.json({ message: "Contact deleted" });
  }

  return res
    .status(404)
    .json({ message: "Some error occurred, contact not deleted" });
}

module.exports = { getAll, getById, create, update, deleteContact };
