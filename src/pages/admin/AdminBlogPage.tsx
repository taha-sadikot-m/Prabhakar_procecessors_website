import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  adminDeleteBlogPost,
  adminGetBlogPosts,
  type AdminBlogPostDto,
} from '../../lib/cms-api'
import {
  AdminActions,
  AdminButton,
  AdminEmpty,
  AdminError,
  AdminList,
  AdminListItem,
  AdminLoading,
  AdminPageHeader,
} from './admin-ui'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function AdminBlogPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<AdminBlogPostDto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await adminGetBlogPosts()
      setPosts(data.posts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function remove(id: string) {
    setBusy(true)
    setError(null)
    try {
      await adminDeleteBlogPost(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        meta={`${posts.length} posts`}
        busy={busy}
        actions={
          <AdminButton
            variant="primary"
            onClick={() => navigate('/admin/blog/new')}
          >
            Add post
          </AdminButton>
        }
      >
        SEO articles shown on /blog — open a post to edit on a full page.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {loading ? (
        <AdminLoading label="Loading posts…" />
      ) : posts.length === 0 ? (
        <AdminEmpty>
          No blog posts yet.{' '}
          <Link to="/admin/blog/new" className="text-mahogany underline">
            Add one
          </Link>{' '}
          to begin.
        </AdminEmpty>
      ) : (
        <AdminList>
          {posts.map((post) => (
            <AdminListItem key={post.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-xs font-semibold tracking-[0.1em] text-mahogany uppercase">
                    {post.published ? 'Published' : 'Draft'} · {post.category} ·{' '}
                    {formatDate(post.date)}
                  </p>
                  <p className="mt-2 font-serif text-lg leading-snug text-ink md:text-xl">
                    {post.title}
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink-muted">
                    /blog/{post.slug}
                  </p>
                </div>
                <AdminActions>
                  <AdminButton
                    variant="secondary"
                    onClick={() => navigate(`/admin/blog/${post.id}/edit`)}
                  >
                    Edit
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    disabled={busy}
                    onClick={() => {
                      if (!confirm('Delete this blog post?')) return
                      void remove(post.id)
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
  )
}
