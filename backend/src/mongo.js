const mongoose = require("mongoose");

const args = process.argv.length;
if (args !== 3 && args !== 5) {
  console.log(
    "Incorrect number of aguments, use: node mongo.js <password> [<name> <number>]"
  );
  process.exit(1);
}

const username = "fullstack";
const password = process.argv[2];

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.gbuly.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
);

const Person = mongoose.model(
  "Person",
  new mongoose.Schema({
    name: String,
    number: String,
  })
);

if (args === 3) {
  Person.find().then(resluts => {
    console.log("phonebook:");
    resluts.forEach(p => console.log(`${p.name} ${p.number}`));
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
