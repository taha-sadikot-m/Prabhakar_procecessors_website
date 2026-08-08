import { company } from '../data/content'

type GoogleMapEmbedProps = {
  className?: string
  title?: string
  showOpenLink?: boolean
  roundedClassName?: string
}

export function GoogleMapEmbed({
  className = '',
  title = 'Map showing Prabhakar Processors location in Kadodara, Surat',
  showOpenLink = false,
  roundedClassName = 'rounded-xl',
}: GoogleMapEmbedProps) {
  return (
    <div className={className}>
      <div
        className={`relative h-full w-full overflow-hidden border border-mahogany/20 bg-cream-dark ${roundedClassName}`}
      >
        <iframe
          title={title}
          src={company.mapsEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      {showOpenLink && (
        <a
          href={company.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold tracking-[0.14em] text-mahogany uppercase transition-colors hover:text-mahogany-dark"
        >
          Open in Google Maps
          <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  )
}
