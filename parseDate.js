const { ISO_8601 } = require('moment');
const moment = require('moment');

function ParseDate (DateAd) {
    DateAd = DateAd.split(' ');
    
    let monthsDict = {
        "января": "01",
        "февраля": "02",
        "марта": "03",
        "апреля": "04",
        "мая": "05", 
        "июня": "06",
        "июля": "07",
        "августа": "08",
        "сентября": "09",
        "октября": "09",
        "ноября": "11",
        "декабря": "12"
    }
    
    switch(DateAd[0]){
        case "Сегодня":
            return moment(DateAd[DateAd.length - 1], 'hh:mm').toISOString();
        case "Вчера":
            return moment(DateAd[DateAd.length - 1], 'hh:mm').subtract(1, 'day').toISOString();
        default:
            return moment(DateAd[0] + "-" + monthsDict[DateAd[1]] + "-" + DateAd[DateAd.length - 1], 'DD-MM-hh:mm').toISOString();
    }
}

module.exports = ParseDate;