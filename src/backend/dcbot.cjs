// Import necessary modules and load environment variables
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const DC_TOKEN = process.env.DC_TOKEN;

// Create a new Discord client instance with the intent to interact with guilds
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialize a collection to store bot commands
client.commands = new Collection();

// Load command files from the 'commands' directory
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Loop through all the command folders
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.cjs'));
	// Loop through all the command files in the folder
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Add command to the collection if it has 'data' and 'execute' properties
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" and/or "execute" property.`
			);
		}
	}
}

// Log a message when the bot is ready
client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

// Handle interactions (commands) from users
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		const reply = { content: 'There was an error while executing this command!', ephemeral: true };
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(reply);
		} else {
			await interaction.reply(reply);
		}
	}
});

// Log in to Discord with the bot token
client.login(DC_TOKEN);
