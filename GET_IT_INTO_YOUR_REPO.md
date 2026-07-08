# ☀️ Good morning — 2 minutes to put this in your GitHub

The app is finished and tested. It couldn't be pushed automatically because last
night's work session was locked to the Circles account (a security rule — it
can't write to a repo under your personal account). Here's the easy fix.

## The easy way (recommended, no terminal)

1. Go to **claude.ai/code** and start a **new session**.
2. When it asks which repository, choose **`tylerbancroft/said-the-whale-app`**.
   (A session that *starts* on your repo is allowed to write to it.)
3. **Upload this zip** (`said-the-whale-app.zip`) into that chat.
4. Say: **"Unzip this and push all of it to the main branch."**

That's it — the new session will commit everything to your repo.

## If you'd rather do it yourself (terminal)

```bash
# unzip the file, then from inside the folder:
git init
git add .
git commit -m "Initial commit: Said The Whale fan app"
git branch -M main
git remote add origin https://github.com/tylerbancroft/said-the-whale-app.git
git push -u origin main --force   # --force only needed because the repo has a starter README
```

## Then, to see it running

```bash
npm install
npx expo start --web      # opens in a browser; use code WHALE to get in
```

Everything else — what's built, what's next — is in **README.md**. 🐋
