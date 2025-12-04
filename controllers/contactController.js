const db = require('../db.js');

const getContacts = (req, res) => {
  const query = 'SELECT * FROM Contacts';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
        res.json(results);
  });
};

const createContact = (req, res) => {
  const { name, email, mobile, city, message } = req.body;
  const query = 'INSERT INTO Contacts (name, email, mobile, city, message) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, email, mobile, city, message], (err, results) => {
    if(err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId})
  })
};

const updateContact = (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, city, message } = req.body;
  query = 'UPDATE Contacts SET name = ?, email = ?, mobile = ?, city = ?, message = ? WHERE id = ?';
  db.query(query, [name, email, mobile, city, message, id], (err) => {
    if(err) return res.status(500).json({error: err.message});
    res.json({message: 'Update Successfully'});
  });
};

const deleteContact = (req, res) => {
  const { id } = req.params;
  query = 'DELETE FROM Contacts WHERE id = ?';
  db.query(query, [id], (err) => {
    if(err) return res.status(500).json({error: err.message});
    res.json({message: 'Contact deleted successfully' });
  });
};


module.exports = { getContacts, createContact, updateContact, deleteContact };