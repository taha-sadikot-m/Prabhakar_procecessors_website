import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminDeleteJobApplication,
  adminGetJobApplications,
  type JobApplicationDto,
} from '../../lib/cms-api'
import { drivePreviewUrl, parseDriveFileId } from '../../lib/drive-client'
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

export function AdminCareersPage() {
  const [applications, setApplications] = useState<JobApplicationDto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminGetJobApplications()
      setApplications(data.applications)
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

  return (
    <div>
      <AdminPageHeader
        title="Careers"
        meta={`${applications.length} applications`}
        busy={busy}
      >
        Job applications from /careers. Open a row to review details and preview
        the resume link in-panel.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {loading ? (
        <AdminLoading label="Loading applications…" />
      ) : applications.length === 0 ? (
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
              <DetailRow label="Submitted" value={formatDate(selected.createdAt)} />
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
    </div>
  )
}
