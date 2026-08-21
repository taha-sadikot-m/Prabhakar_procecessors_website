import { Resend } from 'resend'

export type SendMailInput = {
  to: string | string[]
  cc?: string | string[]
  subject: string
  text: string
  replyTo?: string
}

function parseList(value: string | undefined, fallback: string[]): string[] {
  if (!value?.trim()) return fallback
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Primary contact inbox (To). */
export function contactNotifyTo(): string[] {
  return parseList(process.env.CONTACT_NOTIFY_TO, [
    'shaleen@prabhakarprocessors.com',
  ])
}

/** Secondary contact inbox (Cc). */
export function contactNotifyCc(): string[] {
  return parseList(process.env.CONTACT_NOTIFY_CC, [
    'info@prabhakarprocessors.com',
  ])
}

export function careersNotifyTo(): string[] {
  return parseList(process.env.CAREERS_NOTIFY_TO, [
    'prabhakarhr64@gmail.com',
  ])
}

/**
 * Send via Resend. Throws if API key / from address missing or Resend errors.
 * Callers that must not fail the HTTP request should catch and log.
 */
export async function sendMail(input: SendMailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_EMAIL_ADDRESS?.trim()

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }
  if (!from) {
    throw new Error('RESEND_EMAIL_ADDRESS is not set')
  }

  const to = Array.isArray(input.to) ? input.to : [input.to]
  if (to.length === 0) {
    throw new Error('No email recipients')
  }

  const ccRaw = input.cc
    ? Array.isArray(input.cc)
      ? input.cc
      : [input.cc]
    : []
  const cc = ccRaw.filter(Boolean)

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    subject: input.subject,
    text: input.text,
    ...(cc.length > 0 ? { cc } : {}),
    ...(input.replyTo ? { replyTo: input.replyTo } : {}),
  })

  if (error) {
    throw new Error(error.message || 'Resend send failed')
  }
}

/** Best-effort notify: logs and never throws. */
export async function notifyOrLog(
  label: string,
  input: SendMailInput,
): Promise<void> {
  try {
    await sendMail(input)
  } catch (err) {
    console.error(
      `[email] ${label} failed:`,
      err instanceof Error ? err.message : err,
    )
  }
}
