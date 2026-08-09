import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminDeleteContactMessage,
  adminGetContactMessages,
  type ContactMessageDto,
} from '../../lib/cms-api'
import {
  AdminActions,
  AdminButton,
  AdminEmpty,
  AdminError,
  AdminList,
  AdminListItem,
  AdminLoading,
  AdminModal,
  AdminPageHeader,
} from './admin-ui'

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null
  return (
    <div>
      <p className="font-sans text-[10px] font-semibold tracking-[0.12em] text-ink-muted uppercase">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap font-sans text-sm text-ink">
        {value}
      </p>
    </div>
  )
}

export function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessageDto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminGetContactMessages()
      setMessages(data.messages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const selected = useMemo(
    () => messages.find((m) => m.id === selectedId) ?? null,
    [messages, selectedId],
  )

  return (
    <div>
      <AdminPageHeader
        title="Contact"
        meta={`${messages.length} messages`}
        busy={busy}
      >
        Messages submitted from the public contact form.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {loading ? (
        <AdminLoading label="Loading messages…" />
      ) : messages.length === 0 ? (
        <AdminEmpty>No contact messages yet.</AdminEmpty>
      ) : (
        <AdminList>
          {messages.map((msg) => (
            <AdminListItem key={msg.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-medium text-ink">
                    {msg.name}
                  </p>
                  <p className="mt-1 font-sans text-xs text-ink-muted">
                    {msg.subject} · {msg.email}
                    {msg.phone ? ` · ${msg.phone}` : ''}
                  </p>
                  <p className="mt-1 font-sans text-[11px] text-ink/45">
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
                <AdminActions>
                  <AdminButton
                    variant="secondary"
                    onClick={() => setSelectedId(msg.id)}
                  >
                    View
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    disabled={busy}
                    onClick={() => {
                      if (!confirm('Delete this message?')) return
                      setBusy(true)
                      setError(null)
                      void adminDeleteContactMessage(msg.id)
                        .then(() => load())
                        .catch((err) => {
                          setError(
                            err instanceof Error
                              ? err.message
                              : 'Delete failed',
                          )
                        })
                        .finally(() => setBusy(false))
                    }}
                  >
                    Delete
                  </AdminButton>
                </AdminActions>
              </div>
            </AdminListItem>
          ))}
        </AdminList>
      )}

      <AdminModal
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.subject : 'Message'}
        wide
      >
        {selected && (
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailRow label="Name" value={selected.name} />
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Phone" value={selected.phone} />
            <DetailRow
              label="Submitted"
              value={formatDate(selected.createdAt)}
            />
            <div className="sm:col-span-2">
              <DetailRow label="Subject" value={selected.subject} />
            </div>
            <div className="sm:col-span-2">
              <DetailRow label="Message" value={selected.message} />
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}
