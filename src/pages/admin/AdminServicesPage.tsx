import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminDeleteCard,
  adminDeleteCategory,
  adminGetServices,
  adminSaveCard,
  adminSaveCategory,
  adminUploadImage,
} from '../../lib/cms-api'
import {
  AdminActions,
  AdminButton,
  AdminEmpty,
  AdminError,
  AdminField,
  AdminList,
  AdminListItem,
  AdminLoading,
  AdminMasterItem,
  AdminModal,
  AdminPageHeader,
  AdminPanel,
  AdminSplit,
  AdminTextArea,
} from './admin-ui'
import { AdminMediaPreview } from './AdminMediaPreview'

type Card = {
  id: string
  categoryId: string
  name: string
  description: string
  imageUrl: string
  sortOrder: number
}

type Category = {
  id: string
  title: string
  numeral: string
  intro: string
  sortOrder: number
  services: Card[]
}

const emptyCategory = {
  title: '',
  numeral: '',
  intro: '',
  sortOrder: 0,
}

const emptyCard = {
  name: '',
  description: '',
  imageUrl: '',
  sortOrder: 0,
}

type Modal =
  | { type: 'none' }
  | { type: 'addCategory' }
  | { type: 'editCategory' }
  | { type: 'addCard' }
  | { type: 'editCard'; cardId: string }

export function AdminServicesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modal, setModal] = useState<Modal>({ type: 'none' })
  const [catForm, setCatForm] = useState(emptyCategory)
  const [cardForm, setCardForm] = useState(emptyCard)
  const [uploading, setUploading] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminGetServices()
      setCategories(data.categories)
      setSelectedId((prev) => {
        if (prev && data.categories.some((c) => c.id === prev)) return prev
        return data.categories[0]?.id ?? null
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
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
      setError(
        err instanceof Error
          ? err.message
          : 'Request failed. Check you are logged in and Hostinger DATABASE_URL / JWT_SECRET match production.',
      )
    } finally {
      setBusy(false)
    }
  }

  const selected = useMemo(
    () => categories.find((c) => c.id === selectedId) ?? null,
    [categories, selectedId],
  )

  const cardCount = categories.reduce((n, c) => n + c.services.length, 0)
  const closeModal = useCallback(() => setModal({ type: 'none' }), [])

  return (
    <div>
      <AdminPageHeader
        title="Services"
        meta={`${categories.length} categories · ${cardCount} cards`}
        busy={busy}
        actions={
          <AdminButton
            variant="primary"
            onClick={() => {
              setCatForm(emptyCategory)
              setModal({ type: 'addCategory' })
            }}
          >
            Add category
          </AdminButton>
        }
      >
        Pick a category on the left, then manage its details and service cards
        on the right.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {loading ? (
        <AdminLoading label="Loading services…" />
      ) : (
      <AdminSplit
        masterLabel="Categories"
        master={
          <div>
            <div className="hidden border-b border-ink/10 bg-cream-dark/30 px-4 py-3 md:block">
              <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-ink-muted uppercase">
                Categories
              </p>
            </div>
            {categories.length === 0 ? (
              <p className="px-4 py-6 font-sans text-sm text-ink-muted">
                No categories yet.
              </p>
            ) : (
              <div className="flex gap-1 overflow-x-auto p-2 md:block md:overflow-visible md:p-0 md:py-1">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="min-w-[9.5rem] shrink-0 md:min-w-0 md:shrink"
                  >
                    <AdminMasterItem
                      title={
                        <>
                          {cat.numeral && (
                            <span className="text-mahogany">{cat.numeral} </span>
                          )}
                          {cat.title}
                        </>
                      }
                      meta={`${cat.services.length} cards`}
                      active={selectedId === cat.id}
                      onClick={() => setSelectedId(cat.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        }
        detail={
          !selected ? (
            <AdminEmpty>
              Select a category on the left, or add a new one.
            </AdminEmpty>
          ) : (
            <div className="space-y-5">
              <AdminPanel>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-mahogany uppercase">
                      Category
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-medium text-ink">
                      {selected.numeral && (
                        <span className="mr-2 text-mahogany">
                          {selected.numeral}
                        </span>
                      )}
                      {selected.title}
                    </h2>
                    {selected.intro && (
                      <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted">
                        {selected.intro}
                      </p>
                    )}
                  </div>
                  <AdminActions>
                    <AdminButton
                      variant="secondary"
                      onClick={() => {
                        setCatForm({
                          title: selected.title,
                          numeral: selected.numeral,
                          intro: selected.intro,
                          sortOrder: selected.sortOrder,
                        })
                        setModal({ type: 'editCategory' })
                      }}
                    >
                      Edit category
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={busy}
                      onClick={() => {
                        if (
                          !confirm(
                            `Delete category “${selected.title}” and all its cards?`,
                          )
                        )
                          return
                        void run(async () => {
                          await adminDeleteCategory(selected.id)
                          setSelectedId(null)
                        })
                      }}
                    >
                      Delete
                    </AdminButton>
                  </AdminActions>
                </div>
              </AdminPanel>

              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-sans text-[11px] font-semibold tracking-[0.14em] text-ink uppercase">
                    Service cards
                    <span className="ml-2 font-medium text-ink-muted normal-case tracking-normal">
                      ({selected.services.length})
                    </span>
                  </h3>
                  <AdminButton
                    variant="secondary"
                    onClick={() => {
                      setCardForm(emptyCard)
                      setModal({ type: 'addCard' })
                    }}
                  >
                    Add card
                  </AdminButton>
                </div>

                {selected.services.length === 0 ? (
                  <AdminEmpty>
                    No cards in this category yet. Add one to show on
                    /services.
                  </AdminEmpty>
                ) : (
                  <AdminList>
                    {selected.services.map((card) => (
                      <AdminListItem key={card.id}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
                            {card.imageUrl.trim() && (
                              <AdminMediaPreview
                                kind="auto"
                                src={card.imageUrl}
                                alt={card.name}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-sans text-base font-semibold text-ink">
                                {card.name}
                              </p>
                              <p className="mt-1 line-clamp-2 font-sans text-sm leading-relaxed text-ink-muted">
                                {card.description}
                              </p>
                            </div>
                          </div>
                          <AdminActions>
                            <AdminButton
                              variant="secondary"
                              onClick={() => {
                                setCardForm({
                                  name: card.name,
                                  description: card.description,
                                  imageUrl: card.imageUrl,
                                  sortOrder: card.sortOrder,
                                })
                                setModal({
                                  type: 'editCard',
                                  cardId: card.id,
                                })
                              }}
                            >
                              Edit
                            </AdminButton>
                            <AdminButton
                              variant="danger"
                              disabled={busy}
                              onClick={() => {
                                if (!confirm(`Delete “${card.name}”?`)) return
                                void run(() => adminDeleteCard(card.id))
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
              </div>
            </div>
          )
        }
      />
      )}

      <AdminModal
        open={modal.type === 'addCategory' || modal.type === 'editCategory'}
        onClose={closeModal}
        title={modal.type === 'editCategory' ? 'Edit category' : 'Add category'}
        wide
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField
            label="Title"
            value={catForm.title}
            onChange={(v) => setCatForm((s) => ({ ...s, title: v }))}
          />
          <AdminField
            label="Numeral"
            value={catForm.numeral}
            onChange={(v) => setCatForm((s) => ({ ...s, numeral: v }))}
            placeholder="I, II, III…"
          />
          <AdminTextArea
            label="Intro"
            value={catForm.intro}
            onChange={(v) => setCatForm((s) => ({ ...s, intro: v }))}
            className="md:col-span-2"
          />
          <AdminField
            label="Sort order"
            type="number"
            value={String(catForm.sortOrder)}
            onChange={(v) =>
              setCatForm((s) => ({ ...s, sortOrder: Number(v) || 0 }))
            }
          />
        </div>
        <AdminActions>
          <AdminButton
            className="mt-5"
            disabled={busy || !catForm.title.trim()}
            onClick={() =>
              run(async () => {
                if (modal.type === 'editCategory' && selected) {
                  await adminSaveCategory('PUT', {
                    id: selected.id,
                    ...catForm,
                  })
                } else {
                  const res = await adminSaveCategory('POST', catForm)
                  if (res.id) setSelectedId(res.id)
                }
              })
            }
          >
            {modal.type === 'editCategory' ? 'Save changes' : 'Save category'}
          </AdminButton>
          <AdminButton className="mt-5" variant="ghost" onClick={closeModal}>
            Cancel
          </AdminButton>
        </AdminActions>
      </AdminModal>

      <AdminModal
        open={modal.type === 'addCard' || modal.type === 'editCard'}
        onClose={closeModal}
        title={modal.type === 'editCard' ? 'Edit card' : 'Add card'}
        wide
      >
        <div className="grid gap-4 md:grid-cols-2">
          {cardForm.imageUrl.trim() && (
            <AdminMediaPreview
              kind="auto"
              src={cardForm.imageUrl}
              alt={cardForm.name || 'Service card'}
              className="md:col-span-2"
            />
          )}
          <AdminField
            label="Name"
            value={cardForm.name}
            onChange={(v) => setCardForm((s) => ({ ...s, name: v }))}
          />
          <AdminField
            label="Image URL"
            value={cardForm.imageUrl}
            onChange={(v) => setCardForm((s) => ({ ...s, imageUrl: v }))}
            mono
          />
          <label className="block md:col-span-2">
            <span className="mb-1.5 block font-sans text-[10px] font-semibold tracking-[0.14em] text-ink-muted uppercase">
              Upload image (WebP)
            </span>
            <input
              type="file"
              accept="image/*"
              disabled={busy || uploading}
              className="block w-full font-sans text-sm text-ink file:mr-3 file:rounded-sm file:border-0 file:bg-mahogany file:px-3 file:py-1.5 file:font-sans file:text-xs file:font-semibold file:tracking-wide file:text-cream file:uppercase"
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ''
                if (!file) return
                void (async () => {
                  setUploading(true)
                  setError(null)
                  try {
                    const stem =
                      modal.type === 'editCard' ? modal.cardId : undefined
                    const { url } = await adminUploadImage(file, stem)
                    setCardForm((s) => ({ ...s, imageUrl: url }))
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : 'Upload failed',
                    )
                  } finally {
                    setUploading(false)
                  }
                })()
              }}
            />
            {uploading && (
              <p className="mt-1.5 font-sans text-xs text-ink-muted">
                Converting to WebP…
              </p>
            )}
          </label>
          <AdminTextArea
            label="Description"
            value={cardForm.description}
            onChange={(v) => setCardForm((s) => ({ ...s, description: v }))}
            className="md:col-span-2"
          />
          {modal.type === 'editCard' && (
            <AdminField
              label="Sort order"
              type="number"
              value={String(cardForm.sortOrder)}
              onChange={(v) =>
                setCardForm((s) => ({ ...s, sortOrder: Number(v) || 0 }))
              }
            />
          )}
        </div>
        <AdminActions>
          <AdminButton
            className="mt-5"
            disabled={busy || uploading || !cardForm.name.trim() || !selected}
            onClick={() =>
              run(async () => {
                if (!selected) return
                if (modal.type === 'editCard') {
                  await adminSaveCard('PUT', {
                    id: modal.cardId,
                    categoryId: selected.id,
                    ...cardForm,
                  })
                } else {
                  await adminSaveCard('POST', {
                    categoryId: selected.id,
                    ...cardForm,
                    sortOrder: selected.services.length,
                  })
                }
              })
            }
          >
            {modal.type === 'editCard' ? 'Save changes' : 'Save card'}
          </AdminButton>
          <AdminButton className="mt-5" variant="ghost" onClick={closeModal}>
            Cancel
          </AdminButton>
        </AdminActions>
      </AdminModal>
    </div>
  )
}
