const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
const start = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://mination:ubvyfpbz13@cluster0.gymnq.mongodb.net/?retryWrites=true&w=majority'
		);
		app.listen(PORT, () => console.log(`server started on port ${PORT}`));
	} catch (error) {
		console.log(error);
	}
};

start();
