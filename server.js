const express = require('express');
const net = require('net');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/whois', async (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).send('Domain is required');

  let data = '';
  const client = net.createConnection({ host: 'whois.nic.kz', port: 43 }, () => {
    client.write(domain + '\r\n');
  });

  client.on('data', chunk => data += chunk.toString());
  client.on('end', () => res.send(data));
  client.on('error', err => res.status(500).send(err.toString()));
});

app.listen(3000, () => console.log('Запущено на http://localhost:3000'));
