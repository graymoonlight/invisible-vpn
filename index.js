const TOKEN = '6927915937:AAExzAajoAxCbUjLr1ArfhTL9NCJQSveZJs';
const LINK = 'https://t.me/invisible_vpn_bot';

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true
    }
});

// Добавляем объявление объекта для хранения логов
const userLogs = {};

// Добавляем функцию для добавления события в лог пользователя
function addUserLog(chatId, event) {
    if (!userLogs[chatId]) {
        userLogs[chatId] = [];
    }
    userLogs[chatId].push(event);
}

async function logUserAction(query) {
    try {
        const { data, message } = query;
        const chatId = message.chat.id;
        addUserLog(chatId, { type: 'callback_query', data });
    } catch (error) {
        console.log(error);
    }
}

// Обработчик callback-запросов
bot.on('callback_query', async query => {
    await logUserAction(query);
});

async function logTextMessage(msg) {
    try {
        const { chat, text } = msg;
        const chatId = chat.id;
        addUserLog(chatId, { type: 'text_message', text });
    } catch (error) {
        console.log(error);
    }
}

// Обработчик текстовых сообщений
bot.on('text', async msg => {
    await logTextMessage(msg);
});

// Определение подменю для кнопки "Купить VPN"
const submenu_buy_vpn = [
    [{ text: '🇯🇵 Япония', callback_data: 'buy_vpn_japan' }],
    [{ text: '🇩🇪 Германия', callback_data: 'buy_vpn_germany' }],
    [{ text: '🇺🇸 США', callback_data: 'buy_vpn_usa' }],
    [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
];

// Установка подменю в объект submenus
const submenus = {
    submenu_vpn: [
        [{ text: '💸 Купить VPN', callback_data: 'buy_vpn' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_account: [
        [{ text: '👁️ Мой VPN', callback_data: 'my_vpn' }],
        [{ text: '💰 Кошелек', callback_data: 'wallet' }],
        [{ text: '% Скидки', callback_data: 'discount' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_about: [
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_faq: [
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_support: [
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_partnership: [
        [{ text: '🗣️ Моя партнерка', callback_data: 'my_partnership' }],
        [{ text: '🤝 Условия', callback_data: 'conditions' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_channel: [
        [{ text: '🔙 Назад', callback_data: 'hide_message' }]
    ],
};

// Обработчик callback-запросов
bot.on('callback_query', async query => {
    try {
        const { data, message } = query;
        const chatId = message.chat.id;

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
        } else if (data === 'buy_vpn') {
            // Обработка callback-запроса кнопки "Купить VPN"
            const submenu = submenu_buy_vpn;
            if (submenu) {
                await bot.editMessageReplyMarkup({ inline_keyboard: submenu }, {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id,
                });
            }
        } else if (data.startsWith('buy_vpn')) {
            // Обработка callback-запроса кнопки "Купить VPN - страна"
            // Извлечение кода страны из callback-данных
            const country = data.replace('buy_vpn_', '');
            addUserLog(chatId, { type: 'buy_vpn', country });
            // Действия при выборе "Купить VPN - Страна"
            console.log(`Пользователь ${chatId} выбрал купить VPN в стране: ${country}`);
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
                console.log(`Unhandled callback data: ${data}`);
            }
        }
    } catch (error) {
        console.log(error);
    }
});

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
