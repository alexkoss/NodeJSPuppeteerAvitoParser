const fs = require('fs');
const puppeteer = require('puppeteer');
const moment = require('moment');

let link = 'https://www.avito.ru/sankt-peterburg/avtomobili/toyota/caldina';

async function parseAvito() {
    try {
        let browser = await puppeteer.launch({ headless: false, devtools: true });
        let page = await browser.newPage();
        await page.setViewport({
            width: 1400,
            height: 900
        });

        await page.goto(link, { waitUntil: 'domcontentloaded' });

        let html = await page.evaluate(async () => {
            let res = [];
            let container = await document.querySelectorAll('div.iva-item-content-m2FiN');
            console.log(container);

            container.forEach(item => {
                let title = item.querySelector('div.iva-item-titleStep-2bjuh').innerText;
                let description;
                try {
                    description = item.querySelector('div.iva-item-text-2xkfp').innerText;
                } catch (e) {
                    description = null;
                }
                let url = item.querySelector('a.link-link-39EVK').href
                let price = item.querySelector('span.price-text-1HrJ_').innerText

                //Парсинг цены 25 000 ₽ --> 25000
                price = Number(price.split('').filter(item => parseInt(item) == item).join(""));

                res.push({
                    title,
                    description,
                    url,
                    price,
                })
            });
            return res;
        });

        for (let i = 0; i < html.length - 1; i++) {
            await page.goto(html[i].url, { waitUntil: 'domcontentloaded' });

            await page.waitForSelector('div.item-view-content').catch(e => console.log(e));
            console.log(i);
            let author = await page.evaluate(async () => {
                let author
                try {
                    author = document.querySelector('div.seller-info-name a').innerText;
                } catch (e) {
                    author = null;
                }
                return author;
            });

            let date = await page.evaluate(async () => {
                let date
                try {
                    date = document.querySelector('div.title-info-metadata-item-redesign').innerText;
                } catch (e) {
                    date = null;
                }
                return date;
            });


            let phone
            try {
                // let button = await page.$('button.styles-item-phone-button_height-3SOiy.button-button-2Fo5k.button-size-l-3LVJf.button-success-1Tf-u.width-width-12-2VZLz')
                // await button.click();
                // await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Mobile Safari/537.36')
                // await page.waitForSelector('input[name="login"]');
                // await page.focus('input[name="login"]');
                // await page.keyboard.type('+79817411461');

                // await page.focus('input[name="password"]');
                // await page.keyboard.type('9qfx3,R8/nrdQtM');
                // button = await page.$('button.button-button-2Fo5k.button-size-m-7jtw4.button-primary-1RhOG.width-width-12-2VZLz');
                // await button.click();
                // await new Promise(r => setTimeout(r, 5000));


                phone = await page.evaluate(async () => {
                    let phone
                    try {
                        phone = document.querySelector('div.contacts-phone-3KtSI').src
                    } catch (e) {
                        phone = 'Без звонков'
                    }
                })

            } catch (e) {
                phone = 'Без звонков';
            }


            html[i]['author'] = author;
            html[i]['date'] = dateParse(date);
            html[i]['phone'] = phone;
        }

        fs.writeFile("avitoAds.json", JSON.stringify(html), function (err) {
            if (err) throw err
            console.log('Succes!')
        });

    } catch (e) {
        console.log(e)
    }
}

function dateParse(dateOfAd) {
    dateOfAd = dateOfAd.split(' ');

    let dayAd, monthAd, yearAd, hoursAd, minutesAd;

    let nowdate = new Date();
    const CurrentDay = nowdate.getDate();
    const CurrentMonth = nowdate.getMonth();
    const CurrentYear = nowdate.getFullYear();
    let Yesterday, YesterMonth = CurrentMonth + 1, YesterYear = CurrentYear;

    if (CurrentDay === 1) {
        switch (CurrentMonth) {
            case 1:
                Yesterday = 31;
                YesterMonth = 12;
                YesterYear = CurrentYear - 1;
                break;
            case 2:
                Yesterday = 31;
                YesterMonth = CurrentMonth - 1;
                break;
            case 3:
                if (CurrentYear % 4) { Yesterday = 29 }
                Yesterday = 28;
                YesterMonth = CurrentMonth - 1;
                break;
            case 4:
                Yesterday = 31;
                YesterMonth = CurrentMonth - 1;
                break;
            case 5:
                Yesterday = 30;
                YesterMonth = CurrentMonth - 1;
                break;
            case 6:
                Yesterday = 31;
                YesterMonth = CurrentMonth - 1;
                break;
            case 7:
                Yesterday = 30;
                YesterMonth = CurrentMonth - 1;
                break;
            case 8:
                Yesterday = 31;
                YesterMonth = CurrentMonth - 1;
                break;
            case 9:
                Yesterday = 31;
                YesterMonth = CurrentMonth - 1;
                break;
            case 10:
                Yesterday = 30;
                YesterMonth = CurrentMonth - 1;
                break;
            case 11:
                Yesterday = 31;
                YesterMonth = CurrentMonth - 1;
                break;
            case 12:
                Yesterday = 30;
                YesterMonth = CurrentMonth - 1;
                break;

            default:
                console.log("error");

        }
    } else {
        Yesterday = CurrentDay - 1;
    }

    switch (dateOfAd[0]) {
        case "Сегодня":
            dayAd = CurrentDay;
            monthAd = CurrentMonth + 1;
            yearAd = CurrentYear;
            break;
        case "Вчера":
            dayAd = Yesterday;
            monthAd = YesterMonth;
            yearAd = YesterYear;
            break;
        default:
            dayAd = dateOfAd[0];
            yearAd = CurrentYear;
            switch (dateOfAd[1]) {
                case "января":
                    monthAd = 1;
                    break;
                case "февраля":
                    monthAd = 2;
                    break;
                case "марта":
                    monthAd = 3;
                    break;
                case "апреля":
                    monthAd = 4;
                    break;
                case "мая":
                    monthAd = 5;
                    break;
                case "июня":
                    monthAd = 6;
                    break;
                case "июля":
                    monthAd = 7;
                    break;
                case "августа":
                    monthAd = 8;
                    break;
                case "сентября":
                    monthAd = 9;
                    break;
                case "октября":
                    monthAd = 10;
                    break;
                case "ноября":
                    monthAd = 11;
                    break;
                case "декабря":
                    monthAd = 12;
                    break;
                default:
                    console.log('error')
            }
    }

    hoursAd = dateOfAd[dateOfAd.length - 1].split(':')[0]
    minutesAd = dateOfAd[dateOfAd.length - 1].split(':')[1]

    let dateAd = new Date(Date.UTC(yearAd.toString(), monthAd.toString() - 1, dayAd.toString(), hoursAd, minutesAd, "00"));
    return dateAd.toISOString();
}

parseAvito();

