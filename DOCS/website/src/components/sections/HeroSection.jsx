export default function HeroSection() {
  return (
    <div className="img-section">
      <picture>
        <source media="(max-width: 768px)" srcSet="/assets/landing/hero-mobile.png" />
        <img
          className="img-section__bg"
          src="/assets/landing/hero-desktop.png"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
      </picture>

      {/* Text in the cream zone — left side of the hero image */}
      <div className="img-section__text img-section__text--hero">
        <p className="ist-eyebrow">Surat, Gujarat · Est. 2009</p>
        <h1 className="ist-h1">
          Where Grey<br />
          Becomes<br />
          <em>Brilliant.</em>
        </h1>
        <div className="ist-rule" />
        <p className="ist-meta">
          3,50,000 m&nbsp;·&nbsp;day&ensp;|&ensp;Dyeing · Printing · Finishing
        </p>
      </div>

      <div className="img-section__scroll-cue">
        <div className="isc-line" />
        <span className="isc-label">SCROLL</span>
      </div>
    </div>
  )
}
