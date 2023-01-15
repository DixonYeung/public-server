import * as dotenv from 'dotenv';
dotenv.config();

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { MongoClient } from 'mongodb';
const mongoClient = new MongoClient(process.env.MONGO_URI);
let travelMapDatabase;
let markerInfoCollection;

import Discord from 'discord.js';
const discordClient = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds, 
    Discord.GatewayIntentBits.GuildMessages, 
    Discord.GatewayIntentBits.MessageContent
  ]
});

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
  //console.log(discordClient.channels);
});

discordClient.on("messageCreate", (message) => {
  if (message.mentions.has(discordClient.user.id)) {
    const channel = discordClient.channels.cache.get(message.channelId);
    channel.send(`Hi ${message.author.username} !`);
  }
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);

import express from 'express';
var app = express();

//SET UP STATIC FILES
app.use('/public', express.static(__dirname + '/public'));


app.get("/travelMap/getAllMarkers", async (req, res) => {
  const markers = await markerInfoCollection.find({}).toArray();
  // markers.forEach(element => {
  //     console.log(element);
  // });
  res.send({ data: markers });
});

app.post("/travelMap/auth", async (req, res) => {
  const password = req.query.password;
  console.log(req.query);
  if (password == process.env.EDITOR_PASSWORD) {
    res.send("success");
  } else {
    res.send("denied");
  }
});

app.post("/travelMap/saveTempMarker", async (req, res) => {
  if (req.query.password == process.env.EDITOR_PASSWORD) {
    let myobj = {
      message: req.query.message,
      photo: req.query.photoString,
      location: req.query.location,
    };
    markerInfoCollection.insertOne(myobj, (err, inertResponse) => {
      if (err) {
        res.send("error");
        throw err;
      }
      console.log("1 document inserted");
      res.send("success");
    });
  }
});

app.post("/travelMap/saveExistingMarker", async (req, res) => {
  if (req.query.password == process.env.EDITOR_PASSWORD) {
    let myobj = {
      message: req.query.message,
      photo: req.query.photoString,
      location: req.query.location,
    };
    markerInfoCollection.updateOne(
      { id: req.query.id },
      { $set: myobj },
      (err, inertResponse) => {
        if (err) {
          res.send("error");
          throw err;
        }
        console.log("1 document updated");
        res.send("success");
      }
    );
  }
});

// Run the server and report out to the logs
var server = app.listen({ port: process.env.PORT || 5000 }, (err) => {
    if (err) {
      process.exit(1);
    }
    var host = server.address().address;
    var port = server.address().port;
    mongoClient.connect().then(()=>{
      travelMapDatabase = mongoClient.db("travelMapDatabase");
      markerInfoCollection = travelMapDatabase.collection("marker_info");
    })
    console.log(`Server running at http://${host}:${port}/`);
  }
);
