---
layout: post
title: "Extracting transcripts from Just Press Record"
date: 2024-12-08
published: true
---
[Just Press Record](https://www.openplanetsoftware.com/just-press-record/) is a nice little app available on macOS, iOS and watchOS for recording voice memos.

It has a feature to automatically transcribe recordings. The transcript is embedded into the recording. I wanted to extract this out to use as part of an automated workflow with OmniFocus, a task manager.

With a little bit of investigation, I could see it was represented as a Base64 string within some JSON. Here's how to extract it:

```sh
strings recording.m4a | tail -n 1 | sed 's/^[^\{]*//' | jq -r '._root.txscriptv2.tx._data' | base64 --decode
```

A brief explanation of how each command is used:
* `strings` extracts text found within the file
* `tail` keep only the last line (the one with the JSON)
* `sed` to discard the part of the line before the JSON structure
* `jq` to extract the specific part of the JSON containing the encoded text
* `base64` to decode it
