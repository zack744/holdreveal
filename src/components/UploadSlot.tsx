import { useEffect, useState } from 'react'

export default function UploadSlot({
  label,
  hint,
  file,
  onFile,
  dropLabel,
  clearLabel,
}: {
  label: string
  hint: string
  file: File | null
  onFile: (f: File | null) => void
  dropLabel: string
  clearLabel: string
}) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const u = URL.createObjectURL(file)
    setPreview(u)
    return () => URL.revokeObjectURL(u)
  }, [file])

  return (
    <label className="slot">
      <div className="slot-head">
        <span className="slot-label">{label}</span>
        <span className="slot-hint">{hint}</span>
      </div>
      <div className={`slot-body ${preview ? 'has' : ''}`}>
        {preview ? (
          <img src={preview} alt="" />
        ) : (
          <span className="slot-placeholder">{dropLabel}</span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {file && (
        <button
          type="button"
          className="linkish"
          onClick={(e) => {
            e.preventDefault()
            onFile(null)
          }}
        >
          {clearLabel}
        </button>
      )}
    </label>
  )
}
