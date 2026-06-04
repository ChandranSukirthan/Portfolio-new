const mongoose = require('mongoose');

const uri = "mongodb://sukirsukirthan347_db_user:0xaLMb7qPjyGVSdm@ac-qwrqdme-shard-00-00.rbyxcsx.mongodb.net:27017,ac-qwrqdme-shard-00-01.rbyxcsx.mongodb.net:27017,ac-qwrqdme-shard-00-02.rbyxcsx.mongodb.net:27017/?ssl=true&replicaSet=atlas-123aza-shard-0&authSource=admin&appName=pro";

console.log("Connecting to MongoDB with URI:", uri.replace(/:([^@]+)@/, ":****@"));

mongoose.connect(uri, {
  bufferCommands: false
})
.then(() => {
  console.log("SUCCESS: Connected to MongoDB Atlas successfully!");
  process.exit(0);
})
.catch(err => {
  console.error("ERROR connecting to MongoDB Atlas:");
  console.error(err);
  process.exit(1);
});
