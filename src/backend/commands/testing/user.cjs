const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with information about user.'),
	async execute(interaction) {
		const member = interaction.member;
		const presence = member.presence;
		const status = presence ? presence.status : 'idk';

		await interaction.reply(`Command has been run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}. The user's status is "${status}".`);
	},
};
