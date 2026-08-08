import { useCallback, useEffect, useMemo, useState } from 'react'
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

type Modal =
  | { type: 'none' }
  | { type: 'addSection' }
  | { type: 'editSection' }
  | { type: 'addItem' }
  | { type: 'editItem'; itemId: string }

export function AdminGalleryPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modal, setModal] = useState<Modal>({ type: 'none' })
  const [sectionForm, setSectionForm] = useState(emptySection)
  const [itemForm, setItemForm] = useState(emptyItem)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminGetGallery()
      setSections(data.sections)
      setSelectedId((prev) => {
        if (prev && data.sections.some((s) => s.id === prev)) return prev
        return data.sections[0]?.id ?? null
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
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setBusy(false)
    }
  }

  const selected = useMemo(
    () => sections.find((s) => s.id === selectedId) ?? null,
    [sections, selectedId],
  )

  const mediaCount = sections.reduce((n, s) => n + s.items.length, 0)
  const closeModal = useCallback(() => setModal({ type: 'none' }), [])

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        meta={`${sections.length} sections · ${mediaCount} media`}
        busy={busy}
        actions={
          <AdminButton
            variant="primary"
            onClick={() => {
              setSectionForm(emptySection)
              setModal({ type: 'addSection' })
            }}
          >
            Add section
          </AdminButton>
        }
      >
        Pick a section on the left, then manage its Drive media on the right.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {loading ? (
        <AdminLoading label="Loading gallery…" />
      ) : (
      <AdminSplit
        masterLabel="Sections"
        master={
          <div>
            <div className="hidden border-b border-ink/10 bg-cream-dark/30 px-4 py-3 md:block">
              <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-ink-muted uppercase">
                Sections
              </p>
            </div>
            {sections.length === 0 ? (
              <p className="px-4 py-6 font-sans text-sm text-ink-muted">
                No sections yet.
              </p>
            ) : (
              <div className="flex gap-1 overflow-x-auto p-2 md:block md:overflow-visible md:p-0 md:py-1">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="min-w-[9.5rem] shrink-0 md:min-w-0 md:shrink"
                  >
                    <AdminMasterItem
                      title={section.title}
                      meta={`${section.items.length} media`}
                      active={selectedId === section.id}
                      onClick={() => setSelectedId(section.id)}
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
              Select a section on the left, or add a new one.
            </AdminEmpty>
          ) : (
            <div className="space-y-5">
              <AdminPanel>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-mahogany uppercase">
                      Section
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-medium text-ink">
                      {selected.title}
                    </h2>
                    {selected.body && (
                      <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted">
                        {selected.body}
                      </p>
                    )}
                  </div>
                  <AdminActions>
                    <AdminButton
                      variant="secondary"
                      onClick={() => {
                        setSectionForm({
                          title: selected.title,
                          body: selected.body ?? '',
                          sortOrder: selected.sortOrder,
                        })
                        setModal({ type: 'editSection' })
                      }}
                    >
                      Edit section
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={busy}
                      onClick={() => {
                        if (
                          !confirm(
                            `Delete section “${selected.title}” and all items?`,
                          )
                        )
                          return
                        void run(async () => {
                          await adminDeleteGallerySection(selected.id)
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
                    Media
                    <span className="ml-2 font-medium text-ink-muted normal-case tracking-normal">
                      ({selected.items.length})
                    </span>
                  </h3>
                  <AdminButton
                    variant="secondary"
                    onClick={() => {
                      setItemForm(emptyItem)
                      setModal({ type: 'addItem' })
                    }}
                  >
                    Add media
                  </AdminButton>
                </div>

                {selected.items.length === 0 ? (
                  <AdminEmpty>
                    No media in this section yet. Add a Drive file link.
                  </AdminEmpty>
                ) : (
                  <AdminList>
                    {selected.items.map((item) => (
                      <AdminListItem key={item.id}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
                            <AdminMediaPreview
                              kind="drive"
                              src={item.driveUrl}
                              alt={item.description ?? 'Gallery media'}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-sans text-sm font-medium text-ink">
                                {item.description || 'Untitled media'}
                              </p>
                              <p className="mt-1 break-all font-mono text-xs text-ink-muted">
                                {item.driveUrl}
                              </p>
                            </div>
                          </div>
                          <AdminActions>
                            <AdminButton
                              variant="secondary"
                              onClick={() => {
                                setItemForm({
                                  driveUrl: item.driveUrl,
                                  description: item.description ?? '',
                                  sortOrder: item.sortOrder,
                                })
                                setModal({
                                  type: 'editItem',
                                  itemId: item.id,
                                })
                              }}
                            >
                              Edit
                            </AdminButton>
                            <AdminButton
                              variant="danger"
                              disabled={busy}
                              onClick={() => {
                                if (!confirm('Delete this gallery item?'))
                                  return
                                void run(() => adminDeleteGalleryItem(item.id))
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
        open={modal.type === 'addSection' || modal.type === 'editSection'}
        onClose={closeModal}
        title={modal.type === 'editSection' ? 'Edit section' : 'Add section'}
        wide
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField
            label="Title"
            value={sectionForm.title}
            onChange={(v) => setSectionForm((s) => ({ ...s, title: v }))}
          />
          <AdminField
            label="Sort order"
            type="number"
            value={String(sectionForm.sortOrder)}
            onChange={(v) =>
              setSectionForm((s) => ({ ...s, sortOrder: Number(v) || 0 }))
            }
          />
          <AdminTextArea
            label="Body (optional)"
            value={sectionForm.body}
            onChange={(v) => setSectionForm((s) => ({ ...s, body: v }))}
            className="md:col-span-2"
          />
        </div>
        <AdminActions>
          <AdminButton
            className="mt-5"
            disabled={busy || !sectionForm.title.trim()}
            onClick={() =>
              run(async () => {
                if (modal.type === 'editSection' && selected) {
                  await adminSaveGallerySection('PUT', {
                    id: selected.id,
                    title: sectionForm.title,
                    body: sectionForm.body || null,
                    sortOrder: sectionForm.sortOrder,
                  })
                } else {
                  const res = await adminSaveGallerySection('POST', {
                    title: sectionForm.title,
                    body: sectionForm.body || null,
                    sortOrder: sectionForm.sortOrder,
                  })
                  if (res.id) setSelectedId(res.id)
                }
              })
            }
          >
            {modal.type === 'editSection' ? 'Save changes' : 'Save section'}
          </AdminButton>
          <AdminButton className="mt-5" variant="ghost" onClick={closeModal}>
            Cancel
          </AdminButton>
        </AdminActions>
      </AdminModal>

      <AdminModal
        open={modal.type === 'addItem' || modal.type === 'editItem'}
        onClose={closeModal}
        title={modal.type === 'editItem' ? 'Edit media' : 'Add media'}
        wide
      >
        <div className="grid gap-4">
          {itemForm.driveUrl.trim() && (
            <AdminMediaPreview
              kind="drive"
              src={itemForm.driveUrl}
              alt={itemForm.description || 'Gallery media'}
            />
          )}
          <AdminField
            label="Google Drive URL"
            value={itemForm.driveUrl}
            onChange={(v) => setItemForm((s) => ({ ...s, driveUrl: v }))}
            mono
          />
          <AdminField
            label="Description (optional)"
            value={itemForm.description}
            onChange={(v) => setItemForm((s) => ({ ...s, description: v }))}
          />
          {modal.type === 'editItem' && (
            <AdminField
              label="Sort order"
              type="number"
              value={String(itemForm.sortOrder)}
              onChange={(v) =>
                setItemForm((s) => ({ ...s, sortOrder: Number(v) || 0 }))
              }
            />
          )}
        </div>
        <AdminActions>
          <AdminButton
            className="mt-5"
            disabled={busy || !itemForm.driveUrl.trim() || !selected}
            onClick={() =>
              run(async () => {
                if (!selected) return
                if (modal.type === 'editItem') {
                  await adminSaveGalleryItem('PUT', {
                    id: modal.itemId,
                    sectionId: selected.id,
                    driveUrl: itemForm.driveUrl,
                    description: itemForm.description || null,
                    sortOrder: itemForm.sortOrder,
                  })
                } else {
                  await adminSaveGalleryItem('POST', {
                    sectionId: selected.id,
                    driveUrl: itemForm.driveUrl,
                    description: itemForm.description || null,
                    sortOrder: selected.items.length,
                  })
                }
              })
            }
          >
            {modal.type === 'editItem' ? 'Save changes' : 'Save media'}
          </AdminButton>
          <AdminButton className="mt-5" variant="ghost" onClick={closeModal}>
            Cancel
          </AdminButton>
        </AdminActions>
      </AdminModal>
    </div>
  )
}
