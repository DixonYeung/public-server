import * as dotenv from 'dotenv';
dotenv.config();
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import travelMapController from './travelMap/travelMap.controller.js';
import { keepServerAlive } from './tools.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { MongoClient } from 'mongodb';
const mongoClient = new MongoClient(process.env.MONGO_URI);

import express from 'express';
const app = express();

import { createDiscordBot } from './external/discord/discordBot.js';
createDiscordBot();

app.use('/public', express.static(__dirname + '/public'));//set up static files
app.use("/ping", keepServerAlive);//get the keep-server-alive middleware method


// Run the server and report out to the logs
const server = app.listen({ port: process.env.PORT || 5000 }, async (err) => {
    if (err) process.exit(1);
    const [ host, port ] = [ server.address().address, server.address().port ];
    await mongoClient.connect();
    const markerInfoCollection = mongoClient.db("travelMapDatabase").collection("marker_info");
    app.use('/travelMap', travelMapController(markerInfoCollection));//pass mongodb collection to controller
    console.log(`Server running at http://${host}:${port}/`);
  }
);
