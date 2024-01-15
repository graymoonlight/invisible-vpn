const TOKEN = '6927915937:AAExzAajoAxCbUjLr1ArfhTL9NCJQSveZJs'
const LINK = 'https://t.me/invisible_vpn_bot'

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true
    }
});

const commands = [
    {
        command: "start",
        description: "Запуск бота"
    },
    {
        command: "ref",
        description: "Получить реферальную ссылку"
    },
];

// Установка команд бота
bot.setMyCommands(commands);

bot.on("polling_error", err => console.log(err.data.error.message));

// Определение подменю
const submenus = {
    submenu_vpn: [
        [{ text: 'Опция 1', callback_data: 'vpn_option_1' }],
        [{ text: 'Опция 2', callback_data: 'vpn_option_2' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_account: [
        [{ text: 'Опция 1', callback_data: 'account_option_1' }],
        [{ text: 'Опция 2', callback_data: 'account_option_2' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_about: [
        [{ text: 'Опция 1', callback_data: 'about_option_1' }],
        [{ text: 'Опция 2', callback_data: 'about_option_2' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_faq: [
        [{ text: 'Опция 1', callback_data: 'faq_option_1' }],
        [{ text: 'Опция 2', callback_data: 'faq_option_2' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_support: [
        [{ text: 'Опция 1', callback_data: 'support_option_1' }],
        [{ text: 'Опция 2', callback_data: 'support_option_2' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_partnership: [
        [{ text: 'Опция 1', callback_data: 'partnership_option_1' }],
        [{ text: 'Опция Тест', callback_data: 'partnership_option_2' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_channel: [
        [{ text: '🔙 Назад', callback_data: 'hide_message' }]
    ],
};

bot.on('text', async msg => {
    try {
        const mainMenu = [
            [{ text: '🛡️ VPN', callback_data: 'submenu_vpn' }],
            [{ text: '⚙️ Аккаунт', callback_data: 'submenu_account' }],
            [{ text: '👥 О нас', callback_data: 'submenu_about' }],
            [{ text: 'ℹ️ FAQ', callback_data: 'submenu_faq' }],
            [{ text: '🔔 Поддержка', callback_data: 'submenu_support' }],
            [{ text: '💲 Партнерка', callback_data: 'submenu_partnership' }, { text: '🎙️ Наш канал', callback_data: 'submenu_channel' }],
        ];

        if (msg.text === '/start') {
            if (msg.text.length > 6) {
                const refID = msg.text.slice(7);
                await bot.sendMessage(msg.chat.id, `Вы зашли по ссылке пользователя с ID ${refID}`);
            }
            await bot.sendPhoto(msg.chat.id, './Images/vpn.jpg', {
                caption: "",
                reply_markup: {
                    inline_keyboard: mainMenu
                }
            });
        } else if (msg.text === '/ref') {
            await bot.sendMessage(msg.chat.id, `${LINK}?start=${msg.from.id}`);
        } else {
            await bot.sendMessage(msg.chat.id, 'Напишите /start');
        }
    } catch (error) {
        console.log(error);
    }
});

// Обработчик callback-запросов
bot.on('callback_query', async query => {
    try {
        const { data } = query;

        if (data === 'back_to_main_menu') {
            // Обработка callback-запроса кнопки "Назад" для возврата в основное меню
            const mainMenu = [
                [{ text: '🛡️ VPN', callback_data: 'submenu_vpn' }],
                [{ text: '⚙️ Аккаунт', callback_data: 'submenu_account' }],
                [{ text: '👥 О нас', callback_data: 'submenu_about' }],
                [{ text: 'ℹ️ FAQ', callback_data: 'submenu_faq' }],
                [{ text: '🔔 Поддержка', callback_data: 'submenu_support' }],
                [{ text: '💲 Партнерка', callback_data: 'submenu_partnership' }, { text: '🎙️ Наш канал', callback_data: 'submenu_channel' }],
            ];

            await bot.editMessageReplyMarkup({ inline_keyboard: mainMenu }, {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
            });
        } else if (data === 'submenu_channel') {
            // Обработка callback-запроса кнопки
            const channelText = "Присоединяйтесь к нашему каналу: [InvisibleVPN | Кибербезопасность💻](t.me/invisibleVPNService)";
            await bot.sendMessage(query.message.chat.id, channelText, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Назад', callback_data: 'hide_message' }]
                    ]
                }
            });
        } else if (data === 'hide_message') {
            // Обработка callback-запроса кнопки "Убрать"
            await bot.deleteMessage(query.message.chat.id, query.message.message_id);
        } else {
            // Обработка других callback-запросов для подменю
            const submenu = submenus[data];
            if (submenu) {
                await bot.editMessageReplyMarkup({ inline_keyboard: submenu }, {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id,
                });
            }  else {
                // Обработка конкретных действий для каждой кнопки
                switch (data) {
                    case 'vpn_option_1':
                        break;
                    case 'vpn_option_2':
                        break;
                    case 'account_option_1':
                        break;
                    case 'account_option_2':
                        break;
                    case 'about_option_1':
                        break;
                    case 'about_option_2':
                        break;
                    case 'faq_option_1':
                        break;
                    case 'faq_option_2':
                        break;
                    case 'support_option_1':
                        break;
                    case 'support_option_2':
                        break;
                    case 'partnership_option_1':
                        break;
                    case 'partnership_option_2':
                        break;
                    default:
                        console.log(`Unhandled callback data: ${data}`);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});



