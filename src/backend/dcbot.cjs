// Import necessary modules and load environment variables
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes, Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const readline = require('node:readline');
const { Console } = require('node:console');
// const readline = require('readline').createInterface({
// 	input: process.stdin,
// 	output: process.stdout,
// });
dotenv.config();

const DC_TOKEN = process.env.DC_TOKEN;
const APP_ID = process.env.APP_ID;

// Create a new Discord client instance with the intent to interact with guilds
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialize a collection to store bot commands
client.commands = new Collection();

// Load command files from the 'commands' directory
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const commands = [];

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
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" and/or "execute" property.`
			);
		}
	}
}

const rest = new REST().setToken(DC_TOKEN);

// Log a message when the bot is ready
client.once(Events.ClientReady, async () => {
	console.log('Connected!');

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question('Refresh commands? (y/N) \n', async (input) => {
		input = input.toLowerCase();
		while (true) {
			if (input === 'y') {
				refresh_commands = true;
				console.log('Refreshing commands...');
				break;
			} else if (input === 'n' || input === '') {
				refresh_commands = false;
				console.log('Cancelling');
				break;
			}

			console.log('Invalid input. Please enter y or n.');
			input = await new Promise((resolve) => rl.question('Refresh commands? (y/N) \n', resolve));
		}

		// If user requests to, refresh the commands
		if (refresh_commands) {
			for (const guild of client.guilds.cache.values()) {
				// The put method is used to fully refresh all commands in the guild with the current set
				const data = await rest.put(Routes.applicationGuildCommands(APP_ID, guild.id), {
					body: commands,
				});
				console.log(
					`Successfully reloaded ${data.length} slash (/) commands for ${guild.name}. ID: ${guild.id}`
				);
			}
			console.log('Done!');
		}
		// rl.close();

		// Ask user if they want to send an activity message
		send_activity_message = true;
		rl.question('Send activity message? (Y/n) \n', async (input) => {
			input = input.toLowerCase();
			while (true) {
				if (input === 'y' || input === '') {
					send_activity_message = true;
					console.log('Sending activity message...');
					break;
				} else if (input === 'n') {
					send_activity_message = false;
					break;
				}

				console.log('Invalid input. Please enter y or n.');
				input = await new Promise((resolve) =>
					rl.question('Send activity message? (Y/n) \n', resolve)
				);
			}

			// If user requests to, refresh the commands
			if (send_activity_message) {
				for (const guild of client.guilds.cache.values()) {
					// console.log(`Guild: ${guild.name}, ID: ${guild.id}`);

					const channel = guild.systemChannel;
					if (channel) {
						// await channel.send('bot active');
						await channel.send({
							content: 'bot active',
							flags: [4096], // Used to send a silent message
						});
					}
				}
				console.log('Done!');
			}

			rl.close();
			console.log('Discord bot is ready!');
		});
	});

	// await new Promise((resolve) => rl.on('close', resolve)); // Wait until the readline interface is closed
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
