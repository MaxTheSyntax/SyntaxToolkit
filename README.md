# Syntax Toolkit

###### Still in development

## Introduction

SyntaxToolkit is planned to have a set of tools that will merge multiple apps into one using the APi`s of said programs. This app is still in tis very early stages of development, so right no the only tool available is to view and play your Steam library.

## How to use

### Step 1

Create a new file called **.env** in the root project folder, and in it, type:

```js
STEAM_API_KEY = 'API KEY';
STEAM_ID = 'STEAM ID';
```

[Click here for how to find API key](https://github.com/MaxTheSyntax/SyntaxToolkit/#finding-your-api-key)

[Click here for how to find your Steam ID](https://github.com/MaxTheSyntax/SyntaxToolkit/#finding-your-steam-id)

### Step 2

Make sure you have [npm](https://nodejs.org/en/download) installed. Open 2 terminals (ex. powershell) in the project directory. In one type:

```
npm run frontend
```

And in the other one type:

```
npm run backend
```

## Finding your API key

You can find you Steam API key [at this website](https://steamcommunity.com/dev/apikey).

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1133464278121332766/apikey_tutorial.jpg" width="500px;"/>

## Finding your Steam ID

### Step 1

Go to your steam profile [this website](https://steamcommunity.com) or Steam client, hover over your profile name and click on `Profile`.

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1133467699020836994/id1.jpg" width="600px"/>

### Step 2

Once you're on your Steam profile, click on the `Edit Profile` button.

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1133470500950118400/id2.jpg" />

### Step 3

on the Edit Profile page scroll down until you see `Custom URL`. Delete any text that is in the textbox (might already be empty) and copy your Steam ID in the URL below the textbox.

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1133475870200299521/id3.gif" />
