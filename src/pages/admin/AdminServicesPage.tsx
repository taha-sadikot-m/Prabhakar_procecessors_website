import { useCallback, useEffect, useState } from 'react'
import {
  adminDeleteCard,
  adminDeleteCategory,
  adminGetServices,
  adminSaveCard,
  adminSaveCategory,
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

export function AdminServicesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [newCat, setNewCat] = useState(emptyCategory)
  const [editingCat, setEditingCat] = useState<string | null>(null)
  const [catDraft, setCatDraft] = useState(emptyCategory)
  const [newCard, setNewCard] = useState<Record<string, typeof emptyCard>>({})
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [cardDraft, setCardDraft] = useState(emptyCard)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminGetServices()
      setCategories(data.categories)
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
      <AdminPageHeader title="Services">
        Manage categories and service cards. Image URL can be a path under
        /public, an absolute image URL, or a Google Drive share link (file must
        be shared so it can be viewed).
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      <AdminPanel title="Add category" className="mb-10">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField
            label="Title"
            value={newCat.title}
            onChange={(v) => setNewCat((s) => ({ ...s, title: v }))}
          />
          <AdminField
            label="Numeral"
            value={newCat.numeral}
            onChange={(v) => setNewCat((s) => ({ ...s, numeral: v }))}
          />
          <AdminTextArea
            label="Intro"
            value={newCat.intro}
            onChange={(v) => setNewCat((s) => ({ ...s, intro: v }))}
            className="md:col-span-2"
          />
          <AdminField
            label="Sort order"
            type="number"
            value={String(newCat.sortOrder)}
            onChange={(v) =>
              setNewCat((s) => ({ ...s, sortOrder: Number(v) || 0 }))
            }
          />
        </div>
        <AdminButton
          className="mt-5"
          disabled={busy || !newCat.title.trim()}
          onClick={() =>
            run(async () => {
              await adminSaveCategory('POST', newCat)
              setNewCat(emptyCategory)
            })
          }
        >
          Add category
        </AdminButton>
      </AdminPanel>

      <div className="space-y-8">
        {categories.length === 0 && (
          <AdminEmpty>No service categories yet. Add one above.</AdminEmpty>
        )}

        {categories.map((cat) => (
          <AdminPanel key={cat.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl font-medium text-ink">
                  <span className="mr-2 text-mahogany">{cat.numeral}</span>
                  {cat.title}
                </p>
                <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted">
                  {cat.intro}
                </p>
              </div>
              <AdminActions>
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setEditingCat(cat.id)
                    setCatDraft({
                      title: cat.title,
                      numeral: cat.numeral,
                      intro: cat.intro,
                      sortOrder: cat.sortOrder,
                    })
                  }}
                >
                  Edit
                </AdminButton>
                <AdminButton
                  variant="danger"
                  disabled={busy}
                  onClick={() => {
                    if (
                      !confirm(
                        `Delete category “${cat.title}” and all its cards?`,
                      )
                    )
                      return
                    void run(() => adminDeleteCategory(cat.id))
                  }}
                >
                  Delete
                </AdminButton>
              </AdminActions>
            </div>

            {editingCat === cat.id && (
              <div className="mt-6 border-t border-mahogany/25 pt-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField
                    label="Title"
                    value={catDraft.title}
                    onChange={(v) => setCatDraft((s) => ({ ...s, title: v }))}
                  />
                  <AdminField
                    label="Numeral"
                    value={catDraft.numeral}
                    onChange={(v) =>
                      setCatDraft((s) => ({ ...s, numeral: v }))
                    }
                  />
                  <AdminTextArea
                    label="Intro"
                    value={catDraft.intro}
                    onChange={(v) => setCatDraft((s) => ({ ...s, intro: v }))}
                    className="md:col-span-2"
                  />
                  <AdminField
                    label="Sort order"
                    type="number"
                    value={String(catDraft.sortOrder)}
                    onChange={(v) =>
                      setCatDraft((s) => ({
                        ...s,
                        sortOrder: Number(v) || 0,
                      }))
                    }
                  />
                </div>
                <AdminActions>
                  <AdminButton
                    className="mt-4"
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        await adminSaveCategory('PUT', {
                          id: cat.id,
                          ...catDraft,
                        })
                        setEditingCat(null)
                      })
                    }
                  >
                    Save
                  </AdminButton>
                  <AdminButton
                    className="mt-4"
                    variant="ghost"
                    onClick={() => setEditingCat(null)}
                  >
                    Cancel
                  </AdminButton>
                </AdminActions>
              </div>
            )}

            <ul className="mt-6 list-none space-y-3 p-0">
              {cat.services.map((card) => (
                <AdminRow key={card.id}>
                  {editingCard === card.id ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {cardDraft.imageUrl.trim() && (
                        <AdminMediaPreview
                          kind="auto"
                          src={cardDraft.imageUrl}
                          alt={cardDraft.name || 'Service card'}
                          className="md:col-span-2"
                        />
                      )}
                      <AdminField
                        label="Name"
                        value={cardDraft.name}
                        onChange={(v) =>
                          setCardDraft((s) => ({ ...s, name: v }))
                        }
                      />
                      <AdminField
                        label="Image URL (path, absolute, or Drive link)"
                        value={cardDraft.imageUrl}
                        onChange={(v) =>
                          setCardDraft((s) => ({ ...s, imageUrl: v }))
                        }
                        mono
                      />
                      <AdminTextArea
                        label="Description"
                        value={cardDraft.description}
                        onChange={(v) =>
                          setCardDraft((s) => ({ ...s, description: v }))
                        }
                        className="md:col-span-2"
                      />
                      <AdminField
                        label="Sort order"
                        type="number"
                        value={String(cardDraft.sortOrder)}
                        onChange={(v) =>
                          setCardDraft((s) => ({
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
                              await adminSaveCard('PUT', {
                                id: card.id,
                                categoryId: cat.id,
                                ...cardDraft,
                              })
                              setEditingCard(null)
                            })
                          }
                        >
                          Save card
                        </AdminButton>
                        <AdminButton
                          variant="ghost"
                          onClick={() => setEditingCard(null)}
                        >
                          Cancel
                        </AdminButton>
                      </AdminActions>
                    </div>
                  ) : (
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
                          <p className="mt-1 font-sans text-sm leading-relaxed text-ink-muted">
                            {card.description}
                          </p>
                          <p className="mt-2 break-all font-mono text-xs text-ink">
                            {card.imageUrl}
                          </p>
                        </div>
                      </div>
                      <AdminActions>
                        <AdminButton
                          variant="secondary"
                          onClick={() => {
                            setEditingCard(card.id)
                            setCardDraft({
                              name: card.name,
                              description: card.description,
                              imageUrl: card.imageUrl,
                              sortOrder: card.sortOrder,
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
                  )}
                </AdminRow>
              ))}
            </ul>

            <div className="mt-6 border-t border-mahogany/25 pt-5">
              <h3 className="font-sans text-xs font-semibold tracking-[0.14em] text-ink uppercase">
                Add card
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {(newCard[cat.id]?.imageUrl ?? '').trim() && (
                  <AdminMediaPreview
                    kind="auto"
                    src={newCard[cat.id]!.imageUrl}
                    alt={newCard[cat.id]?.name || 'New service card'}
                    className="md:col-span-2"
                  />
                )}
                <AdminField
                  label="Name"
                  value={newCard[cat.id]?.name ?? ''}
                  onChange={(v) =>
                    setNewCard((s) => ({
                      ...s,
                      [cat.id]: { ...(s[cat.id] ?? emptyCard), name: v },
                    }))
                  }
                />
                <AdminField
                  label="Image URL (path, absolute, or Drive link)"
                  value={newCard[cat.id]?.imageUrl ?? ''}
                  onChange={(v) =>
                    setNewCard((s) => ({
                      ...s,
                      [cat.id]: { ...(s[cat.id] ?? emptyCard), imageUrl: v },
                    }))
                  }
                  mono
                />
                <AdminTextArea
                  label="Description"
                  value={newCard[cat.id]?.description ?? ''}
                  onChange={(v) =>
                    setNewCard((s) => ({
                      ...s,
                      [cat.id]: {
                        ...(s[cat.id] ?? emptyCard),
                        description: v,
                      },
                    }))
                  }
                  className="md:col-span-2"
                />
              </div>
              <AdminButton
                className="mt-4"
                disabled={busy || !(newCard[cat.id]?.name ?? '').trim()}
                onClick={() =>
                  run(async () => {
                    const draft = newCard[cat.id] ?? emptyCard
                    await adminSaveCard('POST', {
                      categoryId: cat.id,
                      ...draft,
                      sortOrder: cat.services.length,
                    })
                    setNewCard((s) => ({ ...s, [cat.id]: emptyCard }))
                  })
                }
              >
                Add card
              </AdminButton>
            </div>
          </AdminPanel>
        ))}
      </div>
    </div>
  )
}
