export default function SiteNav() {
  const links = [
    { label: 'Story',        href: '#story' },
    { label: 'Process',      href: '#process' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Contact',      href: '#contact' },
  ]
  return (
    <nav className="sitenav">
      <a href="#hero" className="sitenav-brand">PRABHAKAR PROCESSORS</a>
      <div className="sitenav-links">
        {links.map(l => (
          <a key={l.label} href={l.href} className="sitenav-link">{l.label}</a>
        ))}
      </div>
    </nav>
  )
}
