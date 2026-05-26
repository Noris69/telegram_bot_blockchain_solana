# **Solana Telegram Wallet Bot**

A **Telegram bot** built with **Node.js**, connected to the **Solana blockchain**, allowing users to create and import Solana wallets, select a principal wallet, use referral links, and play a simple interactive game through Telegram inline buttons.

The bot combines:

- **Telegram bot interactions**
- **Solana wallet generation**
- **Wallet import using private keys**
- **MongoDB persistence**
- **Referral system**
- **Mini-game mechanics**
- **Inline keyboard navigation**

---

# **Project Purpose**

The goal of this project is to provide an interactive Telegram bot that introduces users to Solana wallet management and blockchain-based game mechanics.

Users can:

- **Create a Solana wallet**
- **Import an existing Solana wallet**
- **Choose a principal wallet**
- **Start a mini-game**
- **Choose destinations**
- **Choose boats**
- **Select items**
- **Confirm choices**
- **Win or lose game rewards**
- **Generate referral links**
- **Earn referral points**

This project can be used as a foundation for:

- **Telegram crypto bots**
- **Solana wallet assistant bots**
- **Blockchain mini-games**
- **Referral-based Telegram communities**
- **Web3 onboarding tools**
- **Telegram game bots**
- **Solana learning projects**

---

# **Technologies Used**

## **Backend / Bot**

- **Node.js**
- **JavaScript**
- **node-telegram-bot-api**
- **MongoDB**
- **Mongoose**

## **Blockchain**

- **Solana Web3.js**
- **bs58**
- **Solana Keypair generation**
- **Private key import**

---

# **Main Features**

## **Telegram Bot Menu**

The bot displays an interactive Telegram menu with inline buttons:

- **My Wallets**
- **Start Game**
- **Referral**

Users interact directly inside Telegram using buttons and messages.

---

## **Solana Wallet Management**

The bot allows users to:

- **Generate a new Solana wallet**
- **Store wallet public keys**
- **Import wallets using base58 private keys**
- **Select a principal wallet**
- **Use the principal wallet as the game identity**

---

## **MongoDB User Storage**

The bot stores user data in MongoDB.

Each user can have:

- **Telegram user ID**
- **List of wallets**
- **Principal wallet**
- **Points**
- **Referral information**

---

## **Referral System**

Each user can generate a referral link.

The referral system supports:

- **Unique referral links**
- **Referral tracking**
- **Referral points**
- **Self-referral prevention**
- **Duplicate referral prevention**

---

## **Mini-Game System**

The bot includes a simple interactive game where users can:

- **Choose a destination**
- **Choose a boat**
- **Choose game items**
- **View selected choices**
- **Confirm the game**
- **Win or lose based on random result**

Example items include:

- **Compass**
- **Canon**
- **Knife**
- **Map**
- **Medkit**
- **Water Barrel**

---

# **Project Structure**

```bash
telegram_bot_blockchain_solana/
├── test.js
├── package.json
├── package-lock.json
└── README.md
```

Recommended improved structure:

```bash
telegram_bot_blockchain_solana/
├── src/
│   ├── bot.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── User.js
│   ├── services/
│   │   ├── walletService.js
│   │   ├── referralService.js
│   │   └── gameService.js
│   └── keyboards/
│       └── inlineKeyboards.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# **Installation**

## **1. Clone the Repository**

```bash
git clone https://github.com/Noris69/telegram_bot_blockchain_solana.git
cd telegram_bot_blockchain_solana
```

---

## **2. Install Dependencies**

```bash
npm install
```

---

## **3. Create Environment Variables**

Create a `.env` file in the root folder:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
MONGO_URI=your_mongodb_connection_string
```

---

## **4. Update the Code to Use Environment Variables**

Instead of hardcoding secrets, use:

```js
require("dotenv").config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

mongoose.connect(process.env.MONGO_URI);
```

Also install `dotenv` if needed:

```bash
npm install dotenv
```

---

## **5. Run the Bot**

```bash
npm start
```

or:

```bash
node test.js
```

---

# **Available Scripts**

```bash
npm start
```

Runs the Telegram bot using:

```bash
node test.js
```

---

# **User Model**

The MongoDB user schema stores:

```js
{
  userId: Number,
  wallets: [String],
  principalWallet: String,
  points: Number,
  referredBy: Number
}
```

---

# **Bot Commands**

## **/start**

Starts the bot and displays the main menu:

- **My Wallets**
- **Start Game**
- **Referral**

---

# **Main Bot Actions**

| Action | Description |
|---|---|
| **My Wallets** | Opens wallet management menu |
| **Create SOL Wallet** | Generates a new Solana wallet |
| **Import SOL Wallet** | Imports a wallet from a base58 private key |
| **Choose Principal Wallet** | Selects the main wallet used in the game |
| **Start Game** | Starts the interactive game |
| **Referral** | Generates a referral link and displays points |

---

# **Game Flow**

## **1. Start Game**

The user starts the game from the Telegram menu.

## **2. Select Principal Wallet**

The user must select a principal wallet before playing.

## **3. Choose Destination**

The user selects a destination.

## **4. Choose Boat**

The user browses boat images and selects one.

## **5. Choose Items**

The user selects items such as Compass, Canon, Knife, Map, Medkit, or Water Barrel.

## **6. Confirm Choices**

The bot displays the selected destination, boat, items, and total price.

## **7. Game Result**

The bot randomly returns:

```text
You won!
```

or:

```text
You lost. Try again.
```

---

# **Security Warning**

This project currently needs important security improvements before production use.

## **Do Not Hardcode Secrets**

Never hardcode:

- **Telegram bot token**
- **MongoDB URI**
- **Private keys**
- **API keys**
- **Wallet secrets**

Use `.env` instead.

---

## **Private Key Risk**

The bot currently allows users to send private keys in Telegram messages for wallet import.

This is dangerous because:

- Telegram messages may remain visible temporarily.
- Logs or bot errors can expose sensitive information.
- Users can accidentally leak wallets.
- Anyone with a private key can control the wallet.

Recommended safer alternatives:

- **Only store public keys**
- **Avoid asking users for private keys**
- **Use wallet connection flows when possible**
- **Use encrypted storage if private key handling is mandatory**
- **Delete sensitive messages immediately**
- **Warn users clearly before importing**

---

# **Git Ignore Recommendations**

```gitignore
node_modules/
.env
*.log
.DS_Store
.vscode/
.idea/
```

---

# **Recommended package.json Improvement**

Current start script:

```json
"start": "node test.js"
```

Recommended rename:

```json
"main": "bot.js",
"scripts": {
  "start": "node bot.js",
  "dev": "nodemon bot.js"
}
```

Then rename:

```bash
test.js
```

to:

```bash
bot.js
```

---

# **Future Improvements**

- **Move secrets to environment variables**
- **Revoke exposed Telegram token**
- **Revoke exposed MongoDB credentials**
- **Rename test.js to bot.js**
- **Split code into modules**
- **Add proper error handling**
- **Add logging system**
- **Add command handlers**
- **Add wallet balance checking**
- **Add Solana transaction support**
- **Add secure wallet import process**
- **Add encrypted storage**
- **Improve referral logic**
- **Add admin commands**
- **Add tests**
- **Add Docker support**
- **Add deployment documentation**

---

# **Author**

Developed by **Noris69**.
