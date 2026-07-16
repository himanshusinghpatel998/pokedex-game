const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const registerRoutes = require("./src/register");
const loginRoutes = require("./src/login");
const validateRoutes = require("./src/validate");
const pokemonRoutes = require("./src/Pokedex");
const pokemonDetailRoutes = require("./src/PokemonDetailRoutes");
const gamestarter = require("./src/games");
const trainerRouter = require("./src/trainer");

const app = express();

// Railway provides PORT automatically
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", registerRoutes);
app.use("/api", loginRoutes);
app.use("/api", validateRoutes);
app.use("/api", gamestarter);

app.use("/pokemon", pokemonRoutes);
app.use("/pokemon-detail", pokemonDetailRoutes);

app.use("/trainer", trainerRouter);

app.get("/", (req, res) => {
  res.send("Pokémon API is running.");
});

// Create ONE HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Change to your frontend URL after deployment
    methods: ["GET", "POST"],
  },
});

// Store connected users
const users = {};

// Vicinity distance
const CHAT_VICINITY_DISTANCE = 100;

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("join", (userData) => {
    users[socket.id] = {
      id: socket.id,
      username: userData.username,
      position:
        userData.position || {
          x: Math.random() * 800,
          y: Math.random() * 600,
        },
      color: userData.color || getRandomColor(),
    };

    socket.emit("init", {
      id: socket.id,
      users,
    });

    socket.broadcast.emit("user_joined", users[socket.id]);
  });

  socket.on("move", (position) => {
    if (!users[socket.id]) return;

    users[socket.id].position = position;

    socket.broadcast.emit("user_moved", {
      id: socket.id,
      position,
    });
  });

  socket.on("send_message", (message) => {
    if (!users[socket.id]) return;

    const sender = users[socket.id];

    const usersInVicinity = Object.values(users).filter((user) => {
      if (user.id === sender.id) return false;

      const dx = user.position.x - sender.position.x;
      const dy = user.position.y - sender.position.y;

      return Math.sqrt(dx * dx + dy * dy) <= CHAT_VICINITY_DISTANCE;
    });

    const messageData = {
      id: Date.now(),
      sender: sender.id,
      senderName: sender.username,
      text: message,
      timestamp: new Date().toISOString(),
    };

    socket.emit("receive_message", messageData);

    usersInVicinity.forEach((user) => {
      io.to(user.id).emit("receive_message", messageData);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (users[socket.id]) {
      io.emit("user_left", socket.id);
      delete users[socket.id];
    }
  });
});

function getRandomColor() {
  const colors = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

// Start ONLY ONE server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports.io = io;