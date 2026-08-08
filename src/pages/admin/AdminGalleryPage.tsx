import { useCallback, useEffect, useState } from 'react'
import {
  adminDeleteGalleryItem,
  adminDeleteGallerySection,
  adminGetGallery,
  adminSaveGalleryItem,
  adminSaveGallerySection,
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

type Item = {
  id: string
  sectionId: string
  driveUrl: string
  description: string | null
  sortOrder: number
}

type Section = {
  id: string
  title: string
  body: string | null
  sortOrder: number
  items: Item[]
}

const emptySection = { title: '', body: '', sortOrder: 0 }
const emptyItem = { driveUrl: '', description: '', sortOrder: 0 }

export function AdminGalleryPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [newSection, setNewSection] = useState(emptySection)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [sectionDraft, setSectionDraft] = useState(emptySection)
  const [newItem, setNewItem] = useState<Record<string, typeof emptyItem>>({})
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [itemDraft, setItemDraft] = useState(emptyItem)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminGetGallery()
      setSections(data.sections)
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
      <AdminPageHeader title="Gallery">
        Paste Google Drive share links. Media type and aspect are detected on
        the public gallery at load time.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      <AdminPanel title="Add section" className="mb-10">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField
            label="Title"
            value={newSection.title}
            onChange={(v) => setNewSection((s) => ({ ...s, title: v }))}
          />
          <AdminField
            label="Sort order"
            type="number"
            value={String(newSection.sortOrder)}
            onChange={(v) =>
              setNewSection((s) => ({ ...s, sortOrder: Number(v) || 0 }))
            }
          />
          <AdminTextArea
            label="Body (optional)"
            value={newSection.body}
            onChange={(v) => setNewSection((s) => ({ ...s, body: v }))}
            className="md:col-span-2"
          />
        </div>
        <AdminButton
          className="mt-5"
          disabled={busy || !newSection.title.trim()}
          onClick={() =>
            run(async () => {
              await adminSaveGallerySection('POST', {
                title: newSection.title,
                body: newSection.body || null,
                sortOrder: newSection.sortOrder,
              })
              setNewSection(emptySection)
            })
          }
        >
          Add section
        </AdminButton>
      </AdminPanel>

      <div className="space-y-8">
        {sections.length === 0 && (
          <AdminEmpty>No gallery sections yet. Add one above.</AdminEmpty>
        )}

        {sections.map((section) => (
          <AdminPanel key={section.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl font-medium text-ink">
                  {section.title}
                </p>
                {section.body && (
                  <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted">
                    {section.body}
                  </p>
                )}
              </div>
              <AdminActions>
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setEditingSection(section.id)
                    setSectionDraft({
                      title: section.title,
                      body: section.body ?? '',
                      sortOrder: section.sortOrder,
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
                        `Delete section “${section.title}” and all items?`,
                      )
                    )
                      return
                    void run(() => adminDeleteGallerySection(section.id))
                  }}
                >
                  Delete
                </AdminButton>
              </AdminActions>
            </div>

            {editingSection === section.id && (
              <div className="mt-6 border-t border-mahogany/25 pt-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField
                    label="Title"
                    value={sectionDraft.title}
                    onChange={(v) =>
                      setSectionDraft((s) => ({ ...s, title: v }))
                    }
                  />
                  <AdminField
                    label="Sort order"
                    type="number"
                    value={String(sectionDraft.sortOrder)}
                    onChange={(v) =>
                      setSectionDraft((s) => ({
                        ...s,
                        sortOrder: Number(v) || 0,
                      }))
                    }
                  />
                  <AdminTextArea
                    label="Body"
                    value={sectionDraft.body}
                    onChange={(v) =>
                      setSectionDraft((s) => ({ ...s, body: v }))
                    }
                    className="md:col-span-2"
                  />
                </div>
                <AdminActions>
                  <AdminButton
                    className="mt-4"
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        await adminSaveGallerySection('PUT', {
                          id: section.id,
                          title: sectionDraft.title,
                          body: sectionDraft.body || null,
                          sortOrder: sectionDraft.sortOrder,
                        })
                        setEditingSection(null)
                      })
                    }
                  >
                    Save
                  </AdminButton>
                  <AdminButton
                    className="mt-4"
                    variant="ghost"
                    onClick={() => setEditingSection(null)}
                  >
                    Cancel
                  </AdminButton>
                </AdminActions>
              </div>
            )}

            <ul className="mt-6 list-none space-y-3 p-0">
              {section.items.map((item) => (
                <AdminRow key={item.id}>
                  {editingItem === item.id ? (
                    <div className="grid gap-4">
                      {itemDraft.driveUrl.trim() && (
                        <AdminMediaPreview
                          kind="drive"
                          src={itemDraft.driveUrl}
                          alt={itemDraft.description || 'Gallery media'}
                        />
                      )}
                      <AdminField
                        label="Google Drive URL"
                        value={itemDraft.driveUrl}
                        onChange={(v) =>
                          setItemDraft((s) => ({ ...s, driveUrl: v }))
                        }
                        mono
                      />
                      <AdminField
                        label="Description (optional)"
                        value={itemDraft.description}
                        onChange={(v) =>
                          setItemDraft((s) => ({ ...s, description: v }))
                        }
                      />
                      <AdminField
                        label="Sort order"
                        type="number"
                        value={String(itemDraft.sortOrder)}
                        onChange={(v) =>
                          setItemDraft((s) => ({
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
                              await adminSaveGalleryItem('PUT', {
                                id: item.id,
                                sectionId: section.id,
                                driveUrl: itemDraft.driveUrl,
                                description: itemDraft.description || null,
                                sortOrder: itemDraft.sortOrder,
                              })
                              setEditingItem(null)
                            })
                          }
                        >
                          Save item
                        </AdminButton>
                        <AdminButton
                          variant="ghost"
                          onClick={() => setEditingItem(null)}
                        >
                          Cancel
                        </AdminButton>
                      </AdminActions>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
                        <AdminMediaPreview
                          kind="drive"
                          src={item.driveUrl}
                          alt={item.description ?? 'Gallery media'}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="break-all font-mono text-sm text-ink">
                            {item.driveUrl}
                          </p>
                          {item.description && (
                            <p className="mt-2 font-sans text-sm text-ink-muted">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <AdminActions>
                        <AdminButton
                          variant="secondary"
                          onClick={() => {
                            setEditingItem(item.id)
                            setItemDraft({
                              driveUrl: item.driveUrl,
                              description: item.description ?? '',
                              sortOrder: item.sortOrder,
                            })
                          }}
                        >
                          Edit
                        </AdminButton>
                        <AdminButton
                          variant="danger"
                          disabled={busy}
                          onClick={() => {
                            if (!confirm('Delete this gallery item?')) return
                            void run(() => adminDeleteGalleryItem(item.id))
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
                Add Drive media
              </h3>
              <div className="mt-4 grid gap-4">
                {(newItem[section.id]?.driveUrl ?? '').trim() && (
                  <AdminMediaPreview
                    kind="drive"
                    src={newItem[section.id]!.driveUrl}
                    alt={
                      newItem[section.id]?.description || 'New gallery media'
                    }
                  />
                )}
                <AdminField
                  label="Google Drive URL"
                  value={newItem[section.id]?.driveUrl ?? ''}
                  onChange={(v) =>
                    setNewItem((s) => ({
                      ...s,
                      [section.id]: {
                        ...(s[section.id] ?? emptyItem),
                        driveUrl: v,
                      },
                    }))
                  }
                  mono
                />
                <AdminField
                  label="Description (optional)"
                  value={newItem[section.id]?.description ?? ''}
                  onChange={(v) =>
                    setNewItem((s) => ({
                      ...s,
                      [section.id]: {
                        ...(s[section.id] ?? emptyItem),
                        description: v,
                      },
                    }))
                  }
                />
              </div>
              <AdminButton
                className="mt-4"
                disabled={
                  busy || !(newItem[section.id]?.driveUrl ?? '').trim()
                }
                onClick={() =>
                  run(async () => {
                    const draft = newItem[section.id] ?? emptyItem
                    await adminSaveGalleryItem('POST', {
                      sectionId: section.id,
                      driveUrl: draft.driveUrl,
                      description: draft.description || null,
                      sortOrder: section.items.length,
                    })
                    setNewItem((s) => ({ ...s, [section.id]: emptyItem }))
                  })
                }
              >
                Add item
              </AdminButton>
            </div>
          </AdminPanel>
        ))}
      </div>
    </div>
  )
}
