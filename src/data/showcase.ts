/** Homepage showcase — visual first; copy comes from i18n showcase[] */
export type ShowcaseCase = {
  id: string
  before: string
  after: string
  /** Load demo A/B into maker */
  demo?: boolean
  /** External credit link */
  sourceUrl?: string
}

export const SHOWCASE_CASES: ShowcaseCase[] = [
  {
    id: 'viral',
    before: '/examples/case-viral-before.jpg',
    after: '/examples/case-viral-after.jpg',
    sourceUrl: 'https://x.com/sarasara_aiart/status/2080126609290674237',
  },
  {
    id: 'day-night',
    before: '/examples/case-day-night-before.jpg',
    after: '/examples/case-day-night-after.jpg',
  },
  {
    id: 'wings',
    before: '/examples/case-wings-before.jpg',
    after: '/examples/case-wings-after.jpg',
  },
  {
    id: 'sketch-color',
    before: '/examples/case-sketch-color-before.jpg',
    after: '/examples/case-sketch-color-after.jpg',
  },
  {
    id: 'silhouette',
    before: '/examples/case-silhouette-before.jpg',
    after: '/examples/case-silhouette-after.jpg',
  },
  {
    id: 'magic-char',
    before: '/examples/case-magic-char-before.jpg',
    after: '/examples/case-magic-char-after.jpg',
  },
  {
    id: 'world-swap',
    before: '/examples/case-world-swap-before.jpg',
    after: '/examples/case-world-swap-after.jpg',
  },
  {
    id: 'demo',
    before: '/examples/demo-preview-white.png',
    after: '/examples/demo-preview-black.png',
    demo: true,
  },
]
