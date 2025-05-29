// server.js
const http = require("http");
const fs = require("fs");
const PATH = './submissions.json';

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  console.log(`Received ${method} request for ${url}`);

  if (url === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Welcome to the Home Page");
  }

  if (url === "/contact" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
          <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
          </form>
        `);
    return;
  }

  if (url === "/contact" && method === "POST") {
    // Implement form submission handling
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
        const personName = Object.fromEntries(new URLSearchParams(body));
        if (personName.name === "") {
        res.writeHead(400, { "content-type": "text/html" });
        res.end(`
                <p style="color:Red;">Name cannot be emptied!</p>
                <form method="POST" action="/contact">
                    <input type="text" name="name" placeholder="Your name" />
                    <button type="submit">Submit</button>
                </form>
                `);
        return;
      } else {
        // fs.appendFileSync("./submissions.txt", personName.name + "\n");

        const loadName = () => {
            let list = [];
            try {
                list = JSON.parse(fs.readFileSync(PATH, 'utf8'));
                return list;
            } catch (error) {
                console.log("Loading error: ", error);
            }
        }
        const list = loadName();
        const name = personName.name?.trim();
        list.push({ name });

        fs.writeFileSync(PATH, JSON.stringify(list, null, 2));
        res.writeHead(200, { "content-type": "text/html" });
        res.end(`
            <h1>Thank You!</h1>
            <p>Your name "${personName.name}" has been submitted successfully.</p>
            `);
        return;
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("404 Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
