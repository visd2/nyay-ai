import { Copy, Download, MapPin, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DraftCard({ draft }) {
  if (!draft) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(draft.draft_text)
    toast.success('Draft copied!')
  }

  const handleDownload = () => {
    const blob = new Blob([draft.draft_text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nyay-ai-${draft.draft_type}-draft.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Draft text */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-200">📄 Generated Draft</h3>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary text-xs flex items-center gap-1 px-3 py-1.5">
              <Copy size={13} /> Copy
            </button>
            <button onClick={handleDownload} className="btn-primary text-xs flex items-center gap-1 px-3 py-1.5">
              <Download size={13} /> Download
            </button>
          </div>
        </div>
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-hindi leading-relaxed bg-slate-900/50 rounded-xl p-4 max-h-96 overflow-y-auto">
          {draft.draft_text}
        </pre>
        <p className="text-xs text-amber-400 mt-3">
          ⚠️ {draft.disclaimer}
        </p>
      </div>

      {/* Metadata row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Where to submit */}
        {draft.where_to_submit && (
          <div className="card">
            <p className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <MapPin size={12} /> कहाँ submit करें
            </p>
            <p className="text-sm text-orange-400 font-medium">{draft.where_to_submit}</p>
          </div>
        )}

        {/* Relevant laws */}
        {draft.relevant_laws?.length > 0 && (
          <div className="card">
            <p className="text-xs font-semibold text-slate-400 mb-1.5">📋 Relevant Laws</p>
            <div className="flex flex-wrap gap-1.5">
              {draft.relevant_laws.map((law, i) => (
                <span key={i} className="text-xs bg-law-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-md">
                  {law}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      {draft.tips?.length > 0 && (
        <div className="card">
          <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
            <Lightbulb size={12} className="text-yellow-400" /> Important Tips
          </p>
          <ul className="space-y-1.5">
            {draft.tips.map((tip, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-yellow-400 shrink-0">→</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
