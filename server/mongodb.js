import {MongoClient} from 'mongodb'

const mongodb = {
    /**
     * Name of database
     */
    dbName: "heroku_gzr12fqb",

    /**
     * Database url
     */
    url: "mongodb://admin:magent0@ds159073.mlab.com:59073/heroku_gzr12fqb",

    /**
     * Connect to database
     *
     * @returns {Promise<MongoClient>}
     */
    connect() {
        return MongoClient.connect(this.url,{useNewUrlParser: true})
    },

    /**
     * Fetching documents from database
     *
     * @param query
     *
     * @returns {Promise}
     */
    getData(query) {
        return new Promise ((resolve, reject) => {this.connect().then(
            (db) => {
                db.db(this.dbName)
                    .collection("app")
                    .find(query)
                    .toArray((err, result) => {
                        if (err) {
                            reject(err)
                        }

                        resolve(result);
                        db.close();
                    });
            }
        )});
    },

    /**
     * Update document in database
     *
     * @param filter
     * @param newDocument
     *
     * @returns {Promise}
     */
    updateOne(filter, newDocument) {
        return new Promise ((resolve, reject) => {this.connect().then(
            (db) => {
                db.db(this.dbName)
                    .collection("app")
                    .updateOne(
                        filter,
                        {$set: newDocument}
                    ).then((obj) => {
                        resolve(obj)
                    }).catch((err) => {
                        reject(err);
                    })
            }
        )});
    }
};

export default mongodb;
