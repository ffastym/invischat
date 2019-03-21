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
     * @param collection
     * @param query
     *
     * @returns {Promise}
     */
    getData(collection, query = {}) {
        return new Promise ((resolve, reject) => {this.connect().then(
            (db) => {
                db.db(this.dbName)
                    .collection(collection)
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

    insertOne(collection, document) {
        return new Promise ((resolve, reject) => {this.connect().then(
            (db) => {
                db.db(this.dbName)
                    .collection(collection)
                    .insertOne(document, (err, result) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result)
                        }
                    })
                })
            }
        )
    },

    /**
     * Update document in database
     *
     * @param collection
     * @param filter
     * @param update
     *
     * @returns {Promise}
     */
    updateOne(collection, filter, update) {
        return new Promise ((resolve, reject) => {this.connect().then(
            (db) => {
                db.db(this.dbName)
                    .collection(collection)
                    .updateOne(filter, update)
                    .then((obj) => {
                        resolve(obj)
                    }).catch((err) => {
                        reject(err);
                    })
            }
        )});
    },

    /**
     * Delete one document from collection
     *
     * @param collection
     * @param filter
     *
     * @returns {Promise}
     */
    deleteOne(collection, filter) {
        return new Promise ((resolve, reject) => {this.connect().then(
            (db) => {
                db.db(this.dbName)
                    .collection(collection)
                    .deleteOne(filter)
                    .then((obj) => {
                        resolve(obj)
                    }).catch((err) => {
                    reject(err);
                })
            }
        )});
    }
};

export default mongodb;
