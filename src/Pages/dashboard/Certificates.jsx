import { useEffect, useState } from 'react'
import { supabase } from "../../supabase";
import { Award, Upload, Trash2, ImageIcon, Plus } from 'lucide-react'
import { useI18n } from "../../i18n"
import Swal from "sweetalert2";

const Card = ({ children, className = '' }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative glass-card rounded-2xl h-full border border-primary strong-shadow">
      {children}
    </div>
  </div>
)

const SkeletonCard = () => (
  <div className="relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-10" />
    <div className="relative bg-secondary border border-primary rounded-2xl overflow-hidden">
      <div className="w-full aspect-[16/11.5] bg-primary/20 animate-pulse" />
    </div>
  </div>
)

const CertCard = ({ cert, onDelete }) => {
  const { t } = useI18n()
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500" />
      <div className="relative bg-secondary border border-primary rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
        {/* Skeleton shown until image loads */}
        {!imgLoaded && (
          <div className="w-full aspect-[16/11.5] bg-primary/20 animate-pulse" />
        )}
        <img
          src={cert.Img}
          alt={t("certificate.alt")}
          onLoad={() => setImgLoaded(true)}
          className={`w-full aspect-[16/11.5] object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'block' : 'hidden'}`}
        />
        {imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <button
              onClick={() => onDelete(cert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs w-full justify-center hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> {t("common.delete")}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Certificates() {
  const { t } = useI18n()
  const [certs, setCerts] = useState([])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchCerts = async () => {
    setLoading(true)
    const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false })
    setCerts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCerts() }, [])

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const uploadImage = async () => {
    if (!file) return
    try {
      setUploading(true)
      const fileName = `cert-${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('certificate-images').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('certificate-images').getPublicUrl(fileName)
      const { error: insertError } = await supabase.from('certificates').insert({ Img: data.publicUrl })
      if (insertError) throw insertError

      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        timer: 1500,
        showConfirmButton: false,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      })

      setFile(null); setPreview(null);
      fetchCerts()
    } catch (error) {
      console.error("Error uploading certificate:", error)
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.message,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      })
    } finally {
      setUploading(false)
    }
  }

  const deleteCert = async (id) => {
    const result = await Swal.fire({
      title: t("dashboard.deleteCertificateConfirm"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("common.delete"),
      cancelButtonText: t("common.cancel"),
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('certificates').delete().eq('id', id)
        if (error) throw error
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        })
        fetchCerts()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl blur opacity-50" />
          <div className="relative w-9 h-9 bg-primary rounded-xl border border-primary flex items-center justify-center">
            <Award className="w-4 h-4 text-accent-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">{t("portfolio.certificates")}</h1>
          <p className="text-secondary text-xs">
            {loading ? t('common.loading') : t('dashboard.certificatesTotal', { count: certs.length })}
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <Card>
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Plus className="w-4 h-4 text-accent-primary" /> {t("dashboard.uploadCertificate")}
          </h2>

          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
            className={`flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              dragOver ? 'border-accent-primary/60 bg-accent-primary/10' : 'border-primary bg-primary/20 hover:border-accent-primary/35 hover:bg-primary/30'
            }`}
          >
            {preview ? (
              <img src={preview} alt="preview" className="max-h-40 object-contain rounded-lg p-2" />
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="w-11 h-11 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-5 h-5 text-accent-primary" />
                </div>
                <p className="text-sm text-primary">{t("dashboard.dragUpload")}</p>
                <p className="text-xs text-secondary">{t("dashboard.imageSupport")}</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} className="hidden" />
          </label>

          {file && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-secondary truncate flex-1">{file.name}</p>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setFile(null); setPreview(null) }}
                  className="px-3 py-1.5 rounded-xl border border-primary text-secondary hover:text-primary text-xs transition-colors">
                  {t("common.clear")}
                </button>
                <button onClick={uploadImage} disabled={uploading} className="relative group/u">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl opacity-60 blur group-hover/u:opacity-100 transition duration-300" />
                  <div className="relative flex items-center gap-2 px-4 py-1.5 bg-primary rounded-xl border border-primary">
                    {uploading ? <div className="w-3.5 h-3.5 border-2 border-primary/20 border-t-accent-primary rounded-full animate-spin" /> : <Upload className="w-3.5 h-3.5 text-accent-primary" />}
                    <span className="text-xs text-primary">{uploading ? t('common.uploading') : t('common.upload')}</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Award className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t("dashboard.noCertificates")}</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {certs.map(cert => (
            <CertCard key={cert.id} cert={cert} onDelete={deleteCert} />
          ))}
        </div>
      )}
    </div>
  )
}
