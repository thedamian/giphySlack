require('dotenv').config();
const http = require("http"); // standard http server
const express = require("express"); // express library
const fetch = require("node-fetch");
const { WebClient } = require('@slack/web-api');
const SlackToken = process.env.SLACK_TOKEN;
const slack = new WebClient(SlackToken);
console.log("SlackToken",SlackToken)
const giphyapi = process.env.GIPHY;
const giphyUrl = `https://api.giphy.com/v1/gifs/random?api_key=${giphyapi}&limit=25&offset=0&rating=g&lang=en&q=`;
const cors = require('cors'); // cors middleware to have a great API experience
const path = require("path"); // express has a method for using local path. but now.sh doesn't like it.
const app = express(); // Express server (we seperate to introduce middleware) you could also do: app = require("express")()
const port = process.env.PORT || 8080; // use any port you want or use a enviromental PORT variable
app.use(express.json()); // Now express no longer needs the body-parser middleware and has it's own.
app.use(cors()); // For APIS this allows CORS access

// root. when accessing http://localhost:5000
app.get("/",(req,res)=> {
    res.send("yeah no") // open the /views/index.ejs file and pass an object called "HelloWorld"
    // you do not need res.end(), the render will take care of this.
  });

  app.get("/1",async (req,res)=> {
    await sendSlack("funny",res);
  });

  app.get("/2",async (req,res)=> {
    await sendSlack("sad",res);
  });

  app.get("/3",async (req,res)=> {
    await sendSlack("yum",res);
  });

  app.get("/4",async (req,res)=> {
    await sendSlack("button",res);
  });


  const sendSlack = async (word,res) =>  {
      console.log("hitting:"+giphyUrl + word)
    await fetch(giphyUrl + word)
    .then(res => res.json())
    .then(async data => {
        let imageurl = data.data.images.downsized_medium.url;
        console.log(imageurl)

        const conversationId = "#humor"; // humor

          const result = await slack.chat.postMessage({
            text: imageurl,
            channel: conversationId,
          });
        
          // The result contains an identifier for the message, `ts`.
          console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);
        


        // send this to slack!
        res.json({"ok":"ok"}); 
    }).catch(ex =>  {
        console.error(ex)
        res.status(500).send("error: "+ex)
    })
  }

// start the web server.
let server = http.createServer(app);
server.listen(port);
console.log("http server listening on http://localhost:%d", port); // this is a good idea and will remind you which port it's listening to.