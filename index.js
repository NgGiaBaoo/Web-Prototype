const express = require("express");

const app = express();

app.use(express.json());

app.get('/api/get', (req, res) => {

    res.json({
        message: 'This is a GET request!'
    });

});

app.post('/api/post', (req, res) => {

    console.log(req.body);

    res.json({
        message: 'This is a POST request!',
        data: req.body
    });

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});