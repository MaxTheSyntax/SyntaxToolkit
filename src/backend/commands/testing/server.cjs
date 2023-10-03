const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('server')
	.setDescription('Replies with information about server.'),
	async execute(interaction) {
		await interaction.reply(`This servers name is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
	},
};
