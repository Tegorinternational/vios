const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const contactRoutes = require('./routes/contacts');
const videoRoutes = require("./controllers/videoController");

const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173', // Your frontend URL
//     credentials: true, // Allow credentials (cookies)
// }));

app.use(cors({
    origin: true,
    credentials: true
}));



app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/contacts', contactRoutes);
app.use("/api/videos", require("./routes/video"));
app.use("/uploads", express.static("uploads"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});