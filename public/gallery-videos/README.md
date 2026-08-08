# Gallery videos (browser-safe H.264)

These clips are generated from the mill-floor Google Drive originals (often XAVC), which browsers cannot play in a muted HTML5 `<video>`.

## Generate locally

1. Place `ffmpeg` at `tools/ffmpeg/ffmpeg.exe` (Windows) or on your PATH.
2. Run:

```bash
npm run gallery:transcode
```

Optional single item:

```bash
npm run gallery:transcode -- --only stenter-1
```

3. Re-seed CMS URLs:

```bash
npm run seed:cms
```

Outputs land here as `<itemId>.mp4` plus a poster `<itemId>.jpg`.
