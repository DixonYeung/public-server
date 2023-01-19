import { getAllMarkers, authenticate, saveTempMarker, saveExistingMarker } from './travelMap.service.js';
import express from 'express';
const router = express.Router();

export default (collection)=>{
    router.get("/getAllMarkers", getAllMarkers(collection));
    router.post("/auth", authenticate);
    router.post("/saveTempMarker", saveTempMarker(collection));
    router.post("/saveExistingMarker", saveExistingMarker(collection));
    return router;
}
