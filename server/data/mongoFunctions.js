const {ObjectId} = require('mongodb');

exports.read = async function(collection, query){
    // console.log(query);
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

exports.update = async function(collection, req, res){
    const {product} = req.body
    const id = new ObjectId(product._id);
    const items = await collection.countDocuments({id:product.id, _id:{$ne:id}});
    console.log(items);
    if(items>0){
        res.json({err:"Duplicate ID: Please use different ID"});
    }else{
        console.log(id);
        const {_id, ...updateInfo} = product; 
        await collection.updateOne({_id:id}, {$set:updateInfo});
        res.json({mess:"Item updated"});
    }
}