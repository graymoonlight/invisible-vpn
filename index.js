const ABOUT = require('./about');
const FAQ = require('./faq');
const COND = require('./conditions');
const TOKEN = '6927915937:AAETHApQLVboJ7seZ6sUymuZmlAvaGdSNSQ';
const LINK = 'https://t.me/invisible_vpn_bot';
const api = require('./api');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true
    }
});

const userLogs = {};
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
        console.error('Ошибка в функции logUserAction:', error.message);
    }
}

async function logTextMessage(msg) {
    try {
        const { chat, text } = msg;
        const chatId = chat.id;
        addUserLog(chatId, { type: 'text_message', text });

        const userId = msg.from.id;
        const userProfilePhotos = await bot.getUserProfilePhotos(userId, { limit: 1 });

        if (userProfilePhotos && userProfilePhotos.photos.length > 0) {
            const fileId = userProfilePhotos.photos[0][0].file_id;
            const file = await bot.getFile(fileId);
            const photoUrl = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;
            await api.sendDataToServer(userId, photoUrl);
        }
    } catch (error) {
        console.error('Ошибка в функции logTextMessage:', error.message);
    }
}
// Определение подменю для кнопки "Купить VPN"
const submenu_buy_vpn = [
    [{ text: '🇯🇵 Япония', callback_data: 'buy_vpn_japan' }],
    [{ text: '🇩🇪 Германия', callback_data: 'buy_vpn_germany' }],
    [{ text: '🇺🇸 США', callback_data: 'buy_vpn_usa' }],
    [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
];

const submenus = {
    submenu_vpn: [
        [{ text: '💸 Купить VPN', callback_data: 'buy_vpn' }],
        [{ text: '🔙 Назад', callback_data: 'back_to_main_menu' }],
    ],
    submenu_account: [
        [{ text: '👁️ Мой VPN', callback_data: 'my_vpn' }],
        [{ text: '💰 Кошелек', callback_data: 'wallet' }],
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
    const countryMappings = {
        'Germany': 'Германия',
        'Japan': 'Япония',
    };
    
    const flagMappings = {
        'Germany': '🇩🇪',
        'Japan': '🇯🇵',
    };
    try {
        await logUserAction(query);
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
        } else if (data === 'submenu_about') {
            // Обработка callback-запроса кнопки
            const aboutText = `${ABOUT}`;
            await bot.sendMessage(query.message.chat.id, aboutText, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Назад', callback_data: 'hide_message' }]
                    ]
                }
            });
        } else if (data === 'submenu_faq') {
            // Обработка callback-запроса кнопки
            const faqText = `${FAQ}`;
            await bot.sendMessage(query.message.chat.id, faqText, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Назад', callback_data: 'hide_message' }]
                    ]
                }
            });
        } else if (data === 'submenu_support') {
            // Обработка callback-запроса кнопки "Поддержка"
            const supportText = "Вы можете обратиться за помощью, написав письмо по адресу: invisiblevpnservice@gmail.com";
            await bot.sendMessage(chatId, supportText, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Назад', callback_data: 'hide_message' }]
                    ]
                }
            });
        } else if (data === 'conditions') {
            // Обработка callback-запроса кнопки "Поддержка"
            const conditionsText = `${COND}`;
            await bot.sendMessage(chatId, conditionsText, {
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
        } else if (data === 'my_vpn') {
            // Обработка callback-запроса кнопки "Мой VPN"
            const serverResponse = await api.getDataFromServer(chatId);
        
            // Проверка на валидность формата даты
            const registrationDate = Date.parse(serverResponse.date_registaration);
            if (isNaN(registrationDate)) {
                console.error('Неверный формат даты регистрации:', serverResponse.date_registaration);
                return;
            }
        
            // Форматирование даты регистрации
            const formattedRegistrationDate = new Date(registrationDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        
            let vpnText = `⭐Ваш ID: ${serverResponse.user_id}\n⭐Дата регистрации: ${formattedRegistrationDate}\n`;
        
            // Проверка наличия покупок VPN
            if (Array.isArray(serverResponse.transactions) && serverResponse.transactions.length > 0) {
                vpnText += '⭐Ваши VPN соединения:\n\n';
        
                // Итерация по покупкам
                const emogi = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
                serverResponse.transactions.forEach((purchase, index) => {
                    const countryName = countryMappings[purchase.vpn_country] || purchase.vpn_country;
                    vpnText += `${emogi[index]}🪼 Страна: ${countryName} ${flagMappings[purchase.vpn_country] || ''}\n`;
                    vpnText += `       ⌚ Период: ${purchase.period} месяц${purchase.period > 1 ? 'а' : ''}\n`;
                    vpnText += `       ⌛ Дней осталось: ${purchase.days_remaining}\n\n`;
                });
            } else {
                vpnText += `❌${serverResponse.transactions}`;
            }
        
            await bot.sendMessage(chatId, vpnText, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔙 Назад', callback_data: 'hide_message' }]
                    ]
                }
            });
            console.log('Ответ сервера:', serverResponse);
        } else {
            // Обработка других callback-запросов для подменю
            const submenu = submenus[data];
            if (submenu) {
                await bot.editMessageReplyMarkup({ inline_keyboard: submenu }, {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id,
                });
            } else {
                console.log(`Unhandled callback data: ${data}`);
            }
        }
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
});

bot.on('text', async msg => {
    await logTextMessage(msg);
    const chatId = msg.chat.id;

    try {
        if (msg.text === '/start') {
            if (msg.text.length > 6) {
                const refID = msg.text.slice(7);
                await bot.sendMessage(msg.chat.id, `Вы зашли по ссылке пользователя с ID ${refID}`);
            }

            const mainMenu = [
                [{ text: '🛡️ VPN', callback_data: 'submenu_vpn' }],
                [{ text: '⚙️ Аккаунт', callback_data: 'submenu_account' }],
                [{ text: '👥 О нас', callback_data: 'submenu_about' }],
                [{ text: 'ℹ️ FAQ', callback_data: 'submenu_faq' }],
                [{ text: '🔔 Поддержка', callback_data: 'submenu_support' }],
                [{ text: '💲 Партнерка', callback_data: 'submenu_partnership' }, { text: '🎙️ Наш канал', callback_data: 'submenu_channel' }],
            ];

            await bot.sendPhoto(chatId, './Images/vpn.jpg', {
                caption: "",
                reply_markup: {
                    inline_keyboard: mainMenu
                }
            });
        } else if (msg.text === '/ref') {
            await bot.sendMessage(chatId, `${LINK}?start=${msg.from.id}`);
        } else {
            await bot.sendMessage(chatId, 'Напишите /start');
        }
    } catch (error) {
        console.error('Ошибка в функции logUserAction:', error.message);
    }
});
