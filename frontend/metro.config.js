// Fix for Windows OneDrive reparse points:
// On Windows, OneDrive files/placeholders have FILE_ATTRIBUTE_REPARSE_POINT set,
// which causes Node.js libuv / fs.Dirent.isSymbolicLink() to return true,
// even though they are regular files (fs.lstatSync().isSymbolicLink() === false).
// This causes Metro's file map crawler to skip or drop thousands of packages (e.g. react, expo-router).
if (process.platform === 'win32') {
  const fs = require('fs');
  const path = require('path');
  const origIsSymbolicLink = fs.Dirent.prototype.isSymbolicLink;
  const origIsFile = fs.Dirent.prototype.isFile;
  const origIsDirectory = fs.Dirent.prototype.isDirectory;

  function resolveWin32Type(dirent) {
    if (dirent._win32Type !== undefined) return dirent._win32Type;
    if (!origIsSymbolicLink.call(dirent)) {
      dirent._win32Type = 'other';
      return 'other';
    }
    const dir = dirent.parentPath || dirent.path;
    const fullPath = dir ? path.join(dir, dirent.name) : dirent.name;
    try {
      const st = fs.lstatSync(fullPath);
      if (st.isSymbolicLink()) {
        dirent._win32Type = 'symlink';
      } else if (st.isFile()) {
        dirent._win32Type = 'file';
      } else if (st.isDirectory()) {
        dirent._win32Type = 'dir';
      } else {
        dirent._win32Type = 'other';
      }
    } catch {
      dirent._win32Type = 'symlink';
    }
    return dirent._win32Type;
  }

  fs.Dirent.prototype.isSymbolicLink = function() {
    if (!origIsSymbolicLink.call(this)) return false;
    return resolveWin32Type(this) === 'symlink';
  };

  fs.Dirent.prototype.isFile = function() {
    if (origIsFile.call(this)) return true;
    return resolveWin32Type(this) === 'file';
  };

  fs.Dirent.prototype.isDirectory = function() {
    if (origIsDirectory.call(this)) return true;
    return resolveWin32Type(this) === 'dir';
  };
}

// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;

