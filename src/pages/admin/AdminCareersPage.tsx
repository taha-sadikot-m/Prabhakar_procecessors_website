import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminDeleteCultureItem,
  adminDeleteJobApplication,
  adminGetCulture,
  adminGetJobApplications,
  adminSaveCultureItem,
  type AdminCultureImageDto,
  type JobApplicationDto,
} from '../../lib/cms-api'
import { drivePreviewUrl, parseDriveFileId } from '../../lib/drive-client'
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
} from './admin-ui'
import { AdminMediaPreview } from './AdminMediaPreview'

type Tab = 'applications' | 'culture'

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function resumePreviewSrc(url: string) {
  const fileId = parseDriveFileId(url)
  if (fileId) return drivePreviewUrl(fileId)
  return url
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null
  return (
    <div>
      <p className="font-sans text-[10px] font-semibold tracking-[0.12em] text-ink-muted uppercase">
        {label}
      </p>
      <p className="mt-1 font-sans text-sm text-ink">{value}</p>
    </div>
  )
}

const emptyCulture = {
  driveUrl: '',
  caption: '',
  sortOrder: 0,
}

type CultureModal =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; itemId: string }

export function AdminCareersPage() {
  const [tab, setTab] = useState<Tab>('applications')
  const [applications, setApplications] = useState<JobApplicationDto[]>([])
  const [cultureItems, setCultureItems] = useState<AdminCultureImageDto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cultureModal, setCultureModal] = useState<CultureModal>({
    type: 'none',
  })
  const [cultureForm, setCultureForm] = useState(emptyCulture)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [apps, culture] = await Promise.all([
        adminGetJobApplications(),
        adminGetCulture(),
      ])
      setApplications(apps.applications)
      setCultureItems(culture.items)
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
    () => applications.find((a) => a.id === selectedId) ?? null,
    [applications, selectedId],
  )

  const previewSrc = selected ? resumePreviewSrc(selected.resumeUrl) : null

  async function runCulture(fn: () => Promise<unknown>) {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await load()
      setCultureModal({ type: 'none' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setBusy(false)
    }
  }

  const meta =
    tab === 'applications'
      ? `${applications.length} applications`
      : `${cultureItems.length} culture photos`

  return (
    <div>
      <AdminPageHeader
        title="Careers"
        meta={meta}
        busy={busy}
        actions={
          tab === 'culture' ? (
            <AdminButton
              variant="primary"
              onClick={() => {
                setCultureForm(emptyCulture)
                setCultureModal({ type: 'add' })
              }}
            >
              Add photo
            </AdminButton>
          ) : undefined
        }
      >
        {tab === 'applications'
          ? 'Job applications from /careers. Open a row to review details and preview the resume link in-panel.'
          : 'Culture photos shown in the rotating stack on /careers#culture. Paste a Google Drive file link.'}
      </AdminPageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            { id: 'applications', label: 'Applications' },
            { id: 'culture', label: 'Culture photos' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-3 py-2 font-sans text-xs font-semibold tracking-[0.1em] uppercase transition-colors ${
              tab === item.id
                ? 'bg-cream-dark text-mahogany shadow-[inset_0_0_0_1px_rgba(103,68,56,0.12)]'
                : 'text-ink-muted hover:bg-cream-light hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && <AdminError>{error}</AdminError>}

      {loading ? (
        <AdminLoading
          label={
            tab === 'applications'
              ? 'Loading applications…'
              : 'Loading culture photos…'
          }
        />
      ) : tab === 'applications' ? (
        applications.length === 0 ? (
          <AdminEmpty>No applications yet.</AdminEmpty>
        ) : (
          <AdminList>
            {applications.map((app) => (
              <AdminListItem key={app.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-medium text-ink">
                      {app.fullName}
                    </p>
                    <p className="mt-1 font-sans text-xs text-ink-muted">
                      {app.department} · {app.city} · {app.email}
                    </p>
                    <p className="mt-1 font-sans text-[11px] text-ink/45">
                      {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <AdminActions>
                    <AdminButton
                      variant="secondary"
                      onClick={() => setSelectedId(app.id)}
                    >
                      View
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      disabled={busy}
                      onClick={() => {
                        if (!confirm('Delete this application?')) return
                        setBusy(true)
                        setError(null)
                        void adminDeleteJobApplication(app.id)
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
        )
      ) : cultureItems.length === 0 ? (
        <AdminEmpty>
          No culture photos yet. Add a Drive image link to begin.
        </AdminEmpty>
      ) : (
        <AdminList>
          {cultureItems.map((item) => (
            <AdminListItem key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
                  <AdminMediaPreview
                    kind="drive"
                    src={item.driveUrl}
                    alt={item.caption || 'Culture photo'}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-medium text-ink">
                      {item.caption || 'Untitled photo'}
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-ink-muted">
                      {item.driveUrl}
                    </p>
                    <p className="mt-1 font-sans text-[11px] text-ink/45">
                      Sort {item.sortOrder}
                    </p>
                  </div>
                </div>
                <AdminActions>
                  <AdminButton
                    variant="secondary"
                    onClick={() => {
                      setCultureForm({
                        driveUrl: item.driveUrl,
                        caption: item.caption,
                        sortOrder: item.sortOrder,
                      })
                      setCultureModal({ type: 'edit', itemId: item.id })
                    }}
                  >
                    Edit
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    disabled={busy}
                    onClick={() => {
                      if (!confirm('Delete this culture photo?')) return
                      void runCulture(() => adminDeleteCultureItem(item.id))
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
        title={selected ? selected.fullName : 'Application'}
        wide
      >
        {selected && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Department" value={selected.department} />
              <DetailRow label="City" value={selected.city} />
              <DetailRow label="Mobile" value={selected.mobile} />
              <DetailRow label="Email" value={selected.email} />
              <DetailRow
                label="Qualification"
                value={selected.qualification}
              />
              <DetailRow label="Experience" value={selected.experience} />
              <DetailRow
                label="Current company"
                value={selected.currentCompany}
              />
              <DetailRow
                label="Expected salary"
                value={selected.expectedSalary}
              />
              <DetailRow
                label="Submitted"
                value={formatDate(selected.createdAt)}
              />
            </div>

            {selected.remarks.trim() && (
              <DetailRow label="Remarks" value={selected.remarks} />
            )}

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-sans text-[10px] font-semibold tracking-[0.12em] text-ink-muted uppercase">
                  Resume preview
                </p>
                <a
                  href={selected.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs font-medium text-mahogany underline-offset-2 hover:underline"
                >
                  Open in new tab
                </a>
              </div>
              <div className="overflow-hidden rounded-lg border border-ink/10 bg-cream-dark/30">
                {previewSrc ? (
                  <iframe
                    title={`Resume for ${selected.fullName}`}
                    src={previewSrc}
                    className="h-[28rem] w-full bg-cream"
                  />
                ) : (
                  <p className="px-4 py-8 font-sans text-sm text-ink-muted">
                    Preview unavailable for this link.
                  </p>
                )}
              </div>
              <p className="mt-2 break-all font-mono text-[11px] text-ink/45">
                {selected.resumeUrl}
              </p>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminModal
        open={cultureModal.type === 'add' || cultureModal.type === 'edit'}
        onClose={() => setCultureModal({ type: 'none' })}
        title={
          cultureModal.type === 'edit'
            ? 'Edit culture photo'
            : 'Add culture photo'
        }
        wide
      >
        <div className="grid gap-4">
          {cultureForm.driveUrl.trim() && (
            <AdminMediaPreview
              kind="drive"
              src={cultureForm.driveUrl}
              alt={cultureForm.caption || 'Culture photo'}
            />
          )}
          <AdminField
            label="Drive URL"
            value={cultureForm.driveUrl}
            onChange={(v) => setCultureForm((s) => ({ ...s, driveUrl: v }))}
            placeholder="https://drive.google.com/file/d/…"
          />
          <AdminField
            label="Caption (optional)"
            value={cultureForm.caption}
            onChange={(v) => setCultureForm((s) => ({ ...s, caption: v }))}
          />
          <AdminField
            label="Sort order"
            value={String(cultureForm.sortOrder)}
            onChange={(v) =>
              setCultureForm((s) => ({
                ...s,
                sortOrder: Number.parseInt(v, 10) || 0,
              }))
            }
          />
          <AdminActions>
            <AdminButton
              variant="secondary"
              onClick={() => setCultureModal({ type: 'none' })}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              disabled={busy || !cultureForm.driveUrl.trim()}
              onClick={() => {
                const body = {
                  driveUrl: cultureForm.driveUrl.trim(),
                  caption: cultureForm.caption.trim(),
                  sortOrder: cultureForm.sortOrder,
                  ...(cultureModal.type === 'edit'
                    ? { id: cultureModal.itemId }
                    : {}),
                }
                void runCulture(() =>
                  adminSaveCultureItem(
                    cultureModal.type === 'edit' ? 'PUT' : 'POST',
                    body,
                  ),
                )
              }}
            >
              {cultureModal.type === 'edit' ? 'Save' : 'Add'}
            </AdminButton>
          </AdminActions>
        </div>
      </AdminModal>
    </div>
  )
}
