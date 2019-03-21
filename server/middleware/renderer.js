import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from '../../src/components/App'
import {StaticRouter} from "react-router-dom"
import path from "path"
import fs from "fs"
import store from "../../src/store"
import {Provider} from "react-redux"
import mongodb from '../mongodb'

let rating = null,
    posts = null;

export default (req, res) => {
    mongodb.getData("app", {"ratingDocument": true}).then((result) => {
        if (result.length && result[0].hasOwnProperty('rating')) {
            rating = result[0].rating;
        }
    }).catch((err) => console.log(err));
    
    if (req.url === '/ziznannya') {
        mongodb.getData("posts").then((result) => {
            posts = result
        }).catch((err) => console.log(err));
    }

    // point to the html file created by CRA's build tool
    const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('err', err);
            return res.status(404).end()
        }

        const context = {};
        // render the app as a string
        const html = ReactDOMServer.renderToString(
            <StaticRouter location={req.url} context={context}>
                <Provider store={store}>
                    <App ssr={true} rating={rating} url={req.url} posts={posts}/>
                </Provider>
            </StaticRouter>
        );

        // inject the rendered app into our html and send it
        return res.send(
            htmlData.replace(
                `<div id="root"></div>`,
                `<div id="root">${html}</div>`
            )
        );
    });
}
