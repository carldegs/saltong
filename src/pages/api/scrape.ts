/* eslint-disable no-console */
import puppeteer from 'puppeteer';

import createApiHandler from '../../lib/api/create-api-handler';

// TODO: Integrate admin stuff to client

const ScrapeHandler = createApiHandler().get(async (_req, res) => {
  console.log('test');
  if (process.env.NODE_ENV !== 'development') {
    res.json({
      message: 'Not available on production.',
    });
    return;
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
    const [page] = await browser.pages();

    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

    let wordList: string[] = [];

    for (let i = 0; i < letters.length; i++) {
      let j = 1;

      while (j < 200) {
        const url = `https://tagalog.pinoydictionary.com/list/${letters[i]}/${
          j === 1 ? '' : `${j}/`
        }`;

        console.log(letters[i], j, url);
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
        });

        const words = await page.$$eval('h2 a', (links) =>
          links.map((el) => el.innerHTML)
        );

        if (!words.length) {
          break;
        }

        wordList = [...wordList, ...words];
        j++;
      }
    }

    wordList = wordList.filter(
      (word) => new RegExp('^[A-Za-z]+$').test(word) && word.length >= 4
    );

    console.log(`Found ${wordList.length} words`);

    res.json(wordList);
    await browser.close();
  } catch (err) {
    console.error(err);
  }
});

export default ScrapeHandler;
