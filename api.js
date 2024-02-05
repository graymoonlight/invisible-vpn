const axios = require('axios');

const SERVER_URL = 'http://74.119.192.138:5555';

async function sendDataToServer(userId, photoUrl) {
    try {
        const response = await axios.post(`${SERVER_URL}/api/users/registration`, {
            id: userId,
            photo: photoUrl,
        });
    } catch (error) {
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

async function getServers() { 
    try {
        const response = await axios.get(`${SERVER_URL}/api/servers/allservers`); 
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

async function sendTransaction(userId, vpnCountry, dealPrice, period) {
    try {

        const servers = await axios.get(`${SERVER_URL}/api/servers/allservers`);
        const selectedServer = servers.data.find(server => server.server_country === vpnCountry);

        if (!selectedServer) {
            throw new Error(`Сервер для страны ${vpnCountry} не найден.`);
        }

        const response = await axios.post(`${SERVER_URL}/api/transaction/createtransaction`, {
            user_id: userId,
            server_id: selectedServer.id,
            vpn_country: vpnCountry,
            deal_price: dealPrice,
            period: period,
        });
        console.log('Отправлено на сервер:', response.config.data);
        console.log('Успешно:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке данных на сервер:', error.message);
        throw error;
    }
}

async function getPrice() {
    try {
        const response = await axios.get(`${SERVER_URL}/api/price/allprice`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении цен и периодов:', error.message);
        throw error;
    }
}

module.exports = {
    sendDataToServer,
    getDataFromServer,
    getServers,
    sendTransaction,
    getPrice
};

