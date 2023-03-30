import express from 'express';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

let links;
try {
  links = await fs.readFileSync('links.json');
} catch(err) {
  await fs.writeFileSync('links.json', '{}');
  links = await fs.readFileSync('links.json');
}

const app = express();
const port = 3000;

const __dirname = new URL('.', import.meta.url).pathname;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
})

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  let links = await fs.readFileSync('links.json'); 
  links = JSON.parse(links);
  if(links[id]) {
    res.redirect(links[id]);
  } else {
    res.end('Invalid link.');
  }
});

app.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { url } = req.query;
  links = JSON.parse(links);
  if(id in links) {
    res.status(409).end('Link already exists');
  } else {
    links[id] = url;
    links = JSON.stringify(links);
    fs.writeFileSync('links.json', links);
    res.status(200).end('Success');
  }
});

app.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
