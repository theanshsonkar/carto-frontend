/**
 * ContainerMark - Carto's logo glyph.
 *
 * An isometric 3D container: three near-black faces (lit top, mid side, dark
 * front) give real depth at small sizes, matching the site's flat/offset
 * "blueprint" 3D language rather than glossy gradients. A single route-blue
 * chip on the front face is the brand's map accent - the marker on the box.
 * Faceted seams are hairlined in paper so the cube reads crisp on any bg.
 */
export function ContainerMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" role="img">
        {/* right side face (mid) */}
        <polygon points="27,9.5 16,15 16,24 27,18.5" fill="#1e1c16" />
        {/* left / front face (darkest) */}
        <polygon points="5,9.5 16,15 16,24 5,18.5" fill="#14130d" />
        {/* top face (lit) */}
        <polygon points="16,4 27,9.5 16,15 5,9.5" fill="#2b2820" />

        {/* brand chip - the map marker on the container's front face */}
        <polygon
          points="8.4,13.4 12.4,15.4 12.4,19 8.4,17"
          fill="var(--color-route)"
        />

        {/* faceted seams - hairlines where the visible faces meet */}
        <g
          stroke="var(--color-paper)"
          strokeWidth="0.75"
          strokeLinejoin="miter"
          opacity="0.5"
          fill="none"
        >
          <path d="M5 9.5 16 15 27 9.5" />
          <path d="M16 15 16 24" />
        </g>
      </svg>
    </span>
  );
}
