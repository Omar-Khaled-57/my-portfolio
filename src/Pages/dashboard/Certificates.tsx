import { useEffect, useState, useCallback } from 'react'
import { supabase } from "../../supabase"
import { Award, Upload, Trash2, ImageIcon, Plus, ArrowUp, ArrowDown } from 'lucide-react'
import type { ChangeEvent, DragEvent } from "react"
import { useI18n } from "../../i18n"
import { useDragOrder } from "../../hooks/useDragOrder"
import DashboardCard from "../../components/dashboard/DashboardCard"
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton"
import DragGrid from "../../components/dashboard/DragGrid"
import Swal from "sweetalert2"
import type { Certificate } from "../../types"
import { errMessage } from "../../types"

const CertCard = ({
  cert,
  index,
  total,
  onDelete,
  onMove,
}: {
  cert: Certificate
  index: number
  total: number
  onDelete: (id: string) => void
  onMove: (targetIndex: number) => void
}) => {
  const { t } = useI18n()
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500" />
      <div className="relative bg-secondary border border-primary rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
        {!imgLoaded && (
          <div className="w-full aspect-[16/11.5] bg-primary/20 animate-pulse" />
        )}
        <img
          src={cert.img}
          alt={t("certificate.alt")}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
          className={`w-full aspect-[16/11.5] object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'block' : 'hidden'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-end p-3 gap-1.5">
            <button
              onClick={() => onDelete(cert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs w-full justify-center hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> {t("common.delete")}
            </button>
            <div className="flex items-center gap-1.5 w-full">
              <button
                onClick={() => onMove(index - 1)}
                disabled={index === 0}
                aria-label={t("dashboard.toolMoveUp")}
                title={t("dashboard.toolMoveUp")}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/80 text-xs hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => onMove(index + 1)}
                disabled={index === total - 1}
                aria-label={t("dashboard.toolMoveDown")}
                title={t("dashboard.toolMoveDown")}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white/80 text-xs hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default function Certificates() {
  const { t } = useI18n()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchCerts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    setCerts((data || []) as unknown as Certificate[])
    setLoading(false)
  }, [])

  const { reorder } = useDragOrder({
    items: certs,
    setItems: setCerts,
    table: "certificates",
    orderField: "sort_order",
    onSaved: fetchCerts,
  })

  useEffect(() => { fetchCerts() }, [fetchCerts])

  const handleFile = (f: File | null | undefined) => {
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
      const maxOrder = certs.reduce((m, cert) => Math.max(m, cert.sort_order || 0), 0)
      const { error: insertError } = await supabase.from('certificates').insert({
        img: data.publicUrl,
        sort_order: maxOrder + 1,
      })
      if (insertError) throw insertError

      Swal.fire({
        icon: 'success',
        title: t("common.uploaded"),
        timer: 1500,
        showConfirmButton: false,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      })

      setFile(null); setPreview(null)
      fetchCerts()
    } catch (error: unknown) {
      console.error("Error uploading certificate:", error)
      Swal.fire({
        icon: 'error',
        title: t("common.uploadFailed"),
        text: errMessage(error),
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      })
    } finally {
      setUploading(false)
    }
  }

  const deleteCert = async (id: string) => {
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
    })

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('certificates').delete().eq('id', id)
        if (error) throw error

        Swal.fire({
          icon: 'success',
          title: t("common.deleted"),
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        })
        fetchCerts()
      } catch (error: unknown) {
        Swal.fire({
          icon: 'error',
          title: t("common.errorTitle"),
          text: errMessage(error),
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        })
      }
    }
  }

  const handleMove = (certId: string) => (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= certs.length) return
    const targetId = certs[targetIndex].id
    if (targetId === certId) return
    const next = [...certs]
    const idx = next.findIndex((cert) => cert.id === certId)
    next.splice(idx, 1)
    next.splice(targetIndex, 0, certs[idx])
    reorder(next, certs)
  }

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
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
      <DashboardCard>
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Plus className="w-4 h-4 text-accent-primary" /> {t("dashboard.uploadCertificate")}
          </h2>

          <label
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
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
            <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
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
      </DashboardCard>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <DashboardSkeleton key={i} variant="certificate" />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <DashboardCard>
          <div className="p-16 text-center">
            <Award className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t("dashboard.noCertificates")}</p>
          </div>
        </DashboardCard>
      ) : (
        <DragGrid
            items={certs}
            onReorder={(next) => reorder(next, certs)}
            className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
          >
            {(cert, index) => (
              <CertCard
                cert={cert}
                index={index}
                total={certs.length}
                onDelete={deleteCert}
                onMove={handleMove(cert.id)}
              />
            )}
          </DragGrid>
      )}
    </div>
  )
}