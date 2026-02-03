# Remove Credentials from Git History

## ⚠️ IMPORTANT: This will rewrite Git history!

**Before proceeding:**
1. ✅ Make sure you've rotated your Gmail app password (the old one is compromised)
2. ✅ Backup your repository
3. ✅ Make sure no one else is working on this repo (or coordinate with them)

## Option 1: Using git filter-branch (Recommended)

```bash
# Remove the password from all commits in history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/main/resources/application.properties" \
  --prune-empty --tag-name-filter cat -- --all

# Remove the password string from all files in history
git filter-branch --force --tree-filter \
  "find . -type f -exec sed -i 's/ddvryfglwetyscad/REMOVED_PASSWORD/g' {} +" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to GitHub (WARNING: This rewrites history!)
git push origin --force --all
```

## Option 2: Using BFG Repo-Cleaner (Easier, but requires Java)

1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Run:
```bash
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

Where `passwords.txt` contains:
```
ddvryfglwetyscad==>REMOVED
```

## Option 3: Simple Solution (If history doesn't matter)

If you don't care about preserving history:

```bash
# Create a new orphan branch
git checkout --orphan clean-main
git add .
git commit -m "Initial commit - credentials removed"
git branch -D main
git branch -m main
git push -f origin main
```

## After removing from history:

1. ✅ Rotate your Gmail app password (if not done already)
2. ✅ Update Railway with new password
3. ✅ Verify GitGuardian no longer detects it (may take a few minutes)

## ⚠️ WARNING:

- Force pushing rewrites history - anyone who cloned your repo will need to re-clone
- This is safe for personal repos, but coordinate with team members if working together
- GitHub may take a few minutes to update GitGuardian scans
