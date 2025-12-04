const db = require('../db.js');

const getPosts = (req, res) => {
    const query = 'SELECT * FROM posts';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const getPost = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM posts WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

const createPost = (req, res) => {
    const { title, content } = req.body;
    const query = 'INSERT INTO posts (title, content) VALUES (?, ?)';
    db.query(query, [title, content], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId });
    });
};

const updatePost = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
    db.query(query, [title, content, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post updated successfully' });
    });
};

const deletePost = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM posts WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post deleted successfully' });
    });
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
