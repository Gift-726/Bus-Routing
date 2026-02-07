# How to Push Your Code to GitHub

Since I cannot access your GitHub account directly, please follow these manual steps to push your project:

## Prerequisites
- Ensure you have Git installed on your computer.
- Ensure you have a GitHub account.

## Step 1: Initialize Git Repository
Open your terminal (Command Prompt or PowerShell) in the project folder:
`cd "c:\Users\GIFT AYANO\Desktop\giano\Bus"`

Run the following command to initialize Git:
```bash
git init
```

## Step 2: Add Files
Add all your project files to the staging area:
```bash
git add .
```

Commit your changes:
```bash
git commit -m "Initial commit of Bus Park Information App"
```

## Step 3: Create a Repository on GitHub
1.  Go to [github.com/new](https://github.com/new).
2.  Enter a repository name (e.g., `bus-park-app`).
3.  Click **Create repository**.

## Step 4: Link to Remote Repository
Copy the repository URL provided by GitHub (it looks like `https://github.com/your-username/bus-park-app.git`).

Run the following command, replacing the URL with yours:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## Step 5: Push to GitHub
Push your code to the main branch:
```bash
git branch -M main
git push -u origin main
```

Your code should now be live on GitHub!
