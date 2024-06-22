const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Launch a game on Syntax\'s PC')
    .addStringOption(option => 
        option.setName('launcher')
            .setDescription('The platform of the game to launch')
            .setRequired(true)
            .addChoices(
                { name: 'Steam', value: 'steam' },
                { name: 'Roblox', value: 'roblox' }
            ))
    .addStringOption(option => 
        option.setName('appid')
            .setDescription('The placeid/appid of the game to launch')
            .setRequired(true)),
  async execute(interaction) {
    const appid = interaction.options.getString('appid');
    const platform = interaction.options.getString('launcher');

    if (!appid) {
      await interaction.reply('You must provide a valid Steam app ID!');
      return;
    }

    try {
      // Make a request to the backend to launch the game
      const response = await axios.get(`http://localhost:8800/rungame?appid=${appid}&platform=${platform}`);
      
      if (response.status === 200) {
        await interaction.reply(`Launching game with app ID: ${appid}`);
      } else {
        await interaction.reply(`Failed to launch game. Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error launching game:', error);
      await interaction.reply('Error launching game. Please check the server or app ID.');
    }
  }
};
