export default function StorySection() {
  return (
    <div className="img-section">
      <picture>
        <source media="(max-width: 768px)" srcSet="/assets/landing/fabric-mobile.png" />
        <img
          className="img-section__bg"
          src="/assets/landing/fabric-desktop.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </picture>

      {/* Text in the cream zone — left side of the grey fabric image */}
      <div className="img-section__text img-section__text--story">
        <p className="ist-eyebrow">❁ &nbsp;Since 2009</p>
        <h2 className="ist-h2">
          One Company.<br />
          Every Process.<br />
          <em>No Second Vendor.</em>
        </h2>
        <div className="ist-rule" />
        <p className="ist-body">
          Grey fabric in. Finished cloth out.
          Dyeing, printing, finishing — all under one roof
          in Surat's textile heartland. No handoffs. No surprises.
        </p>
        <div className="ist-stats">
          <div className="ist-stat">
            <span className="ist-stat-num">17</span>
            <span className="ist-stat-lbl">years</span>
          </div>
          <div className="ist-stat-divider" />
          <div className="ist-stat">
            <span className="ist-stat-num">700<sup>+</sup></span>
            <span className="ist-stat-lbl">clients</span>
          </div>
          <div className="ist-stat-divider" />
          <div className="ist-stat">
            <span className="ist-stat-num">6L</span>
            <span className="ist-stat-lbl">metres / day</span>
          </div>
        </div>
      </div>
    </div>
  )
}
