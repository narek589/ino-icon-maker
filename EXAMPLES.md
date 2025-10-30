# Examples

## NPX (No Install Required)

```bash
# iOS
npx ino-icon-maker generate -i icon.png -o ./output -p ios

# Android
npx ino-icon-maker generate -i icon.png -o ./output -p android

# Both + ZIP
npx ino-icon-maker generate -i icon.png -o ./output -p all -z

# Interactive
npx ino-icon-maker generate

# Info
npx ino-icon-maker --version
npx ino-icon-maker platforms
```

## After Global Install

```bash
# Install globally first
npm install -g ino-icon-maker

# Then use short commands
ino-icon generate -i icon.png -o ./output -p ios
ino-icon generate -i icon.png -o ./output -p android
ino-icon generate -i icon.png -o ./output -p all -z

# Or short alias
iim generate -i icon.png -o ./output -p all -z
```

## HTTP API

```bash
# Start server
npm run dev

# Generate
curl -F "file=@icon.png" "http://localhost:3000/generate?platform=ios" -o ios.zip
curl -F "file=@icon.png" "http://localhost:3000/generate?platform=android" -o android.zip
curl -F "file=@icon.png" "http://localhost:3000/generate?platform=all" -o all.zip
```

## Library

```javascript
import { quickGenerate } from "ino-icon-maker";

await quickGenerate({
	input: "./icon.png",
	output: "./output",
	platform: "all",
	zip: true,
});
```

## Package Scripts

```json
{
	"scripts": {
		"icons": "npx ino-icon-maker generate -i assets/icon.png -o assets/icons -p all -z"
	}
}
```
