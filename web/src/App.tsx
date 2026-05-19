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

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [pengqurban, setPengqurban] = useState<Pengqurban[]>([])
  const [realisasi, setRealisasi] = useState<Realisasi[]>([])
  const [fotoList, setFotoList] = useState<string[]>([])
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    fetch('/api/pengqurban').then(r => r.json()).then(setPengqurban)
    fetch('/api/realisasi').then(r => r.json()).then(setRealisasi)
    fetch('/api/foto').then(r => r.json()).then(setFotoList)
  }, [])

  useEffect(() => {
    if (fotoList.length === 0) return
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % fotoList.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [fotoList])

  const navItems: { key: Page; label: string }[] = [
    { key: 'home', label: 'Beranda' },
    { key: 'dokumentasi', label: 'Dokumentasi' },
    { key: 'realisasi', label: 'Realisasi' },
  ]

  return (
    <div className="app">
      {/* Header */}
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

      {/* Main Content */}
      <main className="main">
        {page === 'home' && <HomePage />}
        {page === 'dokumentasi' && (
          <DokumentasiPage
            fotoList={fotoList}
            slideIndex={slideIndex}
            setSlideIndex={setSlideIndex}
          />
        )}
        {page === 'realisasi' && (
          <RealisasiPage
            pengqurban={pengqurban}
            realisasi={realisasi}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} — dibuat oleh <a href="https://ikanx101.com" target="_blank" rel="noopener noreferrer">ikanx101.com</a></p>
      </footer>
    </div>
  )
}

/* ========== HOME PAGE ========== */
function HomePage() {
  const verses = [
    {
      arab: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      arti: "Maka dirikanlah shalat karena Tuhanmu; dan berqurbanlah (an-Nahr).",
      surah: "QS. Al-Kautsar (108): 2",
    },
    {
      arab: "وَالْبُدْنَ جَعَلْنَاهَا لَكُمْ مِنْ شَعَائِرِ اللَّهِ لَكُمْ فِيهَا خَيْرٌ",
      arti: "Dan telah Kami jadikan untuk kamu unta-unta itu sebagian dari syi'ar Allah, kamu memperoleh kebaikan yang banyak padanya.",
      surah: "QS. Al-Hajj (22): 36",
    },
    {
      arab: "لَنْ يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِنْ يَنَالُهُ التَّقْوَىٰ مِنْكُمْ",
      arti: "Daging-daging unta dan darahnya itu sekali-kali tidak dapat mencapai (keridhaan) Allah, tetapi ketakwaan dari kamulah yang dapat mencapainya.",
      surah: "QS. Al-Hajj (22): 37",
    },
  ]

  const hadits = [
    {
      text: "مَا عَمِلَ ابْنُ آدَمَ يَوْمَ النَّحْرِ عَمَلاً أَحَبَّ إِلَى اللَّهِ عَزَّ وَجَلَّ مِنْ هِرَاقَةِ دَمٍ",
      arti: "Tidak ada amalan yang dilakukan anak Adam pada hari Nahr (Idul Adha) yang lebih dicintai Allah daripada mengalirkan darah (berqurban).",
      sumber: "HR. Tirmidzi & Ibnu Majah",
    },
    {
      text: "عَنْ عَائِشَةَ أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: مَا عَمِلَ آدَمِيٌّ مِنْ عَمَلٍ يَوْمَ النَّحْرِ أَحَبَّ إِلَى اللَّهِ مِنْ إِهْرَاقِ الدَّمِ",
      arti: "Dari Aisyah RA, Rasulullah SAW bersabda: Tidak ada suatu amalan yang dilakukan oleh manusia pada hari Nahr yang lebih dicintai Allah selain menyembelih hewan qurban.",
      sumber: "HR. Al-Hakim",
    },
    {
      text: "إِنَّهَا لَتَأْتِي يَوْمَ الْقِيَامَةِ بِقُرُونِهَا وَأَشْعَارِهَا وَأَظْلَافِهَا وَإِنَّ الدَّمَ لَيَقَعُ مِنْ اللَّهِ بِمَكَانٍ قَبْلَ أَنْ يَقَعَ مِنْ الْأَرْضِ",
      arti: "Sesungguhnya hewan qurban itu akan datang pada hari Kiamat dengan tanduk, bulu, dan kuku-kukunya. Dan sesungguhnya darahnya telah sampai di sisi Allah sebelum jatuh ke tanah.",
      sumber: "HR. Tirmidzi & Ibnu Majah",
    },
  ]

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-overlay">
          <h2>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h2>
          <p>
            Laporan keuangan dan dokumentasi pelaksanaan pemotongan hewan qurban
            Mushalla As Salaam tahun 1447 H.
          </p>
        </div>
      </section>

      <section className="section">
        <h3 className="section-title">📖 Ayat-Ayat Al-Qur'an tentang Qurban</h3>
        <div className="verses-grid">
          {verses.map((v, i) => (
            <div key={i} className="verse-card">
              <p className="arabic">{v.arab}</p>
              <p className="arti">{v.arti}</p>
              <p className="surah">{v.surah}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3 className="section-title">📜 Hadits-Hadits tentang Qurban</h3>
        <div className="hadits-list">
          {hadits.map((h, i) => (
            <div key={i} className="hadits-card">
              <p className="arabic">{h.text}</p>
              <p className="arti">{h.arti}</p>
              <p className="sumber">— {h.sumber}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ========== DOKUMENTASI PAGE ========== */
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
      <h2 className="page-title">📸 Dokumentasi Pemotongan Qurban</h2>

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

/* ========== REALISASI PAGE ========== */
function parseRp(val: string): number {
  if (!val) return 0
  return parseInt(val.replace(/[^0-9]/g, ''), 10) || 0
}

function formatRp(n: number): string {
  return n.toLocaleString('id-ID')
}

function RealisasiPage({
  pengqurban,
  realisasi,
}: {
  pengqurban: Pengqurban[]
  realisasi: Realisasi[]
}) {
  // Hitung total dari row transaksi (exclude baris SALDO)
  const transaksi = realisasi.filter(r => r.No !== 'SALDO')
  const totalPemasukan = transaksi.reduce((sum, r) => sum + parseRp(r.Pemasukan), 0)
  const totalPengeluaran = transaksi.reduce((sum, r) => sum + parseRp(r.Pengeluaran), 0)
  const saldo = totalPemasukan - totalPengeluaran

  return (
    <div className="page realisasi-page">
      {/* Tabel Pengqurban */}
      <section className="section">
        <h3 className="section-title">👥 Data Pengqurban</h3>
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

      {/* Tabel Realisasi */}
      <section className="section">
        <h3 className="section-title">💰 Realisasi Keuangan</h3>
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
          💰 Saldo akhir: <strong>Rp{formatRp(saldo)}</strong>
        </div>
      </section>
    </div>
  )
}
