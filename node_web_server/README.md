# Simple Web Server in Node.js

Description:

Here is a simple Node.js project for serving files without using any framework

It not only serves html pages but stylesheets, images, json and text files as well.

---

## Index page

![Index Page](https://github.com/jyotirana93/readme-images/blob/master/node_web_server_images/index-page.png?raw=true)

### When is index.html page served ?

- When user types '/' in the browser (http://localhost:3500/)

- When user types '/index'<u> **_no need to specify '.html' extension_** </u> in the browser (http://localhost:3500/index)

- When user types full url (http://localhost:3500/index.html)

- All of the above will serve the same index.html file

---

## Subdir Index page

![Subdir Index Page](https://github.com/jyotirana93/readme-images/blob/master/node_web_server_images/subdir-index-page.png?raw=true)

### When is index.html page served under subdir folder ?

- When user types '/subdir' in the browser (http://localhost:3500/subdir)

- When user types '/subdir/index' in the browser without html extension (http://localhost:3500/subdir/index)

- When user types full url (http://localhost:3500/subdir/index.html)

- All of the above will serve the same index.html file under subdir

---

## Old Page is being redirected to New Page

![New Page](https://github.com/jyotirana93/readme-images/blob/master/node_web_server_images/new-page.png?raw=true)

### When is new-page.html served ?

- When user types 'old-page' or 'old-page.html' it gets redirected to new-page.html (http://localhost:3500/old-page.html)

---

## Json Data

![Json Data](https://github.com/jyotirana93/readme-images/blob/master/node_web_server_images/json-data.png?raw=true)

### When is data.json served ?

- When user types 'data/data.json' (http://localhost:3500/data/data.json)

---

## Text Data

![Text Data](https://github.com/jyotirana93/readme-images/blob/master/node_web_server_images/text-data.png?raw=true)

### When is data.txt served ?

- When user types 'data/data.txt' (http://localhost:3500/data/data.txt)

---

## Not Found Page

![Not Found Page](https://github.com/jyotirana93/readme-images/blob/master/node_web_server_images/not-found-page.png?raw=true)

### When is Not found page(404) served ?

- When user enters an incorrect url or the page that is requested does not exist (http://localhost:3500/xyz)

---

## Server Error Page

![Server Page](https://github.com/jyotirana93/readme-images/blob/master/node_web_server_images/server-error-page.png?raw=true)

## When is Server error page(500) served ?

- When something goes wrong on server and it can't process the request properly
