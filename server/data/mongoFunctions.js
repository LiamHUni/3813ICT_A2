const {ObjectId} = require('mongodb');

exports.read = async function(collection, query){
    const items = await collection.find(query).toArray();
    return items;
}

exports.add = async function(collection, item){
    await collection.insertOne(item);
}

exports.remove = async function(collection, query){
    await collection.deleteOne(query);
}

exports.removeAll = async function(collection, query){
    await collection.deleteMany(query);
}

exports.update = async function(collection, query, update){
    await collection.updateOne(query, update);
}