export const getAllMarkers = (markerInfoCollection) => {
    return async (req, res) => {
        const markers = await markerInfoCollection.find({}).toArray();
        res.send({ data: markers });
    };
}

export const authenticate = async (req, res) => {
    const password = req.query.password;
    if (password == process.env.EDITOR_PASSWORD) {
        res.send("success");
    } else {
        res.send("denied");
    }
};

export const saveTempMarker = (markerInfoCollection) => {
    return async (req, res) => {
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
    };
}

export const saveExistingMarker = (markerInfoCollection) => {
    return async (req, res) => {
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
    };
}
