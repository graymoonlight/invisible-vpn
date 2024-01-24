const axios = require('axios');

const SERVER_URL = 'http://74.119.192.138:5555';

async function sendDataToServer(userId, photoUrl) {
    try {
        const response = await axios.post(`${SERVER_URL}/api/users/registration`, {
            id: userId,
            photo: photoUrl,
        });

        console.log('Успешно:', response.data);
    } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error.message);
    }
}

async function getDataFromServer(chatId) { 
    try {
        const response = await axios.get(`${SERVER_URL}/api/users/user-info/${chatId}`); 
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных с сервера:', error.message);
        if (error.response) {
            console.error('Данные ответа:', error.response.data);
            console.error('Статус код:', error.response.status);
            console.error('Заголовки ответа:', error.response.headers);
        }
        throw error;
    }
}

module.exports = {
    sendDataToServer,
    getDataFromServer,
};

