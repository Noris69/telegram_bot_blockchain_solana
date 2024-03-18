const TelegramBot = require('node-telegram-bot-api');
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://cheikhnoris69:moimoimm1@cluster0.z3njxac.mongodb.net/wallets', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new Schema({
    userId: { type: Number, required: true, unique: true },
    wallets: [{ type: String, required: true }] ,// Définition de wallets comme un tableau de chaînes de caractères
    principalWallet: { type: String }, // Ajout de principalWallet comme champ
    points: { type: Number, default: 0 },
    referredBy: { type: Number, default: null }
  });
  

const User = mongoose.model('User', userSchema);

const bot = new TelegramBot('6636755716:AAFpf9XEXP6IypGtJNzPwtYuvwmHJlIxoms', { polling: true });
const boatImages = [
    { url: 'https://i.ibb.co/FbbSDyt/image1.jpg', name: 'Boat 1' },
    { url: 'https://i.ibb.co/XzN775r/image2.jpg', name: 'Boat 2' },
    { url: 'https://i.ibb.co/GH4CDfn/image3.jpg', name: 'Boat 3' },
    { url: 'https://i.ibb.co/n0Y9bjY/image4.jpg', name: 'Boat 4' },
    { url: 'https://i.ibb.co/LvKyzpd/Whats-App-Image-2024-03-17-21-37-53-652e10b1.jpg', name: 'Boat 5' }
];

const itemImages = [
    { url: 'https://i.ibb.co/1M0pH0w/campass.jpg', name: 'Compass' },
    { url: 'https://i.ibb.co/6DpJyfj/cannon.jpg', name: 'Canon' },
    { url: 'https://i.ibb.co/fSZcfj2/knife.jpg', name: 'Knife' },
    { url: 'https://i.ibb.co/6rmZX4Y/map.jpg', name: 'Map' },
    { url: 'https://i.ibb.co/4sKFxq4/Medkit.jpg', name: 'Medkit' },
    { url: 'https://i.ibb.co/H7RBLX1/toolbox.jpg', name: 'Toolbox' },
    { url: 'https://i.ibb.co/Mk1x89M/watter-barrel.jpg', name: 'Water Barrel' }
];
let wallets = [];
let userChoices = {};
let principalWallet = "";
let nonSelectedItems = [
  { id: 'item_1', name: 'Compass (1$TOKEN)', price: 1 },
  { id: 'item_2', name: 'Canon (2$TOKEN)' , price: 2 },
  { id: 'item_3', name: 'Knife (3$TOKEN)', price: 3 },
  { id: 'item_4', name: 'Map (4$TOKEN)', price: 4 },
  { id: 'item_5', name: 'Medkit (5$TOKEN)', price: 5 },
  { id: 'item_6', name: 'Water Barrel (6$TOKEN)', price: 6 }
];

// Au démarrage du bot
bot.onText(/\/start/, (msg) => {
  // Récupérer le portefeuille principal de la base de données
  User.findOne({ userId: msg.from.id })
    .then(user => {
      if (user && user.principalWallet) {
        principalWallet = user.principalWallet; // Stocker le portefeuille principal trouvé
      }
      // Envoyer le message de bienvenue
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💰 My Wallets', callback_data: 'wallets' }, { text: '👾 Start Game', callback_data: 'start_game' },{ text: '🤝 Referral', callback_data: 'referral' }]
          ]
        }
      };
      bot.sendMessage(msg.chat.id, "Welcome to the Solana Wallet Bot. Please select an option:", opts);
    })
    .catch(error => {
      console.error('Error fetching principal wallet from database:', error);
      // En cas d'erreur, envoyer un message de bienvenue sans le portefeuille principal
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💰 My Wallets', callback_data: 'wallets' }, { text: '👾 Start Game', callback_data: 'start_game' }, { text: '🤝 Referral', callback_data: 'referral' }]
          ]
        }
      };
      bot.sendMessage(msg.chat.id, "Welcome to the Solana Wallet Bot. Please select an option:", opts);
    });
});

bot.on('callback_query', async (callbackQuery) => {
    const userId  = callbackQuery.from.id;
    const user = await User.findOne({ userId });


    if (callbackQuery.data === 'referral') {
        const referralLink = `https://t.me/cheikhnoris_bot?start=${userId}`;
        bot.sendMessage(userId, `Your referral link: ${referralLink}\nYour current points: ${user.points}`);
    }
});


bot.on('message', async (msg) => {
    const referringUserId = msg.text.split(' ')[1];
    const referredUserId = msg.from.id;

    if (referredUserId && referringUserId && referredUserId != referringUserId) {
        const referredUser = await User.findOne({ userId: referredUserId });
        const referringUser = await User.findOne({ userId: referringUserId });

        if (referredUser && referredUser.referredBy !== null) {
            bot.sendMessage(referringUserId, "This user has already been referred by someone else.");
            return;
        }
        if (referredUser) {
            bot.sendMessage(referringUserId, "Referred already in the database.");
            return;
        }
        if (referredUser && referringUser) {
            referredUser.referredBy = referringUserId;
            referredUser.points += 10;
            await referredUser.save();

            referringUser.points += 10;
            await referringUser.save();

            bot.sendMessage(referredUserId, `You have been referred by user ${referringUserId} and received 10 points.`);
            bot.sendMessage(referringUserId, `You have successfully referred user ${referredUserId} and received 10 points.`);
        } else {
            bot.sendMessage(referringUserId, "Invalid referral. Please make sure the referral link is correct and hasn't been used before.");
        }
    } else if (referredUserId === referringUserId) {
        bot.sendMessage(referringUserId, "You can't refer yourself.");
    }
});


bot.on('callback_query', (query) => {
  const data = query.data;
  const userId = query.from.id;
  const messageId = query.message.message_id;
 

  if (data === 'wallets') {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Create SOL Wallet', callback_data: 'create' }, { text: 'Import SOL Wallet', callback_data: 'import' }, { text: 'Choose Principal Wallet', callback_data: 'choose_principal' }],
          [{ text: 'Return', callback_data: 'return' }]
        ]
      }
    };
    bot.editMessageText("Choose an action:", {
      chat_id: userId,
      message_id: messageId,
      reply_markup: opts.reply_markup
    });
} else if (data === 'create') {
    // Generate wallet
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
  
    // Save wallet to the database
    User.findOneAndUpdate(
      { userId: userId },
      { $addToSet: { wallets: publicKey } }, // Add wallet to the list of wallets, avoiding duplicates
      { upsert: true, new: true }
    )
      .then((user) => {
        // Wallet saved successfully
        const wallets = user.wallets; // Retrieve user's wallets
        const newMessage = `New wallet created! Public Key: ${publicKey}`;
        const opts = {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Return', callback_data: 'wallets' }]
            ]
          }
        };
        bot.editMessageText(newMessage, {
          chat_id: userId,
          message_id: messageId,
          reply_markup: opts.reply_markup
        });
      })
      .catch(error => {
        // Error handling
        console.error('Error saving wallet to database:', error);
        bot.sendMessage(userId, "An error occurred while saving the wallet. Please try again later.");
      });
}
else if (data === 'import') {
    bot.sendMessage(userId, "Send your private key in base58 format to import.").then(sentMessage => {
        setTimeout(() => {
            bot.deleteMessage(sentMessage.chat.id, sentMessage.message_id);
        }, 5000); // Delete the message after 5 seconds
    });  } else if (data === 'list') {
    let message;
    if (wallets.length === 0) {
      message = "No wallets created or imported yet.";
    } else {
      const walletList = wallets.join("\n");
      message = `List of wallets:\n${walletList}`;
    }
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Return', callback_data: 'wallets' }]
        ]
      }
    };
    bot.editMessageText(message, {
      chat_id: userId,
      message_id: messageId,
      reply_markup: opts.reply_markup
    });
  } else if (data === 'return') {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '💰 My Wallets', callback_data: 'wallets' }, { text: '👾 Start Game', callback_data: 'start_game' }, { text: '🤝 Referral', callback_data: 'referral' }]
        ]
      }
    };
    bot.editMessageText("Check your Wallets or Start the Game:", {
      chat_id: userId,
      message_id: messageId,
      reply_markup: opts.reply_markup
    });
  } else if (data === 'start_game') {
    userChoices = {};
    nonSelectedItems = [
        { id: 'item_1', name: 'Compass (1$TOKEN)', price: 1 },
        { id: 'item_2', name: 'Canon (2$TOKEN)' , price: 2 },
        { id: 'item_3', name: 'Knife (3$TOKEN)', price: 3 },
        { id: 'item_4', name: 'Map (4$TOKEN)', price: 4 },
        { id: 'item_5', name: 'Medkit (5$TOKEN)', price: 5 },
        { id: 'item_6', name: 'Water Barrel (6$TOKEN)', price: 6 }
    ];
    let opts;
    if (principalWallet === "") {
      opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Select a Principal Wallet', callback_data: 'choose_principal' }],
            [{ text: 'Return', callback_data: 'return' }]
          ]
        }
      };
      bot.editMessageText("No principal wallet selected. Please choose a principal wallet to continue.", {
        chat_id: userId,
        message_id: messageId,
        reply_markup: opts.reply_markup
      });
    } else {
      nonSelectedItems = [
        { id: 'item_1', name: 'Compass (1$TOKEN)', price: 1 },
        { id: 'item_2', name: 'Canon (2$TOKEN)' , price: 2 },
        { id: 'item_3', name: 'Knife (3$TOKEN)', price: 3 },
        { id: 'item_4', name: 'Map (4$TOKEN)', price: 4 },
        { id: 'item_5', name: 'Medkit (5$TOKEN)', price: 5 },
        { id: 'item_6', name: 'Water Barrel (6$TOKEN)', price: 6 }
      ];
      if (nonSelectedItems.length === 0) {
        opts = {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🗾 Destination 1', callback_data: 'destination_1' }, { text: '🗾 Destination 2', callback_data: 'destination_2' }, { text: '🗾 Destination 3', callback_data: 'destination_3' }],
              [{ text: 'Return', callback_data: 'return' }]
            ]
          }
        };
        bot.editMessageText(`Choose destination:\nYour playing as ${principalWallet}`, {
          chat_id: userId,
          message_id: messageId,
          reply_markup: opts.reply_markup
        });
      } else {
        opts = {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🗾 Destination 1', callback_data: 'destination_1' }, { text: '🗾 Destination 2', callback_data: 'destination_2' }, { text: '🗾 Destination 3', callback_data: 'destination_3' }],
              [{ text: 'Return', callback_data: 'return' }]
            ]
          }
        };
        bot.editMessageText(`Choose destination:\nYour playing as ${principalWallet}`, {
          chat_id: userId,
          message_id: messageId,
          reply_markup: opts.reply_markup
        });
      }
    }
} else if (data.startsWith('destination')) {
    userChoices.destination = data;
    // Delete previous boat images conversation
    const deletePromises = [];
    for (let i = 0; i < 1; i++) {
        deletePromises.push(
            bot.deleteMessage(userId, messageId - i).catch(error => {
                console.error('Error deleting message:', error);
            })
        );
    }
    let currentBoatIndex = 0;

    deletePreviousMessage = (userId, messageId) => {
        bot.deleteMessage(userId, messageId).catch(error => {
            console.error('Error deleting message:', error);
        });
    };
    const sendBoatImageWithButtons = () => {
        const { url, name } = boatImages[currentBoatIndex];
        const message = `${name}`;

        const boatKeyboard = [
            { text: '⬅️', callback_data: 'prev_boat' },
            { text: 'Choose Boat', callback_data: `boat_${currentBoatIndex + 1}` },
            { text: '➡️', callback_data: 'next_boat' }
        ];

        // Disable previous button if on boat 1
    if (currentBoatIndex === 0) {
        boatKeyboard[0].callback_data = 'disabled';
    }

    // Disable next button if on boat 5
    if (currentBoatIndex === boatImages.length - 1) {
        boatKeyboard[2].callback_data = 'disabled';
    }
        // If there is a previous message, delete it before sending a new one
    if (userChoices.messageId) {
        deletePreviousMessage(userId, userChoices.messageId);
    }
        
    bot.sendPhoto(userId, url, { caption: message, reply_markup: { inline_keyboard: [boatKeyboard] } })
    .then(sentMessage => {
        userChoices.messageId = sentMessage.message_id;
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
    };

    const updateBoatImageAndButtons = () => {
        sendBoatImageWithButtons();
    };

    updateBoatImageAndButtons();

    bot.on('callback_query', query => {
        const data = query.data;
        if (data === 'next_boat') {
            currentBoatIndex = (currentBoatIndex + 1) ;
           
            updateBoatImageAndButtons();
            
        } else if (data === 'prev_boat') {
            currentBoatIndex = (currentBoatIndex - 1 );
            
            updateBoatImageAndButtons();
            
        }
    });
}

 else if (data.startsWith('boat')) {
    userChoices.boat = data;

    

    let currentItemIndex = 0;

    deletePreviousMessage = (userId, messageId) => {
        bot.deleteMessage(userId, messageId).catch(error => {
            console.error('Error deleting message:', error);
        });
    };

    const sendItemImageWithButtons = () => {
        const { url, name } = itemImages[currentItemIndex];
        const message = `${name}`;

        const itemKeyboard = [
            { text: '⬅️', callback_data: 'prev_item' },
            { text: 'Choose Item', callback_data: `item_${currentItemIndex + 1}` },
            { text: '➡️', callback_data: 'next_item' }
        ];

        // Disable previous button if on item 1
        if (currentItemIndex === 0) {
            itemKeyboard[0].callback_data = 'disabled';
        }

        // Disable next button if on last item
        if (currentItemIndex === itemImages.length - 1) {
            itemKeyboard[2].callback_data = 'disabled';
        }

        // If there is a previous message, delete it before sending a new one
        if (userChoices.messageId) {
            deletePreviousMessage(userId, userChoices.messageId);
        }

        bot.sendPhoto(userId, url, { caption: message, reply_markup: { inline_keyboard: [itemKeyboard] } })
        .then(sentMessage => {
            userChoices.messageId = sentMessage.message_id;
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    };

    const updateItemImageAndButtons = () => {
        sendItemImageWithButtons();
    };

    updateItemImageAndButtons();

    bot.on('callback_query', query => {
        const data = query.data;
        if (data === 'next_item') {
            currentItemIndex = (currentItemIndex + 1) ;

            updateItemImageAndButtons();

        } else if (data === 'prev_item') {
            currentItemIndex = (currentItemIndex - 1 );

            updateItemImageAndButtons();

        }
    });
}

 else if (data.startsWith('item')) {
    const deletePromises = [];
    for (let i = 0; i < 1; i++) {
        deletePromises.push(
            bot.deleteMessage(userId, messageId - i).catch(error => {
                console.error('Error deleting message:', error);
            })
        );
    }
    const selectedItem = nonSelectedItems.find(item => item.id === data);
    if (!userChoices.items) {
      userChoices.items = [];
    }
    if (!userChoices.items.some(item => item.id === selectedItem.id)) {
      userChoices.items.push(selectedItem);
      nonSelectedItems = nonSelectedItems.filter(item => item.id !== selectedItem.id);
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Add More Items', callback_data: 'add_items' }, { text: 'Continue', callback_data: 'show_choices' }]
          ]
        }
      };
      if (nonSelectedItems.length === 0) {
        bot.editMessageText(`You chose ${selectedItem.name} (${selectedItem.price} $TKN). All items selected.`, {
          chat_id: userId,
          message_id: messageId,
          reply_markup: opts.reply_markup
        });
      } else {
        bot.sendMessage(userId, `You chose ${selectedItem.name} (${selectedItem.price} $TKN). Choose more items or confirm.`, {
            reply_markup: opts.reply_markup
        });
      }
    } else { //
      bot.sendMessage(userId, "You've already chosen this item. Please choose a different one.").then(sentMessage => {
        setTimeout(() => {
          bot.deleteMessage(sentMessage.chat.id, sentMessage.message_id);
        }, 2000);
      });
    }
  } else if (data === 'show_choices') {
    if (userChoices.items && userChoices.items.length > 0) {
      let itemsText = userChoices.items.map(item => `${item.name} (${item.price} $TKN)`).join(', ');
      let totalPrice = userChoices.items.reduce((acc, item) => acc + item.price, 0);
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [ { text: "Restart", callback_data: "start_game" },{ text: 'Confirm', callback_data: 'confirm' }]
          ]
        }
      };
      bot.editMessageText(`Your choices:\nDestination : ${userChoices.destination.replace('_', ' ').toUpperCase()}\nBoat : ${userChoices.boat.replace('_', ' ').toUpperCase()}\nItems : ${itemsText}\nTotal Price: ${totalPrice} $TKN\n\n`, {
        chat_id: userId,
        message_id: messageId,
        reply_markup: opts.reply_markup
      });
    } else {
      bot.sendMessage(userId, "You haven't chosen any items yet.").then(sentMessage => {
        setTimeout(() => {
          bot.deleteMessage(sentMessage.chat.id, sentMessage.message_id);
        }, 2000);
      });
    }
// Inside the 'choose_principal' command
} else if (data === 'choose_principal') {
    // Récupérer toutes les wallets de la base de données pour l'utilisateur actuel
    User.findOne({ userId: userId })
      .then(user => {
        if (user) {
          const wallets = user.wallets; // Correction: Utilisez user.wallets au lieu de user.wallet
          if (Array.isArray(wallets)) { // Vérifiez si wallets est un tableau
            const walletsButtons = wallets.map(wallet => [{ text: wallet, callback_data: 'choose_wallet_' + wallet }]);
            const opts = {
              reply_markup: {
                inline_keyboard: [
                  ...walletsButtons,
                  [{ text: 'Return', callback_data: 'wallets' }]
                ]
              }
            };
            bot.editMessageText("Choose your principal wallet:", {
              chat_id: userId,
              message_id: messageId,
              reply_markup: opts.reply_markup
            });
          } else {
            // wallets n'est pas un tableau
            bot.sendMessage(userId, "An error occurred while fetching wallets. Please try again later.");
          }
        } else {
          // Aucune wallet trouvée pour l'utilisateur
          bot.sendMessage(userId, "No wallets found for you. Please create or import a wallet first.");
        }
      })
      .catch(error => {
        // Erreur lors de la récupération des wallets depuis la base de données
        console.error('Error fetching wallets from database:', error);
        bot.sendMessage(userId, "An error occurred while fetching wallets. Please try again later.");
      });
    } else if (data.startsWith('choose_wallet')) {
        principalWallet = data.split('_')[2];
        const opts = {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Wallet chosen', callback_data: 'wallets' }]
            ]
          }
        };
        bot.editMessageText(`Principal wallet set to: ${principalWallet}`, {
          chat_id: userId,
          message_id: messageId,
          reply_markup: opts.reply_markup
        });
    
        // Mettez à jour la base de données avec le principalWallet choisi
        User.findOneAndUpdate(
          { userId: userId },
          { principalWallet: principalWallet }, // Mettre à jour principalWallet pour cet utilisateur
          { upsert: true, new: true }
        )
        .then(() => {
          console.log(`Principal wallet set to: ${principalWallet}`);
        })
        .catch(error => {
          console.error('Error setting principal wallet:', error);
        });
    }else if (data === 'confirm') {
    if (userChoices.items) {
      let itemsText = userChoices.items.map(item => `${item.name} (${item.price}$TKN)`).join(', ');
      let totalPrice = userChoices.items.reduce((acc, item) => acc + item.price, 0);
      const random = Math.random();
      const result = random < 0.5 ? `You won! \nTotal Prize: ${totalPrice * 2}$TKN` : 'You lost. Try again.';
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Return to Menu', callback_data: 'start' }]
          ]
        }
      };
      bot.editMessageText(`${result}`, {
        chat_id: userId,
        message_id: messageId,
        reply_markup: opts.reply_markup
      });
    } else {
      bot.sendMessage(userId, "You haven't chosen any items. Please choose at least one item.");
    }
  } else if (data === 'add_items') {
    if (userChoices.items && userChoices.items.length < 6) {
      const itemButtons = nonSelectedItems.map(item => [{ text: item.name + ' (' + item.price +'$TKN)', callback_data: item.id }]);
      const opts = {
        reply_markup: {
          inline_keyboard: [
            ...itemButtons,
            [{ text: 'Return', callback_data: 'return_add_item' }]
          ]
        }
      };
      bot.editMessageText("Choose more items:", {
        chat_id: userId,
        message_id: messageId,
        reply_markup: opts.reply_markup
      });
    } else {
      const itemButtons = userChoices.items.map(item => [{ text: item.name + ' (' + item.price +'$TKN)', callback_data: item.id }]);
      bot.sendMessage(userId, "You've already selected all item available. Click Continue.").then(sentMessage => {
        setTimeout(() => {
          bot.deleteMessage(sentMessage.chat.id, sentMessage.message_id);
        }, 2000);
      });
    }
  } else if (data === 'return_add_item') {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Add More Items', callback_data: 'add_items' }, { text: 'Show Choices', callback_data: 'show_choices' }]
        ]
      }
    };
    bot.editMessageText("Add more items or continue..",  {
      chat_id: userId,
      message_id: messageId,
      reply_markup: opts.reply_markup
    });
  } else if (data === 'start') {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '💰 My Wallets', callback_data: 'wallets' }, { text: '👾 Start Game', callback_data: 'start_game' }, { text: '🤝 Referral', callback_data: 'referral' }]
        ]
      }
    };
    bot.editMessageText("Check your Wallets or Start the Game:", {
      chat_id: userId,
      message_id: messageId,
      reply_markup: opts.reply_markup
    });
  } 
});

bot.on('message', (msg) => {
    if (msg.text && msg.text.length > 0 && !msg.text.startsWith('/')) {
      try {
        const privateKey = msg.text;
        const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
        const publicKey = keypair.publicKey.toString();
  
        // Save imported wallet to the database
        User.findOneAndUpdate(
          { userId: msg.from.id },
          { $addToSet: { wallets: publicKey } }, // Add wallet to the list of wallets, avoiding duplicates
          { upsert: true, new: true }
        )
          .then((user) => {
            // Wallet saved successfully
            const wallets = user.wallets; // Retrieve user's wallets
            const successMessage = `Wallet imported successfully! Your public key is: ${publicKey}`;
            bot.sendMessage(msg.chat.id, successMessage).then(sentMsg => {
              // Delete the original "Send your private key in base58 format to import." message
              setTimeout(() => {
                bot.deleteMessage(msg.chat.id, msg.message_id);
              }, 5000);
  
              // Delete the success message after a certain delay (e.g., 5 seconds)
              setTimeout(() => {
                bot.deleteMessage(sentMsg.chat.id, sentMsg.message_id);
              }, 5000); // Delay in milliseconds
            });
          })
          .catch(error => {
            // Error handling
            console.error('Error saving wallet to database:', error);
            bot.sendMessage(msg.chat.id, "An error occurred while saving the wallet. Please try again later.");
          });
      } catch (error) {
        bot.sendMessage(msg.chat.id, "There was an error importing the wallet. Please make sure you've provided a valid private key in base58 format.");
      }
    }
  });
  


console.log('Bot server started in the polling mode...');
