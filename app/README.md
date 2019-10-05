
<img align="right" width="140" height="140" src="https://images-ext-1.discordapp.net/external/72UfvUaTzTYkV6FjG2Ab2F18Zef5p3piXzeN6rl_MC8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/554272860458450977/ccd888b746771ee0c29e9a47f6bc4366.png?width=300&height=300">

### Karen Bot
Roles & Star manager for the Hypixel Bedwars Discord.
- - -
**Installation and setup guide**:
Before reading this, I highly suggest you run this on a server/dedicated host rather than your home computer. If you really want to run it for free, you could remix the [glitch.com project](https://glitch.com/edit/#!/karen-discord?path=package.json:26:19) (scroll down for hosting on glitch).

1. Install [Node.js v10](https://nodejs.org). You can check if it's installed by entering your command line and typing "node -v". If it returns "Command not found", install it.
2. [Create your Discord application](https://anidiots.guide/getting-started/getting-started-long-version) | Keep reading until you reach `Step 2: Getting your coding environment ready`
3. Enter command line.
4. Run `git clone https://github.com/PostFarmer/Karen-Discord`
5. Install all the following dependencies. The order you do it does not matter, but all are required:
	- `npm install chalk` 
	- `npm install dateformat`
	- `npm install discordjs/discord.js`
	- `npm install discordjs/discord.js-commando`
	- `npm install node-fetch`
	- `npm install sqlite`
6. Create a `.env` file and add the following details:
```env
DISCORD_TOKEN=your-discord-token # Discord developer panel
HYPIXEL_API_KEY=your-hypixel-api-key # Log onto Hypixel -> type /api -> paste key
```
7. Inside `app.js`, go to the line `owner: ["345539839393005579"],` and replace it for `owner: ["your-user-id"],`. Anyone in this list can run dangerous commands such as eval and restart.
8. Inside `src/utils/Constants.js`, change the following data to what you want. You'll need Discord developer mode enabled:
```js
BOT_OWNER_ID: "id" // Your user ID
RANK_REQUEST_CHANNEL_ID: "id" // The channel where users verify themselves so karen can automatically purge it.
RANK_REQUEST_HELP_MESSAGE_ID: "id" // The message users will be redirected to if their account is not linked properly.
ROLES_SAFE: {...} // Replace all the string stuff ("123456789") with the role ids
```
9. Run the bot with `npm run start` - Should be online.

### Hosting on Glitch.com
Obviously, not everyone's the smartest pickle in the world and non-developers may find the avoid steps really confusing. To make this more simple, a glitch project has been setup you can easily remix and change to fit to your liking.
1. Visit [glitch.com](https://glitch.com) and login/create account (select github, google, or just create account).
2. Visit the [Karen Discord](https://glitch.com/edit/#!/karen-discord?path=README.md:32:55) project and remix the project. If there's no direct remix button, click on the top "Karen-Discord" and remix from there. Your project should be created for you.
3. Click on your project name (top left corner), and make the project private so no one can see the code. No one except project members can already access the `.env` file.
4. Create a `.env` file and add the following details:
```env
DISCORD_TOKEN=your-discord-token # Discord developer panel
HYPIXEL_API_KEY=your-hypixel-api-key # Log onto Hypixel -> type /api -> paste key
```
5. Inside `app.js`, go to the line `owner: ["345539839393005579"],` and replace it for `owner: ["your-user-id"],`. Anyone in this list can run dangerous commands such as eval and restart.
6. Inside `src/utils/Constants.js`, change the following data to what you want. You'll need Discord developer mode enabled:
```js
BOT_OWNER_ID: "id" // Your user ID
RANK_REQUEST_CHANNEL_ID: "id" // The channel where users verify themselves so karen can automatically purge it.
RANK_REQUEST_HELP_MESSAGE_ID: "id" // The message users will be redirected to if their account is not linked properly.
ROLES_SAFE: {...} // Replace all the string stuff ("123456789") with the role ids
```
7. Inside `app.js`, go to the line `owner: ["345539839393005579"],` and replace it for `owner: ["your-user-id"],`. Anyone in this list can run dangerous commands such as eval and restart.
8. Go into the `watch.json` file, type 1 character, then delete it. This will force glitch to restart the project.
9. Your Discord bot should be running nice and smoothly.

**HUGE WARNING**
- I am not responsible for any issues ran into during this process. If something goes wrong on your end, I am free to help you debug, however, I am not always available nor will I always help you with setting up the project.
- Keep your Discord Token hidden from everyone at all costs. Anyone with the token can run code themselves to perform malicious tasks (deleting all channels, banning everyone, sending cats, etc).