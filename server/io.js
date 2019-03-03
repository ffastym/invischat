import express from 'express'
import serverRenderer from './middleware/renderer'
import socketIo from 'socket.io';

const compression = require('compression'),
    app = express(),
    router = express.Router(),
    path = require('path'),
    PORT = 3001;

router.use('^/$', serverRenderer);
router.use(express.static(
    path.resolve(__dirname, '..'),
    {maxAge: '30d'},
));

// tell the app to use the above rules
app.use(router);
app.use(compression());
app.use(express.static(__dirname + '/'));
//Store all JS and CSS in Scripts folder.

// start the app
const server = app.listen(process.env.PORT || PORT, (error) => {
    if (error) {
        return console.log('Server listening error', error);
    }
});

const io = socketIo(server);

export default io;