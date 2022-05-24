require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

morgan.token(
  "body",
  request =>
    request.method.toLowerCase() === "post" ? JSON.stringify(request.body) : " "
);

const app = express();
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get("/health", (_, res) => res.send("ok"));

app.get("/version", (_, res) => res.send(require("./version")));

app.get("/info", (_request, response, next) => {
  Person.find()
    .then(persons => {
      const d = new Date();
      response.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>\n${d.toDateString()} ${d.toTimeString()}</p>`
      );
    })
    .catch(e => next(e));
});

app.get("/api/persons", (_request, response, next) => {
  Person.find().then(persons => response.json(persons)).catch(e => next(e));
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  const person = new Person({
    name,
    number,
  });
  person.save().then(p => response.json(p)).catch(e => next(e));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(p => {
      if (p) response.json(p);
      else response.status(404).end();
    })
    .catch(e => next(e));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch(e => next(e));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    {
      name,
      number,
    },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then(p => response.json(p))
    .catch(error => next(error));
});

// Unknown endpoint
app.use((_request, response) => response.status(404).send({ error: "unknown endpoint" }));

// Error handling
app.use((error, _request, response, next) => {
  console.error(error.message);

  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformatted id" });

    case "ValidationError":
      return response.status(400).send({ error: error.message });

    case "MongoServerError": {
      switch (error.code) {
        case 11000:
          return response.status(400).send({ error: "duplicate key" });
        default:
          break;
      }
      break;
    }
    default:
      break;
  }

  next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
