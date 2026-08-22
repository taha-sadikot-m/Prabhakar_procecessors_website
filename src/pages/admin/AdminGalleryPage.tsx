import { useCallback, useEffect, useState } from 'react'
import {
  adminDeleteGalleryItem,
  adminGetGallery,
  adminSaveGalleryItem,
  adminUploadMedia,
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
  const [uploading, setUploading] = useState(false)
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
        Images and videos on /gallery. Upload local WebP/WebM (or paste a URL).
        Set media type so play controls only appear on videos.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {loading ? (
        <AdminLoading label="Loading gallery…" />
      ) : items.length === 0 ? (
        <AdminEmpty>No media yet. Upload a file to begin.</AdminEmpty>
      ) : (
        <AdminList>
          {items.map((item) => (
            <AdminListItem key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
                  <AdminMediaPreview
                    kind="auto"
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
              kind="auto"
              src={itemForm.driveUrl}
              alt={itemForm.description || 'Gallery media'}
            />
          )}
          <AdminSelect
            label="Media type"
            value={itemForm.mediaType}
            onChange={(v) =>
              setItemForm((s) => ({ ...s, mediaType: asMediaType(v) }))
            }
            options={[...MEDIA_TYPE_OPTIONS]}
          />
          <AdminField
            label="Image / Video URL"
            value={itemForm.driveUrl}
            onChange={(v) => setItemForm((s) => ({ ...s, driveUrl: v }))}
            placeholder="/uploads/gallery/… or Drive link"
            mono
          />
          <label className="block">
            <span className="mb-1.5 block font-sans text-[10px] font-semibold tracking-[0.14em] text-ink-muted uppercase">
              Upload file
            </span>
            <input
              type="file"
              accept={
                itemForm.mediaType === 'image'
                  ? 'image/*'
                  : 'video/webm,video/mp4,video/*'
              }
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
                      modal.type === 'edit' ? modal.itemId : undefined
                    const { url } = await adminUploadMedia(file, {
                      id: stem,
                      folder: 'gallery',
                      mediaType: itemForm.mediaType,
                    })
                    setItemForm((s) => ({ ...s, driveUrl: url }))
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
                Uploading…
              </p>
            )}
          </label>
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
            disabled={
              busy ||
              uploading ||
              !itemForm.driveUrl.trim() ||
              !itemForm.mediaType
            }
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
