const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('user')
	.setDescription('Replies with information about user.'),
	async execute(interaction) {
		await interaction.reply(`Command has ben ran by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};
