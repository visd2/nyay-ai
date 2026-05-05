import ReactMarkdown from 'react-markdown'
import { Scale, User } from 'lucide-react'
import LegalReference from './LegalReference'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-slate-600' : 'bg-orange-500'
        }`}
      >
        {isUser ? <User size={16} /> : <Scale size={16} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-orange-500/90 text-white rounded-tr-sm'
              : 'bg-slate-700/80 text-slate-100 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="font-hindi">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none font-hindi">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Next steps */}
        {!isUser && message.nextSteps?.length > 0 && (
          <div className="mt-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 w-full">
            <p className="text-xs font-semibold text-green-400 mb-1.5">✅ अगले कदम:</p>
            <ul className="space-y-1">
              {message.nextSteps.map((step, i) => (
                <li key={i} className="text-xs text-slate-300 flex gap-1.5">
                  <span className="text-green-400 shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Legal references */}
        {!isUser && message.references?.length > 0 && (
          <div className="w-full">
            <LegalReference references={message.references} />
          </div>
        )}

        {/* Confidence badge */}
        {!isUser && message.confidence > 0 && (
          <p className="text-xs text-slate-600 mt-1 ml-1">
            Relevance: {Math.round(message.confidence * 100)}%
          </p>
        )}
      </div>
    </div>
  )
}
