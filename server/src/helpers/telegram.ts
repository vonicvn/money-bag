import { Fetch } from './fetch'

export class Telegram {
  static send(text: string) {
    if (process.env.NODE_ENV === 'test') return
    if (process.env.NODE_ENV === 'local') return console.log(`TELEGRAM:\n ${text}`)
    const TELEGRAM_BOT_TOKEN = '1374557162:AAFjoAg1U5skpXWAjJHS6jTgTLL8C2BL4F0'
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    // tslint:disable-next-line: variable-name
    const parse_mode = text.includes('<b>') ? 'html' : 'markdown'

    const CHAT_ID = -1001464837733
    const body = JSON.stringify({ chat_id: CHAT_ID, text, parse_mode })
    return Fetch.post(url, { body })
  }
}
