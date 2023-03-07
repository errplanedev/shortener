import express from 'express';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
const app = express();
const port = 3000;

const __dirname = new URL('.', import.meta.url).pathname;
function randomId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';

  for(let i = 0; i < 6; i++) {
    const char = chars[Math.round(Math.random() * chars.length)];
    result+= char;
  }
  return result;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
})

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  let links = await fs.readFileSync('links.json'); 
  links = JSON.parse(links);
  res.redirect(links[id]);
});

app.post('/:id', async (req, res) => {
  const id = req.params.id || randomId();
  const { url } = req.query;
  let links;
  try {
    links = await fs.readFileSync('links.json');
  } catch(err) {
    await fs.writeFileSync('links.json', '{}')
    links = await fs.readFileSync('links.json');
  }
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