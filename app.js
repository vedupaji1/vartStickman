const express = require("express");
const app = express();
const http = require("http").createServer(app);
const {
    createCanvas
} = require('canvas')
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const generateArt = () => {
    return new Promise((res, rej) => {
        const canvas = createCanvas(410, 310)
        const context = canvas.getContext('2d')
        let colorValueArr = [];
        for (let i = 0; i < 9; i++) {
            let isValid = false;
            while (isValid === false) {
                let randNum = "#" + Math.floor(Math.random() * 16777215).toString(16);
                if (/^#[0-9A-F]{6}$/i.test(randNum) === true) {
                    isValid = true;
                    colorValueArr.push(randNum);
                }
            }
        }

        let properties = {
            headColor: colorValueArr[0],
            lipsColor: colorValueArr[1],
            eyesColor: colorValueArr[2],
            bodyColor: colorValueArr[3],
            armsColor: colorValueArr[4],
            fingersColor: colorValueArr[5],
            middleFingerColor: colorValueArr[6],
            legsColor: colorValueArr[7],
            feetColor: colorValueArr[8]
        }

        // Head
        context.beginPath();
        context.fillStyle = properties.headColor;
        context.arc(200, 60, 50, 0, Math.PI * 2, true);
        context.fill();

        // Lips
        context.beginPath();
        context.strokeStyle = properties.lipsColor;
        context.lineWidth = 3;
        context.arc(200, 75, 12, 0, Math.PI, false);
        context.stroke();

        // Eyes
        context.beginPath();
        context.fillStyle = properties.eyesColor;
        context.arc(190, 55, 3, 0, Math.PI * 2, true);
        context.fill();
        context.arc(210, 55, 3, 0, Math.PI * 2, true);
        context.fill();

        // Body
        context.beginPath();
        context.moveTo(200, 110);
        context.lineTo(200, 180);
        context.strokeStyle = properties.bodyColor;
        context.stroke();

        // Arms
        context.beginPath();
        context.strokeStyle = properties.armsColor;
        context.moveTo(200, 110);
        context.lineTo(120, 140);
        context.moveTo(200, 110);
        context.lineTo(280, 140);
        context.stroke();

        // Legs
        context.beginPath();
        context.strokeStyle = properties.legsColor;
        context.moveTo(200, 180);
        context.lineTo(150, 280);
        context.moveTo(200, 180);
        context.lineTo(250, 280);
        context.stroke();

        // Fingers
        context.beginPath();
        context.fillStyle = properties.fingersColor;
        context.rect(100, 135, 40, 8);
        context.fill();
        context.rect(260, 135, 40, 8);
        context.fill();

        // Middle Finger
        context.beginPath();
        context.fillStyle = properties.middleFingerColor;
        context.rect(115, 113, 5, 30);
        context.fill();
        context.rect(280, 113, 5, 30);
        context.fill();

        // Feet
        context.beginPath();
        context.fillStyle = properties.feetColor;
        context.rect(120, 280, 40, 8);
        context.fill();
        context.rect(240, 280, 40, 8);
        context.fill();

        res({
            properties: properties,
            image: canvas.toBuffer()
        })
    })
}


app.use(express.static(path.join(__dirname, "client/build")));

app.get("/*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.get("/generateArt", async (req, res) => {
    res.json({
        data: await generateArt(),
        isDone: true
    });
})

http.listen(port, () => {
    console.log("Ok");
})