const puppeteer = require('puppeteer')
const en = require('./app_en.json')
const fs = require('fs')
const process = require('process')


const translate = async (lang) => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()

  translations = {}
  let progress = 0
  const total = Object.keys(en).length

  for (const [key, en_text] of Object.entries(en)) {
    
    await page.goto(`https://translate.google.com/?sl=en&tl=${lang}&text=${en_text}&op=translate`)
    let element;
    try{  
      element = await page.waitForSelector('span[jsname=\'W297wb\']')
    } catch  {
      element = await page.waitForSelector('span[jsname=\'jqKxS\']')
    }
    translations[key] = await element.evaluate(el => el.innerText)

    console.log("Translations: " + ++progress + "/" + total);
  }

  fs.writeFile(`app_${lang}.json`, JSON.stringify(translations), (err) => {
    console.error(err);
  })

  
  await browser.close()

}


translate(process.argv[2])

