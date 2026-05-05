import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const RISK_CONFIG = {
  safe:    { color: 'green',  icon: CheckCircle,    label: 'सुरक्षित (Safe)',        bg: 'bg-green-500/10 border-green-500/30' },
  warning: { color: 'amber',  icon: AlertTriangle,  label: 'सावधानी (Warning)',      bg: 'bg-amber-500/10 border-amber-500/30' },
  danger:  { color: 'red',    icon: XCircle,        label: 'खतरनाक (Dangerous)',     bg: 'bg-red-500/10 border-red-500/30' },
}

export default function RiskAlert({ result }) {
  if (!result) return null
  const config = RISK_CONFIG[result.category] || RISK_CONFIG.safe
  const Icon = config.icon

  return (
    <div className={`border rounded-2xl p-5 space-y-4 ${config.bg}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={20} className={`text-${config.color}-400`} />
          <span className={`font-bold text-${config.color}-400`}>{config.label}</span>
        </div>
        {/* Risk meter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Risk Level:</span>
          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                result.risk_level >= 7 ? 'bg-red-500' :
                result.risk_level >= 4 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${result.risk_level * 10}%` }}
            />
          </div>
          <span className={`text-sm font-bold text-${config.color}-400`}>
            {result.risk_level}/10
          </span>
        </div>
      </div>

      {/* Explanation */}
      {result.explanation && (
        <p className="text-sm text-slate-300">{result.explanation}</p>
      )}

      {/* Issues */}
      {result.issues_found?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-1.5">⚠️ मिली समस्याएं:</p>
          <ul className="space-y-1">
            {result.issues_found.map((issue, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-amber-400">•</span> {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Applicable sections */}
      {result.applicable_sections?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-1.5">📋 लागू धाराएं:</p>
          <div className="flex flex-wrap gap-2">
            {result.applicable_sections.map((sec, i) => (
              <span
                key={i}
                className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-md"
              >
                {sec}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Safer alternative */}
      {result.safer_alternative && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-green-400 mb-1">✅ Safe विकल्प:</p>
          <p className="text-sm text-slate-300 italic">"{result.safer_alternative}"</p>
        </div>
      )}
    </div>
  )
}
