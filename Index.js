const app = require('./App');
const { connectToDb, connectToCloudinary } = require('./config/Database');

const PORT = process.env.PORT || 3500;
connectToDb();
connectToCloudinary();
app.listen(PORT, () => {
	console.log(`server is runing at ${PORT}`);
});
