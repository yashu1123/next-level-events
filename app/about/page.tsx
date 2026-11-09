'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Music2, Sparkles } from 'lucide-react';

type Language = 'en' | 'kn';
const copy = {
  en: {
    label: 'THE STORY BEHIND THE CELEBRATION',
    brand: 'NEXT LEVEL EVENTS',
    tagline: 'Turning Moments into Unforgettable Memories!',
    introTitle: 'Who We Are',
    intro: [
      'Next Level Events is a professional event management and entertainment company dedicated to making every celebration extraordinary. We specialize in planning, organizing, and managing events with creativity, passion, and perfection.',
      'From weddings and birthday celebrations to cultural festivals, religious functions, corporate events, and live musical performances, we bring every occasion to life with unforgettable experiences.',
      'With talented performers, professional event coordination, and quality entertainment, we take your celebrations to the NEXT LEVEL!'
    ],
    specialityTitle: 'Our Speciality',
    specialityIntro: 'We provide live entertainment and event management services in four languages:',
    languages: ['Kannada', 'Hindi', 'Tamil', 'Telugu'],
    specialityOutro: "Whether it's a traditional celebration or a modern musical night, we bring entertainment that connects with every audience.",
    artistsTitle: 'Our Star Performers',
    artistsIntro: 'Meet our talented singers who make every event memorable:',
    artists: ['Megharaj', 'Krishnendra Pandit', 'Bhoomika', 'Ramya'],
    artistsOutro: 'Our performers bring energy, passion, and exceptional musical entertainment to every stage.',
    missionTitle: 'Our Mission',
    mission: 'To create extraordinary celebrations through creativity, quality entertainment, and professional event management while turning every special occasion into a lifelong memory.',
    visionTitle: 'Our Vision',
    vision: 'To become a trusted and leading event management and entertainment brand, delivering unforgettable experiences across Karnataka and beyond.',
    ctaTitle: 'Ready to make your moment memorable?',
    cta: 'Tell us what you are celebrating',
    back: 'Back to home',
    footer: 'For the moments you’ll talk about tomorrow.',
  },
  kn: {
    label: 'ನಿಮ್ಮ ಸಂಭ್ರಮದ ಹಿಂದಿನ ಕಥೆ',
    brand: 'ನೆಕ್ಸ್ಟ್ ಲೆವೆಲ್ ಈವೆಂಟ್ಸ್',
    tagline: 'ನಿಮ್ಮ ಸಂಭ್ರಮಕ್ಕೆ ಹೊಸ ಮೆರುಗು, ನಿಮ್ಮ ನೆನಪುಗಳಿಗೆ ಹೊಸ ರೂಪ!',
    introTitle: 'ನಮ್ಮ ಪರಿಚಯ',
    intro: [
      'ನೆಕ್ಸ್ಟ್ ಲೆವೆಲ್ ಈವೆಂಟ್ಸ್ ಒಂದು ವೃತ್ತಿಪರ ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ಮತ್ತು ಮನರಂಜನಾ ಸಂಸ್ಥೆಯಾಗಿದೆ. ಪ್ರತಿಯೊಂದು ಕಾರ್ಯಕ್ರಮವನ್ನೂ ವಿಶೇಷವಾಗಿಸಿ, ನಿಮ್ಮ ಜೀವನದ ಅಮೂಲ್ಯ ಕ್ಷಣಗಳನ್ನು ಸದಾ ನೆನಪಿನಲ್ಲಿ ಉಳಿಯುವಂತೆ ಮಾಡುವುದು ನಮ್ಮ ಉದ್ದೇಶ.',
      'ಮದುವೆ, ಹುಟ್ಟುಹಬ್ಬ, ಅರಿಶಿನ ಶಾಸ್ತ್ರ, ಗೃಹಪ್ರವೇಶ, ಸಾಂಸ್ಕೃತಿಕ ಉತ್ಸವಗಳು, ಧಾರ್ಮಿಕ ಕಾರ್ಯಕ್ರಮಗಳು, ಕಾರ್ಪೊರೇಟ್ ಕಾರ್ಯಕ್ರಮಗಳು ಹಾಗೂ ಸಂಗೀತ ಸಂಜೆ ಸೇರಿದಂತೆ ವಿವಿಧ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಸೃಜನಶೀಲತೆ, ಉತ್ಸಾಹ ಮತ್ತು ವೃತ್ತಿಪರತೆಯಿಂದ ಆಯೋಜಿಸುತ್ತೇವೆ.',
      'ಪ್ರತಿಭಾವಂತ ಗಾಯಕರ ತಂಡ, ಅತ್ಯುತ್ತಮ ಸಂಗೀತ ಮನರಂಜನೆ ಮತ್ತು ಅಚ್ಚುಕಟ್ಟಾದ ಕಾರ್ಯಕ್ರಮ ನಿರ್ವಹಣೆಯ ಮೂಲಕ ನಿಮ್ಮ ಪ್ರತಿಯೊಂದು ಸಂಭ್ರಮವನ್ನೂ NEXT LEVEL ಗೆ ಕೊಂಡೊಯ್ಯುತ್ತೇವೆ!'
    ],
    specialityTitle: 'ನಮ್ಮ ವಿಶೇಷತೆ',
    specialityIntro: 'ನಾವು ನಾಲ್ಕು ಭಾಷೆಗಳಲ್ಲಿ ಸಂಗೀತ ಮತ್ತು ಮನರಂಜನಾ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ:',
    languages: ['ಕನ್ನಡ', 'ಹಿಂದಿ', 'ತಮಿಳು', 'ತೆಲುಗು'],
    specialityOutro: 'ಸಾಂಪ್ರದಾಯಿಕ ಕಾರ್ಯಕ್ರಮಗಳಿಂದ ಹಿಡಿದು ಆಧುನಿಕ ಸಂಗೀತ ರಾತ್ರಿಗಳವರೆಗೆ, ಪ್ರತಿಯೊಬ್ಬ ಪ್ರೇಕ್ಷಕರ ಮನಸ್ಸಿಗೆ ಮುದ ನೀಡುವ ಮನರಂಜನೆಯನ್ನು ಒದಗಿಸುತ್ತೇವೆ.',
    artistsTitle: 'ನಮ್ಮ ತಾರಾ ಕಲಾವಿದರು',
    artistsIntro: 'ನಮ್ಮ ಕಾರ್ಯಕ್ರಮಗಳಿಗೆ ಸಂಗೀತದ ಮೆರುಗು ನೀಡುವ ಪ್ರತಿಭಾವಂತ ಗಾಯಕರ ಪರಿಚಯ:',
    artists: ['ಮೇಘರಾಜ್ (Megharaj)', 'ಕೃಷ್ಣೇಂದ್ರ ಪಂಡಿತ್ (Krishnendra Pandit)', 'ಭೂಮಿಕಾ (Bhoomika)', 'ರಮ್ಯಾ (Ramya)'],
    artistsOutro: 'ನಮ್ಮ ಕಲಾವಿದರು ತಮ್ಮ ಅದ್ಭುತ ಗಾಯನ, ಸಂಗೀತ ಪ್ರತಿಭೆ ಮತ್ತು ವೇದಿಕೆಯ ಮೇಲಿನ ಉತ್ಸಾಹದಿಂದ ಪ್ರತಿಯೊಂದು ಕಾರ್ಯಕ್ರಮವನ್ನೂ ಸ್ಮರಣೀಯವಾಗಿಸುತ್ತಾರೆ.',
    missionTitle: 'ನಮ್ಮ ಧ್ಯೇಯ (Our Mission)',
    mission: 'ಸೃಜನಶೀಲತೆ, ಗುಣಮಟ್ಟದ ಮನರಂಜನೆ ಮತ್ತು ವೃತ್ತಿಪರ ಕಾರ್ಯಕ್ರಮ ನಿರ್ವಹಣೆಯ ಮೂಲಕ ಪ್ರತಿಯೊಂದು ವಿಶೇಷ ಸಂದರ್ಭವನ್ನೂ ಸದಾ ನೆನಪಿನಲ್ಲಿ ಉಳಿಯುವ ಅನುಭವವನ್ನಾಗಿ ರೂಪಿಸುವುದು ನಮ್ಮ ಧ್ಯೇಯ.',
    visionTitle: 'ನಮ್ಮ ದೂರದೃಷ್ಟಿ (Our Vision)',
    vision: 'ಕರ್ನಾಟಕ ಮಾತ್ರವಲ್ಲದೆ ದೇಶದಾದ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ಮುಂಚೂಣಿಯ ಈವೆಂಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ಹಾಗೂ ಮನರಂಜನಾ ಸಂಸ್ಥೆಯಾಗಿ ಗುರುತಿಸಿಕೊಳ್ಳುವುದು ನಮ್ಮ ಗುರಿ.',
    ctaTitle: 'ನಿಮ್ಮ ಸಂಭ್ರಮವನ್ನು ಸ್ಮರಣೀಯವಾಗಿಸೋಣವೇ?',
    cta: 'ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮದ ಬಗ್ಗೆ ತಿಳಿಸಿ',
    back: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    footer: 'ನಾಳೆಯೂ ನೆನಪಿನಲ್ಲಿ ಉಳಿಯುವ ಕ್ಷಣಗಳಿಗಾಗಿ.',
  }
};

export default function AboutPage() {
  const [language, setLanguage] = useState<Language>('en');
  const t = copy[language];
  return <div className="about-page">
    <header className="about-page-header">
      <a className="brand" href="/" aria-label="Next Level Events home"><span className="brand-icon">n<span>↗</span></span><span>NEXT LEVEL<small>EVENTS & ENTERTAINMENT</small></span></a>
      <a className="about-back" href="/"><ArrowLeft size={18}/><span>{t.back}</span></a>
    </header>
    <main lang={language}>
      <section className="about-page-hero">
        <div className="about-page-hero-inner">
          <div className="about-page-topline"><span className="eyebrow"><Sparkles size={15}/>{t.label}</span><div className="language-switch" role="group" aria-label="Choose About Us language"><button type="button" lang="en" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>English</button><button type="button" lang="kn" aria-pressed={language==='kn'} onClick={()=>setLanguage('kn')}>ಕನ್ನಡ</button></div></div>
          <h1>{t.brand}</h1><p className="about-page-tagline">{t.tagline}</p>
          <div className="about-page-hero-bottom"><span>01 — 05</span><span>SCROLL TO EXPLORE ↓</span></div>
        </div>
      </section>
      <div className="about-page-intro-band"><span>CREATIVITY ✳ ENTERTAINMENT ✳ CELEBRATION</span><Music2 size={24}/></div>
      <section className="about-page-section about-page-intro"><div className="about-page-index">01 / {t.introTitle}</div><div><h2>{t.introTitle}</h2>{t.intro.map((p,i)=><p key={i}>{p}</p>)}</div></section>
      <section className="about-page-section about-page-speciality"><div className="about-page-index">02 / {t.specialityTitle}</div><div><h2>{t.specialityTitle}</h2><p>{t.specialityIntro}</p><div className="language-grid">{t.languages.map((name,i)=><div key={i}><span>0{i+1}</span><strong>{name}</strong><ArrowUpRight size={20}/></div>)}</div><p>{t.specialityOutro}</p></div></section>
      <section className="about-page-section about-page-artists"><div className="about-page-index">03 / {t.artistsTitle}</div><div><h2>{t.artistsTitle}</h2><p>{t.artistsIntro}</p><div className="artist-list">{t.artists.map((name,i)=><div key={name}><span>0{i+1}</span><strong>{name}</strong><Music2 size={20}/></div>)}</div><p>{t.artistsOutro}</p></div></section>
      <section className="about-page-purpose"><article><span>04 / {t.missionTitle}</span><h2>{t.missionTitle}</h2><p>{t.mission}</p></article><article><span>05 / {t.visionTitle}</span><h2>{t.visionTitle}</h2><p>{t.vision}</p></article></section>
      <section className="about-page-cta"><span className="eyebrow"><Sparkles size={15}/> NEXT LEVEL EVENTS</span><h2>{t.ctaTitle}</h2><a className="button" href="/#contact">{t.cta}<ArrowUpRight size={20}/></a></section>
    </main>
    <footer className="about-page-footer"><a className="brand" href="/"><span className="brand-icon">n<span>↗</span></span><span>NEXT LEVEL<small>EVENTS & ENTERTAINMENT</small></span></a><p>{t.footer}</p><small>© {new Date().getFullYear()} Next Level Events</small></footer>
  </div>;
}
