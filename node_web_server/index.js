const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 3500;

const serveWebFile = (filePathURL, contentType, request, response) => {
  const fileEncoding = request.url.includes('images') ? '' : 'utf-8';
  const is404Page = path.parse(request.url).base === '404';

  fs.readFile(filePathURL, fileEncoding, (err, data) => {
    if (err) {
      const serverErrorFileHTML = `<!DOCTYPE html>
        <html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatiable" content="EI=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Server Error</title>
    </head>

    <style>
        body {
        background-color:#343541;
        color:white;
        text-align: center;
        margin-top:5rem;
                        }
    </style>
    <body>
        <h1>Internal Server Error</h1>
        <h1>500</h1>

        <p>
        The server encountered an internal error or misconfiguration and was
        unable to complete your request
        </p>
    </body>
    </html>
`;

      response.statusCode = 500;
      response.setHeader('Content-Type', 'text/html');
      response.end(serverErrorFileHTML);
      return;
    }

    response.statusCode = is404Page ? 404 : 200;
    response.setHeader('Content-Type', contentType);
    response.end(data);
  });
};

const server = http.createServer(async (req, res) => {
  let extension = path.extname(req.url);
  const pageList = ['index', 'test', 'new-page', 'old-page'];
  const isPagePresent = pageList.some((page) => req.url.includes(page));

  if (!extension && isPagePresent) {
    req.url += '.html';
    extension += '.html';
  }

  const CONTENT_TYPES = {
    default: 'text/html',
    '.html': 'text/html',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    getContentType(ext) {
      return this[ext] || this.default;
    },
  };

  let filePath =
    req.url === '/' && CONTENT_TYPES.getContentType(extension) === 'text/html'
      ? path.join(__dirname, 'views', 'index.html')
      : CONTENT_TYPES.getContentType(extension) === 'text/html' &&
        req.url.includes('subdir')
      ? path.join(__dirname, 'views', 'subdir', 'index.html')
      : CONTENT_TYPES.getContentType(extension) === 'text/html'
      ? path.join(__dirname, 'views', req.url)
      : path.join(__dirname, req.url);

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serveWebFile(filePath, CONTENT_TYPES.getContentType(extension), req, res);
  } else {
    const page = path.parse(req.url).name;

    switch (page) {
      case 'old-page': {
        res.statusCode = 301;
        res.setHeader('Location', '/new-page.html');
        res.end();
        break;
      }
      default: {
        const notFoundFilePath = path.join(__dirname, 'views', '404.html');
        serveWebFile(
          notFoundFilePath,
          CONTENT_TYPES.getContentType(extension),
          req,
          res
        );
        break;
      }
    }
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
