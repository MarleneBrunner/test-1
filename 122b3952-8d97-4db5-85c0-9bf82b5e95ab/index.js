// index.js (기존 코드)
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const weights = require('./weights');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// 사용자 데이터 샘플
const userData = new Map(); // 사용자 ID를 키로 사용하는 Map

const TOKEN = process.env.DISCORD_TOKEN;
const POINTS_COST = {
  JUICE: 2500,
  HOT6: 7400,
  TITLE: 70000,
  PLUS2: 50000,
  PLUS3: 90000,
};

// 명령어 파일 로드 (여기 추가된 부분)
const commandsPath = path.join(__dirname, 'commands');
fs.readdir(commandsPath, (err, files) => {
  if (err) console.error(err);
  files.filter(file => file.endsWith('.js')).forEach(file => {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
  });
});

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefix = '!';

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    await command.execute(message, args, weights, POINTS_COST, userData); // userData를 전달
  } catch (error) {
    console.error(error);
    await message.reply('명령어를 실행하는 중 오류가 발생했습니다!');
  }
});

client.login(TOKEN);

