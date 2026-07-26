export type Locale = 'ja' | 'en' | 'ko' | 'zh' | 'tr'

export const LOCALES: Locale[] = ['ja', 'en', 'ko', 'zh', 'tr']

export const DEFAULT_LOCALE: Locale = 'ja'
export const X_DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_META: Record<
  Locale,
  { htmlLang: string; hreflang: string; label: string; dir?: 'ltr' | 'rtl' }
> = {
  ja: { htmlLang: 'ja', hreflang: 'ja', label: '日本語' },
  en: { htmlLang: 'en', hreflang: 'en', label: 'English' },
  ko: { htmlLang: 'ko', hreflang: 'ko', label: '한국어' },
  zh: { htmlLang: 'zh-Hans', hreflang: 'zh-Hans', label: '简体中文' },
  tr: { htmlLang: 'tr', hreflang: 'tr', label: 'Türkçe' },
}

export type Messages = {
  brandTag: string
  nav: {
    home: string
    how: string
    examples: string
    tapChange: string
    faq: string
    privacy: string
  }
  footer: {
    localOnly: string
    viralLink: string
  }
  home: {
    h1: string
    lead: string
    warn: string
    warnLink: string
    toolTitle: string
    loadDemo: string
    slotA: string
    slotAHint: string
    slotB: string
    slotBHint: string
    mode: string
    modeLuma: string
    modeRgb: string
    strength: string
    export: string
    exportPng8: string
    exportRgba: string
    recompose: string
    composing: string
    download: string
    needTwo: string
    composeFail: string
    copyFail: string
    demoFail: string
    previewBar: string
    tabWhite: string
    tabBlack: string
    tabCard: string
    previewEmpty: string
    captionsTitle: string
    copy: string
    copied: string
    drop: string
    clear: string
    resultsTitle: string
    resultsLead: string
    resultsMore: string
    /** Short titles for showcase cards on home (order matches SHOWCASE_CASES) */
    showcase: { title: string; desc?: string }[]
    caseViralLink: string
    caseDemoTry: string
    sideWhite: string
    sideBlack: string
    guideTitle: string
    guideP1: string
    guideSteps: string[]
    guideP2: string
    guideHowLink: string
    tipsTitle: string
    tips: string[]
    relatedTitle: string
    faqTitle: string
    faqMore: string
    faqItems: { q: string; a: string }[]
    captions: string[]
  }
  tapChange: {
    title: string
    description: string
    h1: string
    lead: string
    warn: string
    warnLink: string
    linkDual: string
    toolTitle: string
    loadDemo: string
    slotBase: string
    slotBaseHint: string
    slotFront: string
    slotFrontHint: string
    needBase: string
    fail: string
    demoFail: string
    previewEmpty: string
    howTitle: string
    howSteps: string[]
    diffNote: string
  }
  how: {
    title: string
    description: string
    h1: string
    intro: string
    ctaMake: string
    ctaExamples: string
    s1: string
    s1p: string
    s1li1: string
    s1li2: string
    s1p2: string
    s1p3: string
    s2: string
    s2p: string
    s2p2: string
    s2p3: string
    s3: string
    s3p: string
    s4: string
    s4li1: string
    s4li2: string
    s5: string
    s5li: string[]
    s6: string
    s6ol: string[]
    ctaNow: string
    ctaFaq: string
  }
  examples: {
    title: string
    description: string
    h1: string
    lead: string
    ctaMake: string
    ctaHow: string
    disclaimer: string
    cases: {
      id: string
      title: string
      desc: string
      credit: string
      sourceLabel?: string
    }[]
  }
  faq: {
    title: string
    description: string
    h1: string
    lead: string
    homeLink: string
    ctaMake: string
    ctaHow: string
    items: { q: string; a: string }[]
  }
  privacy: {
    title: string
    description: string
    h1: string
    updated: string
    s1: string
    s1p1: string
    s1p2: string
    s2: string
    s2p1: string
    s2p2: string
    s3: string
    s3p: string
    s4: string
    s4p: string
    s5: string
    s5p: string
    ctaHome: string
  }
  seo: {
    homeTitle: string
    homeDescription: string
  }
}
