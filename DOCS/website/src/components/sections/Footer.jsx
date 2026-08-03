export default function Footer() {
  const year = new Date().getFullYear()
  const links = [
    { label: 'Story',         href: '#story' },
    { label: 'Process',       href: '#process' },
    { label: 'Capabilities',  href: '#capabilities' },
    { label: 'Proof',         href: '#proof' },
    { label: 'Contact',       href: '#contact' },
  ]

  return (
    <footer className="footer-v2">
      <div className="footer-v2-inner">

        <div className="footer-v2-brand-col">
          <div className="footer-v2-brand">Prabhakar Processors Pvt Ltd</div>
          <div className="footer-v2-address">
            Plot No. 13/14, Block No. 296<br />
            Village Tatithaiyya, Surat – Bardoli Road<br />
            Gujarat – 394327, India
          </div>
        </div>

        <div className="footer-v2-nav-col">
          {links.map(l => (
            <a key={l.label} href={l.href} className="footer-v2-link">{l.label}</a>
          ))}
        </div>

        <div className="footer-v2-connect-col">
          <a href="tel:+919909970505" className="footer-v2-link">+91 99099 70505</a>
          <a href="mailto:prabhakardyeing@gmail.com" className="footer-v2-link footer-v2-email">
            prabhakardyeing@gmail.com
          </a>
        </div>

      </div>

      <div className="footer-v2-bottom">
        <span>© {year} PRABHAKAR PROCESSORS PVT LTD · SURAT, GUJARAT</span>
        <span className="footer-v2-lotus">❁</span>
      </div>
    </footer>
  )
}
