import { useCallback, useEffect, useState } from 'react'
import {
  adminDeleteGalleryItem,
  adminGetGallery,
  adminSaveGalleryItem,
  type AdminGalleryItemDto,
  type GalleryMediaType,
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
  AdminModal,
  AdminPageHeader,
  AdminSelect,
} from './admin-ui'
import { AdminMediaPreview } from './AdminMediaPreview'

const MEDIA_TYPE_OPTIONS = [
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
] as const

function asMediaType(value: string): GalleryMediaType {
  return value === 'image' ? 'image' : 'video'
}

const emptyItem = {
  driveUrl: '',
  description: '',
  mediaType: 'video' as GalleryMediaType,
  sortOrder: 0,
}

type Modal =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; itemId: string }

export function AdminGalleryPage() {
  const [items, setItems] = useState<AdminGalleryItemDto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>({ type: 'none' })
  const [itemForm, setItemForm] = useState(emptyItem)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminGetGallery()
      setItems(data.items)
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

  const closeModal = useCallback(() => setModal({ type: 'none' }), [])

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        meta={`${items.length} media`}
        busy={busy}
        actions={
          <AdminButton
            variant="primary"
            onClick={() => {
              setItemForm(emptyItem)
              setModal({ type: 'add' })
            }}
          >
            Add media
          </AdminButton>
        }
      >
        Drive images and videos shown on /gallery. Set media type so play
        buttons only appear on videos.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {loading ? (
        <AdminLoading label="Loading gallery…" />
      ) : items.length === 0 ? (
        <AdminEmpty>No media yet. Add a Drive file link to begin.</AdminEmpty>
      ) : (
        <AdminList>
          {items.map((item) => (
            <AdminListItem key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
                  <AdminMediaPreview
                    kind="drive"
                    src={item.driveUrl}
                    alt={item.description ?? 'Gallery media'}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-sans text-sm font-medium text-ink">
                        {item.description || 'Untitled media'}
                      </p>
                      <span className="rounded-md border border-ink/10 bg-cream-dark/40 px-1.5 py-0.5 font-sans text-[10px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
                        {item.mediaType === 'image' ? 'Image' : 'Video'}
                      </span>
                    </div>
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
                        mediaType: asMediaType(item.mediaType),
                        sortOrder: item.sortOrder,
                      })
                      setModal({ type: 'edit', itemId: item.id })
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
            </AdminListItem>
          ))}
        </AdminList>
      )}

      <AdminModal
        open={modal.type === 'add' || modal.type === 'edit'}
        onClose={closeModal}
        title={modal.type === 'edit' ? 'Edit media' : 'Add media'}
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
          <AdminSelect
            label="Media type"
            value={itemForm.mediaType}
            onChange={(v) =>
              setItemForm((s) => ({ ...s, mediaType: asMediaType(v) }))
            }
            options={[...MEDIA_TYPE_OPTIONS]}
          />
          <AdminField
            label="Description (optional)"
            value={itemForm.description}
            onChange={(v) => setItemForm((s) => ({ ...s, description: v }))}
          />
          {modal.type === 'edit' && (
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
            disabled={busy || !itemForm.driveUrl.trim() || !itemForm.mediaType}
            onClick={() =>
              run(async () => {
                const mediaType = asMediaType(itemForm.mediaType)
                if (modal.type === 'edit') {
                  await adminSaveGalleryItem('PUT', {
                    id: modal.itemId,
                    driveUrl: itemForm.driveUrl,
                    description: itemForm.description || null,
                    mediaType,
                    sortOrder: itemForm.sortOrder,
                  })
                } else {
                  await adminSaveGalleryItem('POST', {
                    driveUrl: itemForm.driveUrl,
                    description: itemForm.description || null,
                    mediaType,
                    sortOrder: items.length,
                  })
                }
              })
            }
          >
            {modal.type === 'edit' ? 'Save changes' : 'Save media'}
          </AdminButton>
          <AdminButton className="mt-5" variant="ghost" onClick={closeModal}>
            Cancel
          </AdminButton>
        </AdminActions>
      </AdminModal>
    </div>
  )
}
