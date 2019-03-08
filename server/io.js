import express from 'express'
import serverRenderer from './middleware/renderer'
import Cloudinary from './cloudinary';
import socketIo from 'socket.io';
import sslRedirect  from 'heroku-ssl-redirect'

const compression = require('compression'),
    app = express(),
    router = express.Router(),
    path = require('path'),
    PORT = 3001;

router.get('/', serverRenderer);
router.get('/chat', serverRenderer);
router.get('/privacy_policy', serverRenderer);
router.get('/contact_us', serverRenderer);
router.use(express.static(path.resolve(__dirname, '..', '..', 'build')));

// tell the app to use the above rules
app.use(sslRedirect);
app.use(router);
app.use(compression());
app.use(express.static(path.resolve(__dirname, '..', 'build')));
//Store all JS and CSS in Scripts folder.

// start the app
const server = app.listen(process.env.PORT || PORT, (error) => {
    setInterval(Cloudinary.removeAllUploads, 600000);

    if (error) {
        return console.log('Server listening error', error);
    }
});

const io = socketIo(server);

export default io;