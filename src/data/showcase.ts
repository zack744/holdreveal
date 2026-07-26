/** Homepage showcase — visual first; copy comes from i18n showcase[] */
export type ShowcaseCase = {
  id: string
  before: string
  after: string
  /** Load demo A/B into dual maker */
  demo?: boolean
  /** External credit link */
  sourceUrl?: string
  /** X handle for credit line */
  author?: string
}

export const SHOWCASE_CASES: ShowcaseCase[] = [
  {
    id: 'case01-angel',
    before: '/examples/case01-angel-before.jpg',
    after: '/examples/case01-angel-after.jpg',
    sourceUrl: 'https://x.com/sarasara_aiart/status/2080126609290674237',
    author: '@sarasara_aiart',
  },
  {
    id: 'case02-goth-wings',
    before: '/examples/case02-goth-wings-before.jpg',
    after: '/examples/case02-goth-wings-after.jpg',
    sourceUrl: 'https://x.com/sarasara_aiart/status/2080306170871587009',
    author: '@sarasara_aiart',
  },
  {
    id: 'case03-mermaid',
    before: '/examples/case03-mermaid-before.jpg',
    after: '/examples/case03-mermaid-after.jpg',
    sourceUrl: 'https://x.com/sarasara_aiart/status/2080850538376384815',
    author: '@sarasara_aiart',
  },
  {
    id: 'case04-rose',
    before: '/examples/case04-rose-before.jpg',
    after: '/examples/case04-rose-after.jpg',
    sourceUrl: 'https://x.com/towa_AIillust/status/2080494179558510798',
    author: '@towa_AIillust',
  },
  {
    id: 'case05-sky-wings',
    before: '/examples/case05-sky-wings-before.jpg',
    after: '/examples/case05-sky-wings-after.jpg',
    sourceUrl: 'https://x.com/sarasara_aiart/status/2080501688172237079',
    author: '@sarasara_aiart',
  },
  {
    id: 'demo',
    before: '/examples/demo-preview-white.png',
    after: '/examples/demo-preview-black.png',
    demo: true,
  },
]
