import express from 'express'
import serverRenderer from './middleware/renderer'
import enforce from 'express-sslify'
import Cloudinary from './cloudinary';
import socketIo from 'socket.io';

const compression = require('compression'),
    app = express(),
    router = express.Router(),
    path = require('path'),
    PORT = 3001;

router.get('/', serverRenderer);
router.get('/chat', serverRenderer);
router.get('/privacy_policy', serverRenderer);
router.get('/contact_us', serverRenderer);
router.get('/ziznannya', serverRenderer);
router.get('/ziznannya/:post_id', serverRenderer);
router.get('/ziznannya/new_post', serverRenderer);
router.use(express.static(path.resolve(__dirname, '..', '..', 'build')));

//app.use(enforce.HTTPS({ trustXForwardedHostHeader: true,  trustProtoHeader: true }));
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