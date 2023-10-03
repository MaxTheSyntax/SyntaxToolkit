import express from 'express';
const app = express();

function RGL() {
	app.get('/remotegamelaunch', (req, res) => {
		res.send(req.query.appid);
	});

	app.listen(3000, () => {
		console.log(`Ready for remote game launching at port 3000`);
	});

	return <></>;
}

export default RGL;
