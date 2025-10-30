# Command Reference

## ✅ Correct Commands

### NPX (No Install)

```bash
npx ino-icon-maker generate -i icon.png -o ./output -p ios
npx ino-icon-maker generate -i icon.png -o ./output -p android
npx ino-icon-maker generate -i icon.png -o ./output -p all -z
```

### After Global Install

```bash
# Install first
npm install -g ino-icon-maker

# Then use
ino-icon generate -i icon.png -o ./output -p ios
iim generate -i icon.png -o ./output -p all -z
```

## ❌ Won't Work

```bash
# ❌ Wrong - these only work after global install
npx ino-icon generate -i icon.png -o ./output -p ios
npx iim generate -i icon.png -o ./output -p ios

# ✅ Correct - use full package name with npx
npx ino-icon-maker generate -i icon.png -o ./output -p ios
```

## 🎯 Quick Reference

| Usage            | Command                           |
| ---------------- | --------------------------------- |
| NPX (no install) | `npx ino-icon-maker`              |
| Global install   | `npm install -g ino-icon-maker`   |
| Short command    | `ino-icon` (after global install) |
| Short alias      | `iim` (after global install)      |

## 📋 Examples

```bash
# Most common - NPX
npx ino-icon-maker generate -i icon.png -o ./output -p all -z

# After global install
ino-icon generate -i icon.png -o ./output -p all -z
iim generate -i icon.png -o ./output -p all -z
```
