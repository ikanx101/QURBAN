import { useState, useEffect } from 'react'

type Page = 'home' | 'dokumentasi' | 'realisasi'

interface Pengqurban {
  No: string
  Keterangan: string
  Nama: string
  Alamat: string
}

interface Realisasi {
  No: string
  Tanggal: string
  Keterangan: string
  Pemasukan: string
  Pengeluaran: string
  Saldo?: string
}

/* ── Data Ayat & Hadits ── */
interface AyatItem {
  type: 'ayat'
  arab: string
  arti: string
  surah: string
}

interface HaditsItem {
  type: 'hadits'
  arab: string
  arti: string
  sumber: string
}

type WahyuItem = AyatItem | HaditsItem

const wahyuList: WahyuItem[] = [
  {
    type: 'ayat',
    arab: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
    arti: 'Maka dirikanlah shalat karena Tuhanmu; dan berqurbanlah (an-Nahr).',
    surah: 'QS. Al-Kautsar (108): 2',
  },
  {
    type: 'ayat',
    arab: 'وَالْبُدْنَ جَعَلْنَاهَا لَكُمْ مِنْ شَعَائِرِ اللَّهِ لَكُمْ فِيهَا خَيْرٌ',
    arti: 'Dan telah Kami jadikan untuk kamu unta-unta itu sebagian dari syi\'ar Allah, kamu memperoleh kebaikan yang banyak padanya.',
    surah: 'QS. Al-Hajj (22): 36',
  },
  {
    type: 'ayat',
    arab: 'لَنْ يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِنْ يَنَالُهُ التَّقْوَىٰ مِنْكُمْ',
    arti: 'Daging-daging unta dan darahnya itu sekali-kali tidak dapat mencapai (keridhaan) Allah, tetapi ketakwaan dari kamulah yang dapat mencapainya.',
    surah: 'QS. Al-Hajj (22): 37',
  },
  {
    type: 'hadits',
    arab: 'مَا عَمِلَ ابْنُ آدَمَ يَوْمَ النَّحْرِ عَمَلاً أَحَبَّ إِلَى اللَّهِ عَزَّ وَجَلَّ مِنْ هِرَاقَةِ دَمٍ',
    arti: 'Tidak ada amalan yang dilakukan anak Adam pada hari Nahr (Idul Adha) yang lebih dicintai Allah daripada mengalirkan darah (berqurban).',
    sumber: 'HR. Tirmidzi & Ibnu Majah',
  },
  {
    type: 'hadits',
    arab: 'عَنْ عَائِشَةَ أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: مَا عَمِلَ آدَمِيٌّ مِنْ عَمَلٍ يَوْمَ النَّحْرِ أَحَبَّ إِلَى اللَّهِ مِنْ إِهْرَاقِ الدَّمِ',
    arti: 'Dari Aisyah RA, Rasulullah SAW bersabda: Tidak ada suatu amalan yang dilakukan oleh manusia pada hari Nahr yang lebih dicintai Allah selain menyembelih hewan qurban.',
    sumber: 'HR. Al-Hakim',
  },
  {
    type: 'hadits',
    arab: 'إِنَّهَا لَتَأْتِي يَوْمَ الْقِيَامَةِ بِقُرُونِهَا وَأَشْعَارِهَا وَأَظْلَافِهَا وَإِنَّ الدَّمَ لَيَقَعُ مِنْ اللَّهِ بِمَكَانٍ قَبْلَ أَنْ يَقَعَ مِنْ الْأَرْضِ',
    arti: 'Sesungguhnya hewan qurban itu akan datang pada hari Kiamat dengan tanduk, bulu, dan kuku-kukunya. Dan sesungguhnya darahnya telah sampai di sisi Allah sebelum jatuh ke tanah.',
    sumber: 'HR. Tirmidzi & Ibnu Majah',
  },
]

function parseRp(val: string): number {
  if (!val) return 0
  return parseInt(val.replace(/[^0-9]/g, ''), 10) || 0
}

function formatRp(n: number): string {
  return n.toLocaleString('id-ID')
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [pengqurban, setPengqurban] = useState<Pengqurban[]>([])
  const [realisasi, setRealisasi] = useState<Realisasi[]>([])
  const [fotoList, setFotoList] = useState<string[]>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const [wahyuIdx, setWahyuIdx] = useState(0)

  useEffect(() => {
    fetch('/api/pengqurban').then(r => r.json()).then(d => Array.isArray(d) && setPengqurban(d)).catch(() => {})
    fetch('/api/realisasi').then(r => r.json()).then(d => Array.isArray(d) && setRealisasi(d)).catch(() => {})
    fetch('/api/foto').then(r => r.json()).then(d => Array.isArray(d) && setFotoList(d)).catch(() => {})
  }, [])

  // Auto-rotate ayat & hadits
  useEffect(() => {
    const timer = setInterval(() => {
      setWahyuIdx(prev => (prev + 1) % wahyuList.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const navItems: { key: Page; label: string }[] = [
    { key: 'home', label: '🏠 Beranda' },
    { key: 'dokumentasi', label: '📸 Dokumentasi' },
    { key: 'realisasi', label: '💰 Realisasi' },
  ]

  return (
    <div className="app">
      {/* ── Background Effects ── */}
      <div className="grid-overlay" />
      <div className="ambient-orb cyan" />
      <div className="ambient-orb gold" />
      <div className="ambient-orb purple" />
      <div className="scanlines" />

      {/* ── Header ── */}
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>🕌 Laporan Qurban 1447 H</h1>
            <p className="header-subtitle">Mushalla As Salaam</p>
          </div>
          <nav className="nav">
            {navItems.map(item => (
              <button
                key={item.key}
                className={`nav-btn ${page === item.key ? 'active' : ''}`}
                onClick={() => setPage(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main">
        {page === 'home' && (
          <HomePage
            wahyuIdx={wahyuIdx}
            setWahyuIdx={setWahyuIdx}
            pengqurban={pengqurban}
            realisasi={realisasi}
          />
        )}
        {page === 'dokumentasi' && (
          <DokumentasiPage
            fotoList={fotoList}
            slideIndex={slideIndex}
            setSlideIndex={setSlideIndex}
          />
        )}
        {page === 'realisasi' && (
          <RealisasiPage pengqurban={pengqurban} realisasi={realisasi} />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} — dibuat oleh{' '}
          <a href="https://ikanx101.com" target="_blank" rel="noopener noreferrer">ikanx101.com</a>
        </p>
      </footer>
    </div>
  )
}

/* ================================================================
   HOME PAGE
   ================================================================ */
function HomePage({
  wahyuIdx,
  setWahyuIdx,
  pengqurban,
  realisasi,
}: {
  wahyuIdx: number
  setWahyuIdx: (n: number) => void
  pengqurban: Pengqurban[]
  realisasi: Realisasi[]
}) {
  const item = wahyuList[wahyuIdx]

  const transaksi = realisasi.filter(r => r.No !== 'SALDO')
  const totalPemasukan = transaksi.reduce((sum, r) => sum + parseRp(r.Pemasukan), 0)
  const totalPengeluaran = transaksi.reduce((sum, r) => sum + parseRp(r.Pengeluaran), 0)
  const saldo = totalPemasukan - totalPengeluaran
  const jumlahPengqurban = pengqurban.length

  const stats = [
    { label: 'Pengqurban', value: String(jumlahPengqurban), icon: '👥', variant: '' },
    { label: 'Total Pemasukan', value: `Rp${formatRp(totalPemasukan)}`, icon: '📥', variant: 'income' },
    { label: 'Total Pengeluaran', value: `Rp${formatRp(totalPengeluaran)}`, icon: '📤', variant: 'expense' },
    { label: 'Saldo Akhir', value: `Rp${formatRp(saldo)}`, icon: '💰', variant: 'saldo' },
  ]

  return (
    <div className="page home-page">

      {/* ── Hero ── */}
      <section className="hero-section">
        {/* Glow backdrop */}
        <div className="hero-glow" />

        {/* Decorative ornament */}
        <div className="hero-ornament" aria-hidden="true">
          <div className="ornament-ring outer" />
          <div className="ornament-ring middle" />
          <div className="ornament-ring inner" />
          <span className="ornament-star">✦</span>
        </div>

        {/* Bismillah */}
        <p className="hero-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>

        {/* Decorative divider */}
        <div className="hero-divider">
          <span className="divider-line" />
          <span className="divider-gem">◆</span>
          <span className="divider-line" />
        </div>

        {/* Main title */}
        <h1 className="hero-title">
          <span className="hero-title-main">LAPORAN QURBAN</span>
          <span className="hero-title-year">1447 H</span>
        </h1>

        <p className="hero-mosque">✦ &nbsp; Mushalla As Salaam &nbsp; ✦</p>

        {/* Decorative divider bottom */}
        <div className="hero-divider gold">
          <span className="divider-line" />
          <span className="divider-gem gold">❋</span>
          <span className="divider-line" />
        </div>

        <p className="hero-desc">
          Laporan keuangan dan dokumentasi pelaksanaan pemotongan hewan qurban
        </p>

        {/* Corner accents */}
        <span className="hero-corner tl" aria-hidden="true" />
        <span className="hero-corner tr" aria-hidden="true" />
        <span className="hero-corner bl" aria-hidden="true" />
        <span className="hero-corner br" aria-hidden="true" />
      </section>

      {/* ── Stats Grid ── */}
      <section className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className={`stat-card ${s.variant}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Wahyu Carousel ── */}
      <section className="wahyu-carousel">
        <div className="carousel-glow" />
        <div className="carousel-badge">
          {item.type === 'ayat' ? '📖 Ayat Al-Qur\'an' : '📜 Hadits Rasulullah'}
        </div>
        <div key={wahyuIdx} className="carousel-content fade-slide-in">
          <p className="carousel-arab">{item.arab}</p>
          <p className="carousel-arti">{item.arti}</p>
          <p className="carousel-sumber">
            {'surah' in item ? item.surah : `— ${(item as HaditsItem).sumber}`}
          </p>
        </div>
        <div className="carousel-dots">
          {wahyuList.map((_, i) => (
            <span
              key={i}
              className={`cdot ${i === wahyuIdx ? 'active' : ''}`}
              onClick={() => setWahyuIdx(i)}
            />
          ))}
        </div>
      </section>

    </div>
  )
}

/* ================================================================
   DOKUMENTASI PAGE
   ================================================================ */
function DokumentasiPage({
  fotoList,
  slideIndex,
  setSlideIndex,
}: {
  fotoList: string[]
  slideIndex: number
  setSlideIndex: (n: number) => void
}) {
  if (fotoList.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>📸 Belum ada foto dokumentasi.</p>
          <p>Tambahkan foto ke folder <code>foto/</code> untuk ditampilkan.</p>
        </div>
      </div>
    )
  }

  const prev = () => setSlideIndex((slideIndex - 1 + fotoList.length) % fotoList.length)
  const next = () => setSlideIndex((slideIndex + 1) % fotoList.length)

  return (
    <div className="page dokumentasi-page">
      <h2 className="page-title futuristic-title">
        <span className="title-line" />
        <span>📸 Dokumentasi Pemotongan Qurban</span>
        <span className="title-line" />
      </h2>

      <div className="slideshow-container">
        <button className="slide-btn prev" onClick={prev}>&#10094;</button>
        <div className="slide-wrapper">
          <img
            src={fotoList[slideIndex]}
            alt={`Dokumentasi ${slideIndex + 1}`}
            className="slide-img"
          />
        </div>
        <button className="slide-btn next" onClick={next}>&#10095;</button>
      </div>

      <div className="slide-dots">
        {fotoList.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === slideIndex ? 'active' : ''}`}
            onClick={() => setSlideIndex(i)}
          />
        ))}
      </div>
      <p className="slide-counter">{slideIndex + 1} / {fotoList.length}</p>
    </div>
  )
}

/* ================================================================
   REALISASI PAGE
   ================================================================ */
function RealisasiPage({
  pengqurban,
  realisasi,
}: {
  pengqurban: Pengqurban[]
  realisasi: Realisasi[]
}) {
  const transaksi = realisasi.filter(r => r.No !== 'SALDO')
  const totalPemasukan = transaksi.reduce((sum, r) => sum + parseRp(r.Pemasukan), 0)
  const totalPengeluaran = transaksi.reduce((sum, r) => sum + parseRp(r.Pengeluaran), 0)
  const saldo = totalPemasukan - totalPengeluaran

  return (
    <div className="page realisasi-page">
      {/* ── Data Pengqurban ── */}
      <section className="section">
        <h3 className="section-title futuristic-title">
          <span className="title-line" />
          <span>👥 Data Pengqurban</span>
          <span className="title-line" />
        </h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Keterangan</th>
                <th>Nama</th>
                <th>Alamat</th>
              </tr>
            </thead>
            <tbody>
              {pengqurban.map(p => (
                <tr key={p.No}>
                  <td>{p.No}</td>
                  <td>{p.Keterangan}</td>
                  <td>{p.Nama}</td>
                  <td>{p.Alamat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Realisasi Keuangan ── */}
      <section className="section">
        <h3 className="section-title futuristic-title">
          <span className="title-line" />
          <span>💰 Realisasi Keuangan</span>
          <span className="title-line" />
        </h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Pemasukan (Rp)</th>
                <th>Pengeluaran (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.map(r => (
                <tr key={r.No}>
                  <td>{r.No}</td>
                  <td>{r.Tanggal || '-'}</td>
                  <td>{r.Keterangan}</td>
                  <td className="amount income">{r.Pemasukan || '-'}</td>
                  <td className="amount expense">{r.Pengeluaran || '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="saldo-row">
                <td colSpan={3}><strong>Total</strong></td>
                <td className="amount income"><strong>Rp{formatRp(totalPemasukan)}</strong></td>
                <td className="amount expense"><strong>Rp{formatRp(totalPengeluaran)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="saldo-badge">
          💰 Saldo akhir:{' '}
          <span className="saldo-glowing">Rp{formatRp(saldo)}</span>
        </div>
      </section>
    </div>
  )
}
