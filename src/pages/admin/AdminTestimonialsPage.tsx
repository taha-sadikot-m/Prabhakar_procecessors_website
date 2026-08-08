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
  AdminList,
  AdminListItem,
  AdminModal,
  AdminPageHeader,
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

type Modal =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; id: string }

export function AdminTestimonialsPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [modal, setModal] = useState<Modal>({ type: 'none' })
  const [form, setForm] = useState(empty)

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
      setModal({ type: 'none' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setBusy(false)
    }
  }

  const closeModal = useCallback(() => setModal({ type: 'none' }), [])

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        meta={`${quotes.length} quotes`}
        busy={busy}
        actions={
          <AdminButton
            variant="primary"
            onClick={() => {
              setForm(empty)
              setModal({ type: 'add' })
            }}
          >
            Add quote
          </AdminButton>
        }
      >
        Partner quotes shown on /testimonials — partner type, years, and quote.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {quotes.length === 0 ? (
        <AdminEmpty>No testimonials yet. Add one to begin.</AdminEmpty>
      ) : (
        <AdminList>
          {quotes.map((q) => (
            <AdminListItem key={q.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-xs font-semibold tracking-[0.1em] text-mahogany uppercase">
                    {q.type} · {q.years} years
                  </p>
                  <p className="mt-2 font-serif text-lg leading-snug text-ink italic md:text-xl">
                    “{q.quote}”
                  </p>
                </div>
                <AdminActions>
                  <AdminButton
                    variant="secondary"
                    onClick={() => {
                      setForm({
                        type: q.type,
                        years: q.years,
                        quote: q.quote,
                        sortOrder: q.sortOrder,
                      })
                      setModal({ type: 'edit', id: q.id })
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
            </AdminListItem>
          ))}
        </AdminList>
      )}

      <AdminModal
        open={modal.type === 'add' || modal.type === 'edit'}
        onClose={closeModal}
        title={modal.type === 'edit' ? 'Edit quote' : 'Add quote'}
        wide
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField
            label="Partner type"
            value={form.type}
            onChange={(v) => setForm((s) => ({ ...s, type: v }))}
            placeholder="Exporter, Brand…"
          />
          <AdminField
            label="Years"
            type="number"
            value={String(form.years)}
            onChange={(v) =>
              setForm((s) => ({ ...s, years: Number(v) || 0 }))
            }
          />
          <AdminTextArea
            label="Quote"
            value={form.quote}
            onChange={(v) => setForm((s) => ({ ...s, quote: v }))}
            className="md:col-span-2"
          />
          <AdminField
            label="Sort order"
            type="number"
            value={String(form.sortOrder)}
            onChange={(v) =>
              setForm((s) => ({ ...s, sortOrder: Number(v) || 0 }))
            }
          />
        </div>
        <AdminActions>
          <AdminButton
            className="mt-5"
            disabled={busy || !form.type.trim() || !form.quote.trim()}
            onClick={() =>
              run(async () => {
                if (modal.type === 'edit') {
                  await adminSaveTestimonial('PUT', {
                    id: modal.id,
                    ...form,
                  })
                } else {
                  await adminSaveTestimonial('POST', {
                    ...form,
                    sortOrder: form.sortOrder || quotes.length,
                  })
                }
              })
            }
          >
            {modal.type === 'edit' ? 'Save changes' : 'Save quote'}
          </AdminButton>
          <AdminButton className="mt-5" variant="ghost" onClick={closeModal}>
            Cancel
          </AdminButton>
        </AdminActions>
      </AdminModal>
    </div>
  )
}
