# Syntax Toolkit

###### Still in development

## Introduction

SyntaxToolkit is planned to have a set of tools that will merge multiple apps into one using the APi's of said programs. This app is still in tis very early stages of development, so right now the only tool available is to view and play your Steam library.

## How to use

### Step 1

Create a new file called **.env** in the root project folder, and in it, type:

```js
STEAM_API_KEY = 'API KEY';
STEAM_ID = 'STEAM ID';

DC_TOKEN = 'DISCORD BOT TOKEN';
APP_ID = 'DISCORD BOT APP ID';
GUILD_ID = 'DISCORD SERVER ID';

IP = 'YOUR IP';
```

[Click here for how to find API key](https://github.com/MaxTheSyntax/SyntaxToolkit/#finding-your-api-key)

[Click here for how to find your Steam ID](https://github.com/MaxTheSyntax/SyntaxToolkit/#finding-your-steam-id)

[Click here for how to setup a Discord bot](https://github.com/MaxTheSyntax/SyntaxToolkit/#discord-bot-setup)

### Step 2

Make sure you have [npm](https://nodejs.org/en/download) installed. Open 2 terminals (ex. powershell) in the project directory. In one type:

```
npm i
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

## Discord bot setup

### Step 1

Firstly, go to [the Discord developer website]() and click on the `New Application` button in the top-right corner.

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1158769775548317767/image.png?ex=651d73f3&is=651c2273&hm=047de0d4743d010f54803a6d58bf13ddb1ca2fcf2d4d40bc9d16c998ae847678&" />

### Step 2

Name your bot and make sure to accept the [DTOS](https://discord.com/developers/docs/policies-and-agreements/developer-terms-of-service) and [Developer Policy](https://discord.com/developers/docs/policies-and-agreements/developer-policy)

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1158770143179047022/image.png?ex=651d744b&is=651c22cb&hm=e54a76fd2116f53a1ea4ab7e6fc5e4b9c24966cd53ff4f97f1705e70bc35643d&" />

### Step 3 (Getting your Token and ID's)

#### App ID

You should find your App ID on the `General Information` page. Click on the copy button to copy it.

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1158771696459841537/image.png?ex=651d75bd&is=651c243d&hm=fc7e0bacaf4f178347569b6767d70083e60b16cd7a083f234f7b4755abba8d3c&" />

#### Token

Go to the `Bot` tab. You should find a `Reset Token` button under your bot's name. Click on it and make sure to copy the token, as otherwise you will have to regenerate it.

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1158772399639109693/image.png?ex=651d7665&is=651c24e5&hm=aa7322c9625a84a880eec620ae3f02c9fc25adaf8412fe9a97438d4377e4748e&" />

#### Guild ID

This is the ID of the server the bot will operate on. Firrstly enable `Developer Mode` by going to the `Advanced` tab in settings.

 <img src="https://cdn.discordapp.com/attachments/1133464215924002846/1158773074125148270/image.png?ex=651d7705&is=651c2585&hm=be9c57059680bb442aa98c7e0c1b17c9320f713bfb0edd2dd4faa49cf915a503&" />

After you have enabled Developer Mode you should be able to right-click on any Discord server and see a `Copy Server ID` button. Click on it to get your `Guild ID`.

 <img src="https://cdn.discordapp.com/attachments/1133464215924002846/1158773647981428746/image.png?ex=651d778e&is=651c260e&hm=f225c1dda5fbff3e9be16469cd119651baec14292bbc1373c5415d11a535e9d1&" />

## Getting your IP

If you plan to host the application on your computer for yourself, you can just type in `localhost` and you're good to go. But if you plan to use the site on a different machine then you have to:

### Step 1

Click `Windows\Super + R`, and type in `cmd` into the windows that appeared, and click `OK`.

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1158774564139061318/image.png?ex=651d7869&is=651c26e9&hm=a6871cf1e506550f3ef77bd26f7a64ec24623943a306d87e88bffb303249b153&" />

### Step 2

Type in `ipconfig` if on windows, or `ifconfig` if on MacOS \ Linux into the window that just appeared. The `IPv4` section is what you're looking for.

<img src="https://cdn.discordapp.com/attachments/1133464215924002846/1158775679140237412/image.png?ex=651d7972&is=651c27f2&hm=357e141931dce797c0f308c2ebbe9827813f7df37b93ae403a5ef8666265f63a&" />
