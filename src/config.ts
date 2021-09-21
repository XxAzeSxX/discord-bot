import { exit } from 'process';
import { config as loadEnv } from 'dotenv';
import { ClientOptions, Intents } from 'discord.js';
import { LogLevel } from '@sapphire/framework';
import CustomLogger from './logger';
import type { Options as SequelizeOption } from 'sequelize';

if (loadEnv().error) {
	console.error(loadEnv().error);
	exit(1);
}

const env: any = loadEnv().parsed;

interface Configuration {
	bot: {
		clientOptions: ClientOptions;
		token: string;
	};
	database: SequelizeOption;
}

const config: Configuration = {
	bot: {
		token: env.BOT_TOKEN as string,
		clientOptions: {
			// Enable all intents
			defaultPrefix: '!',
			caseInsensitiveCommands: true,
			logger: { instance: new CustomLogger(LogLevel.Debug) },
			intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b),
		},
	},
	database: {
		host: env.DB_HOST,
		database: env.DB_DATABASE,
		username: env.DB_USER,
		password: env.DB_PASS,
		dialect: 'mariadb',
	},
};

declare module '@sapphire/pieces' {
	interface Container {
		config: Configuration;
	}
}

export default config;
