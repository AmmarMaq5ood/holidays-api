const express = require('express');
const holidaysRouter = require('./routes/holidays');
const countriesRouter = require('./routes/countries');

const app = express();
const port = process.env.PORT || 3000;

app.use('/api', holidaysRouter);
app.use('/api', countriesRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});