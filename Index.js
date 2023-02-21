const app = require('./App');
const { connectToDb } = require('./config/Database');

const PORT = process.env.PORT || 3500;
connectToDb();

app.listen(PORT, () => {
	console.log(`server is runing at ${PORT}`);
});
