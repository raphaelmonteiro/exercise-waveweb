const app = require('./src/server');

app.listen(process.env.PORT, () => console.log(`App listening on http://127.0.0.1:${process.env.PORT}`));