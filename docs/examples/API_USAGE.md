# 🌐 HTTP API Usage Guide

Complete guide for using ino-icon-maker HTTP API with curl and other HTTP clients.

## 📖 Table of Contents

- [Starting the Server](#starting-the-server)
- [Endpoints](#endpoints)
- [curl Examples](#curl-examples)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Client Libraries](#client-libraries)

---

## 🚀 Starting the Server

### Start with CLI

```bash
# Default port (3000)
ino-icon serve

# Custom port
ino-icon serve -p 8080
```

### Start with NPM Script

```bash
# Start server
npm start

# Development with auto-restart
npm run dev
```

### Start Programmatically

```javascript
import { HttpServer } from "ino-icon-maker/lib/server/HttpServer.js";

const server = new HttpServer({ port: 3000 });
await server.start();
```

---

## 📡 Endpoints

### `GET /`

Health check and service information.

**Response:**

```json
{
  "service": "ino-icon-maker",
  "version": "1.1.5",
  "supportedPlatforms": ["ios", "android"],
  "supportedFormats": ["image/jpeg", "image/png", "image/webp", "image/avif", "image/tiff"],
  "endpoints": { ... }
}
```

### `GET /platforms`

Get information about supported platforms.

**Response:**

```json
{
	"success": true,
	"platforms": [
		{
			"name": "ios",
			"displayName": "iOS",
			"iconCount": 18,
			"outputFormat": "AppIcon.appiconset"
		},
		{
			"name": "android",
			"displayName": "Android",
			"iconCount": 13,
			"outputFormat": "Multiple mipmap directories"
		}
	]
}
```

### `POST /generate`

Generate icons from uploaded image(s).

**Query Parameters:**

- `platform` (optional): `ios`, `android`, or `all` (default: `all`)
- `backgroundColor` (optional): Hex color like `FF5722` (for adaptive icons without background image)

**Form Fields (multipart/form-data):**

**Legacy Mode (Single Image):**

- `file`: Image file (JPEG, PNG, WebP, AVIF, TIFF)

**Adaptive Mode (Android):**

- `foreground`: Foreground layer image (required)
- `background`: Background layer image (optional, use `backgroundColor` query param for solid color)
- `monochrome`: Monochrome layer image (optional)

**Response:** ZIP file containing generated icons

---

## 🔧 curl Examples

### Health Check

```bash
curl http://localhost:3000/
```

**Response:**

```json
{
	"service": "ino-icon-maker",
	"version": "1.1.5",
	"supportedPlatforms": ["ios", "android"]
}
```

### Get Platform Info

```bash
curl http://localhost:3000/platforms
```

### Generate Icons - All Platforms (Legacy Mode)

```bash
curl -F "file=@icon.png" \
  "http://localhost:3000/generate" \
  -o all-icons.zip
```

### Generate Icons - iOS Only

```bash
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=ios" \
  -o ios-icons.zip
```

### Generate Icons - Android Only

```bash
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=android" \
  -o android-icons.zip
```

### Generate Adaptive Icons - Foreground + Background Image

```bash
curl -F "foreground=@foreground.png" \
  -F "background=@background.png" \
  "http://localhost:3000/generate?platform=android" \
  -o android-adaptive-icons.zip
```

### Generate Adaptive Icons - Foreground + Background Color

```bash
curl -F "foreground=@foreground.png" \
  "http://localhost:3000/generate?platform=android&backgroundColor=FF5722" \
  -o android-adaptive-icons.zip
```

### Generate Adaptive Icons - With Monochrome Layer

```bash
curl -F "foreground=@foreground.png" \
  -F "background=@background.png" \
  -F "monochrome=@monochrome.png" \
  "http://localhost:3000/generate?platform=android" \
  -o android-adaptive-icons.zip
```

### Generate iOS + Android Adaptive

```bash
# iOS uses standard icon
curl -F "file=@icon.png" \
  -F "foreground=@foreground.png" \
  -F "background=@background.png" \
  "http://localhost:3000/generate?platform=all" \
  -o all-icons.zip
```

### With Verbose Output

```bash
curl -v -F "file=@icon.png" \
  "http://localhost:3000/generate" \
  -o icons.zip
```

### Save Response Headers

```bash
curl -D headers.txt -F "file=@icon.png" \
  "http://localhost:3000/generate" \
  -o icons.zip
```

### Test with Different Image Formats

```bash
# JPEG
curl -F "file=@icon.jpg" \
  "http://localhost:3000/generate" \
  -o icons.zip

# PNG (recommended)
curl -F "file=@icon.png" \
  "http://localhost:3000/generate" \
  -o icons.zip

# WebP
curl -F "file=@icon.webp" \
  "http://localhost:3000/generate" \
  -o icons.zip

# AVIF
curl -F "file=@icon.avif" \
  "http://localhost:3000/generate" \
  -o icons.zip

# TIFF
curl -F "file=@icon.tiff" \
  "http://localhost:3000/generate" \
  -o icons.zip
```

---

## 📦 Response Format

### Success Response

**Status:** `200 OK`

**Headers:**

```
Content-Type: application/zip
Content-Disposition: attachment; filename="icons-[timestamp].zip"
```

**Body:** ZIP file containing generated icons

**ZIP Contents:**

```
icons.zip
├── AppIcon.appiconset/         # iOS icons (if generated)
│   ├── Icon-App-20x20@1x.png
│   ├── Icon-App-20x20@2x.png
│   └── ...
└── android-icons/              # Android icons (if generated)
    ├── mipmap-hdpi/
    │   ├── ic_launcher.png
    │   └── ic_launcher_round.png
    ├── mipmap-mdpi/
    └── ...
```

### Error Response

**Status:** `400 Bad Request` or `500 Internal Server Error`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
	"success": false,
	"error": "Error message here"
}
```

---

## ❌ Error Handling

### Common Errors

#### No File Uploaded

```bash
curl "http://localhost:3000/generate"
```

**Response (400):**

```json
{
	"success": false,
	"error": "No file uploaded in 'file' field or no foreground layer provided"
}
```

#### Invalid Platform

```bash
curl -F "file=@icon.png" \
  "http://localhost:3000/generate?platform=invalid"
```

**Response (400):**

```json
{
	"success": false,
	"error": "Invalid platform: invalid. Supported: ios, android, all"
}
```

#### Unsupported File Type

```bash
curl -F "file=@icon.svg" \
  "http://localhost:3000/generate"
```

**Response (400):**

```json
{
	"success": false,
	"error": "Invalid file type. Supported formats: JPEG, PNG, WebP, AVIF, TIFF"
}
```

#### File Too Large

```bash
curl -F "file=@huge-icon.png" \
  "http://localhost:3000/generate"
```

**Response (400):**

```json
{
	"success": false,
	"error": "File too large"
}
```

#### Server Error

**Response (500):**

```json
{
	"success": false,
	"error": "Internal server error message"
}
```

---

## 🔌 Client Libraries

### JavaScript (Node.js)

```javascript
import FormData from "form-data";
import fs from "fs";
import axios from "axios";

const form = new FormData();
form.append("file", fs.createReadStream("icon.png"));

const response = await axios.post(
	"http://localhost:3000/generate?platform=all",
	form,
	{
		headers: form.getHeaders(),
		responseType: "arraybuffer",
	}
);

fs.writeFileSync("icons.zip", response.data);
```

### JavaScript (Browser)

```javascript
const fileInput = document.querySelector('input[type="file"]');
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("http://localhost:3000/generate", {
	method: "POST",
	body: formData,
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "icons.zip";
a.click();
```

### Python

```python
import requests

files = {'file': open('icon.png', 'rb')}
params = {'platform': 'all'}

response = requests.post(
    'http://localhost:3000/generate',
    files=files,
    params=params
)

with open('icons.zip', 'wb') as f:
    f.write(response.content)
```

### PHP

```php
<?php
$ch = curl_init();

$cfile = new CURLFile('icon.png', 'image/png', 'file');
$data = array('file' => $cfile);

curl_setopt($ch, CURLOPT_URL, 'http://localhost:3000/generate?platform=all');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

file_put_contents('icons.zip', $result);
?>
```

### Go

```go
package main

import (
    "bytes"
    "io"
    "mime/multipart"
    "net/http"
    "os"
)

func main() {
    file, _ := os.Open("icon.png")
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    part, _ := writer.CreateFormFile("file", "icon.png")
    io.Copy(part, file)
    writer.Close()

    req, _ := http.NewRequest("POST", "http://localhost:3000/generate", body)
    req.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    out, _ := os.Create("icons.zip")
    defer out.Close()
    io.Copy(out, resp.Body)
}
```

### Ruby

```ruby
require 'net/http'
require 'uri'

uri = URI.parse("http://localhost:3000/generate?platform=all")
request = Net::HTTP::Post::Multipart.new(
  uri,
  "file" => UploadIO.new(File.new("icon.png"), "image/png", "icon.png")
)

response = Net::HTTP.start(uri.hostname, uri.port) do |http|
  http.request(request)
end

File.write("icons.zip", response.body)
```

---

## 🧪 Testing Script

Create `test-api.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000"
ICON="test-icon.png"

echo "Testing ino-icon-maker API..."

# Health check
echo "1. Health check"
curl -s "$API_URL/" | jq .

# Platform info
echo -e "\n2. Platform info"
curl -s "$API_URL/platforms" | jq .

# Generate all platforms
echo -e "\n3. Generate all platforms"
curl -s -F "file=@$ICON" \
  "$API_URL/generate" \
  -o all-icons.zip
echo "Saved to all-icons.zip"

# Generate iOS only
echo -e "\n4. Generate iOS only"
curl -s -F "file=@$ICON" \
  "$API_URL/generate?platform=ios" \
  -o ios-icons.zip
echo "Saved to ios-icons.zip"

# Generate Android only
echo -e "\n5. Generate Android only"
curl -s -F "file=@$ICON" \
  "$API_URL/generate?platform=android" \
  -o android-icons.zip
echo "Saved to android-icons.zip"

echo -e "\n✅ All tests completed!"
```

Make executable and run:

```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🐳 Docker Example

```bash
# Run server in Docker
docker run -d -p 3000:3000 --name icon-generator \
  node:20-alpine sh -c "npm install -g ino-icon-maker && ino-icon serve"

# Test it
curl -F "file=@icon.png" \
  "http://localhost:3000/generate" \
  -o icons.zip

# Stop and remove
docker stop icon-generator
docker rm icon-generator
```

---

## 🔒 Production Considerations

### Rate Limiting

Consider adding rate limiting in production:

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/generate", limiter);
```

### Authentication

Add authentication for production use:

```javascript
app.use("/generate", (req, res, next) => {
	const apiKey = req.headers["x-api-key"];
	if (apiKey !== process.env.API_KEY) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	next();
});
```

### CORS

Enable CORS for browser clients:

```javascript
import cors from "cors";

app.use(
	cors({
		origin: "https://yourdomain.com",
	})
);
```

### HTTPS

Use HTTPS in production:

```javascript
import https from "https";
import fs from "fs";

const options = {
	key: fs.readFileSync("key.pem"),
	cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, app).listen(443);
```

---

## 📚 Related Documentation

- [CLI Usage](./CLI_USAGE.md) - Command line interface guide
- [Programmatic Usage](./PROGRAMMATIC_USAGE.md) - Use as npm module
- [Complete Examples](./COMPLETE_EXAMPLES.md) - Quick reference
- [CI/CD Integration](./CI_CD.md) - Automate in pipelines

---

**Need help?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
