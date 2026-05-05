import { BookOpen, ExternalLink } from 'lucide-react'

export default function LegalReference({ references = [] }) {
  if (!references.length) return null

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <BookOpen size={12} /> Referenced Laws
      </p>
      {references.map((ref, i) => (
        <div
          key={i}
          className="bg-slate-700/40 border border-slate-600/30 rounded-lg px-3 py-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-orange-400">{ref.section}</p>
              <p className="text-xs text-slate-300">{ref.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{ref.summary}</p>
            </div>
            {ref.url && (
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-slate-500 hover:text-orange-400 transition-colors"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1">📚 {ref.source}</p>
        </div>
      ))}
    </div>
  )
}
