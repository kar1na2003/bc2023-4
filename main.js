const http = require("http");
const xml = require("fast-xml-parser");
const fs = require("node:fs");
const port = 8000;


const parser = new xml.XMLParser();
const builder = new xml.XMLBuilder({ format: true });

const server = http.createServer((req, res) => {
  const xmldata = fs.readFileSync("data.xml", "utf-8");
  const obj = parser.parse(xmldata);

  const necessaryData = Array.isArray(obj.exchange.currency)
    ? obj.exchange.currency.map(item => ({
      date: item.exchangedate,
      rate: item.rate
    }))
    : [{date: obj.exchange.currency.exchangedate,
      rate: obj.exchange.currency.rate}];


  const xmlObj = {
    data: {
      exchange: necessaryData
    }
  };

  const ActualXml = builder.build(xmlObj);
  res.setHeader('Content-Type', 'application/xml');
  res.end(ActualXml);
});


server.listen(port, () => {
  console.log(`Works on port ${port}`);
});