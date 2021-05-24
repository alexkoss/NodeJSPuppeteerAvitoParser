const fs = require('fs');
const puppeteer = require('puppeteer');
const ParseDate = require('./ParseDate');


let link = 'https://www.avito.ru/sankt-peterburg/avtomobili/toyota/caldina';

async function parseAvito() {
    try {
        let browser = await puppeteer.launch({ headless: true, devtools: true });
        let page = await browser.newPage();

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

        for (let i = 0; i < html.length; i++) {
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
            html[i]['date'] = ParseDate(date);
            html[i]['phone'] = phone;
        }

        fs.writeFile("avitoAds.json", JSON.stringify(html), function (err) {
            if (err) throw err
            console.log('Succes!')
        });

        browser.close();

    } catch (e) {
        console.log(e)
    }
}

parseAvito();