import { useCallback, useEffect, useState } from 'react'
import {
  adminDeleteTestimonial,
  adminGetTestimonials,
  adminSaveTestimonial,
} from '../../lib/cms-api'
import {
  AdminActions,
  AdminButton,
  AdminEmpty,
  AdminError,
  AdminField,
  AdminPageHeader,
  AdminPanel,
  AdminRow,
  AdminTextArea,
} from './admin-ui'

type Quote = {
  id: string
  type: string
  years: number
  quote: string
  sortOrder: number
}

const empty = { type: '', years: 0, quote: '', sortOrder: 0 }

export function AdminTestimonialsPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState(empty)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState(empty)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminGetTestimonials()
      setQuotes(data.quotes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function run(fn: () => Promise<unknown>) {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <AdminPageHeader title="Testimonials">
        Partner quotes shown on /testimonials. Partner type, years, and quote
        only.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      <AdminPanel title="Add quote" className="mb-10">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField
            label="Partner type"
            value={draft.type}
            onChange={(v) => setDraft((s) => ({ ...s, type: v }))}
          />
          <AdminField
            label="Years"
            type="number"
            value={String(draft.years)}
            onChange={(v) =>
              setDraft((s) => ({ ...s, years: Number(v) || 0 }))
            }
          />
          <AdminTextArea
            label="Quote"
            value={draft.quote}
            onChange={(v) => setDraft((s) => ({ ...s, quote: v }))}
            className="md:col-span-2"
          />
          <AdminField
            label="Sort order"
            type="number"
            value={String(draft.sortOrder)}
            onChange={(v) =>
              setDraft((s) => ({ ...s, sortOrder: Number(v) || 0 }))
            }
          />
        </div>
        <AdminButton
          className="mt-5"
          disabled={busy || !draft.type.trim() || !draft.quote.trim()}
          onClick={() =>
            run(async () => {
              await adminSaveTestimonial('POST', {
                ...draft,
                sortOrder: draft.sortOrder || quotes.length,
              })
              setDraft(empty)
            })
          }
        >
          Add quote
        </AdminButton>
      </AdminPanel>

      <ul className="list-none space-y-3 p-0">
        {quotes.length === 0 && (
          <AdminEmpty>No testimonials yet. Add one above.</AdminEmpty>
        )}

        {quotes.map((q) => (
          <AdminRow key={q.id}>
            {editingId === q.id ? (
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField
                  label="Partner type"
                  value={editDraft.type}
                  onChange={(v) => setEditDraft((s) => ({ ...s, type: v }))}
                />
                <AdminField
                  label="Years"
                  type="number"
                  value={String(editDraft.years)}
                  onChange={(v) =>
                    setEditDraft((s) => ({
                      ...s,
                      years: Number(v) || 0,
                    }))
                  }
                />
                <AdminTextArea
                  label="Quote"
                  value={editDraft.quote}
                  onChange={(v) =>
                    setEditDraft((s) => ({ ...s, quote: v }))
                  }
                  className="md:col-span-2"
                />
                <AdminField
                  label="Sort order"
                  type="number"
                  value={String(editDraft.sortOrder)}
                  onChange={(v) =>
                    setEditDraft((s) => ({
                      ...s,
                      sortOrder: Number(v) || 0,
                    }))
                  }
                />
                <AdminActions>
                  <AdminButton
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        await adminSaveTestimonial('PUT', {
                          id: q.id,
                          ...editDraft,
                        })
                        setEditingId(null)
                      })
                    }
                  >
                    Save
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </AdminButton>
                </AdminActions>
              </div>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-xl leading-snug text-ink italic md:text-2xl">
                    “{q.quote}”
                  </p>
                  <p className="mt-2 font-sans text-sm font-medium text-ink">
                    {q.type} · {q.years} years
                  </p>
                </div>
                <AdminActions>
                  <AdminButton
                    variant="secondary"
                    onClick={() => {
                      setEditingId(q.id)
                      setEditDraft({
                        type: q.type,
                        years: q.years,
                        quote: q.quote,
                        sortOrder: q.sortOrder,
                      })
                    }}
                  >
                    Edit
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    disabled={busy}
                    onClick={() => {
                      if (!confirm('Delete this quote?')) return
                      void run(() => adminDeleteTestimonial(q.id))
                    }}
                  >
                    Delete
                  </AdminButton>
                </AdminActions>
              </div>
            )}
          </AdminRow>
        ))}
      </ul>
    </div>
  )
}
