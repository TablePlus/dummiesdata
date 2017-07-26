# This is an example for TablePlus Plugin

- Generate dummies data for text, string and timestamp fields

# Support

TablePlus build 56 and above

# Install

```
git clone git@github.com:TablePlus/DummiesData.git
```

# Develop

Install Drowserify
```
npm install -g browserify
```

```
cd DummiesData.tableplusplugin
npm install

# build
browserify main.js -o bundle.js
```

Double click on DummiesData plugin to install it

# How to use

1. Open a connection
2. Open a table
3. Click on Plugin icon in the left side bar or press `command + L`
4. Click `run` in the plugin