import { Scale, Shield, BookOpen, Phone, Globe, ExternalLink } from 'lucide-react'
import Disclaimer from '../components/Disclaimer'

const LEGAL_AIDS = [
  {
    name: 'NALSA – National Legal Services Authority',
    desc: 'Free legal aid for eligible citizens. Call Helpline 15100.',
    url: 'https://nalsa.gov.in',
    phone: '15100',
  },
  {
    name: 'eCourts India',
    desc: 'Track your court case status online.',
    url: 'https://ecourts.gov.in',
  },
  {
    name: 'Consumer Helpline',
    desc: 'Consumer complaints and grievances.',
    url: 'https://consumerhelpline.gov.in',
    phone: '1800-11-4000',
  },
  {
    name: 'RTI Online',
    desc: 'File Right to Information application online.',
    url: 'https://rtionline.gov.in',
  },
  {
    name: 'Tele Law',
    desc: 'Free legal advice via Common Service Centers.',
    url: 'https://tele-law.in',
    phone: '1800-419-4826',
  },
  {
    name: 'POCSO e-Box',
    desc: 'Report child sexual abuse. Ministry of WCD.',
    url: 'https://pocso.wcd.nic.in',
    phone: '1098',
  },
]

const TECH_STACK = [
  { label: 'Backend', value: 'FastAPI + Python' },
  { label: 'AI / LLM', value: 'Groq (Llama 3) + RAG' },
  { label: 'Vector DB', value: 'ChromaDB' },
  { label: 'Embeddings', value: 'Sentence Transformers' },
  { label: 'Frontend', value: 'React + Tailwind CSS' },
  { label: 'Data Source', value: 'India Code + Supreme Court' },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="text-center">
        <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Scale size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Nyay AI के बारे में</h1>
        <p className="text-slate-400 font-hindi text-sm max-w-lg mx-auto leading-relaxed">
          India में करोड़ों लोग अपने legal rights से अनजान हैं। Nyay AI उन्हें
          accessible, proof-based legal information देने के लिए बनाया गया है।
        </p>
      </div>

      {/* Disclaimer - prominent */}
      <Disclaimer />

      {/* What it does */}
      <div className="card">
        <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Shield size={18} className="text-orange-400" /> Nyay AI क्या करता है?
        </h2>
        <div className="space-y-3">
          {[
            { icon: '✅', text: 'India के laws simple Hindi/English में explain करता है' },
            { icon: '✅', text: 'हर जवाब में IPC/Act section और source reference देता है' },
            { icon: '✅', text: 'Legal drafts generate करता है — FIR, complaint, notice' },
            { icon: '✅', text: 'Messages का legal risk check करता है' },
            { icon: '✅', text: 'Voice input support (Hindi में बोल सकते हो)' },
            { icon: '❌', text: 'Legal advice नहीं देता — यह lawyer नहीं है' },
            { icon: '❌', text: 'Court में represent नहीं कर सकता' },
            { icon: '❌', text: 'Serious matters में professional lawyer replace नहीं करता' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 text-base">{icon}</span>
              <span className={`font-hindi ${icon === '❌' ? 'text-slate-500' : 'text-slate-300'}`}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How RAG works */}
      <div className="card">
        <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-400" /> यह AI कैसे काम करता है?
        </h2>
        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Data Sources',
              desc: 'India Code, Supreme Court judgments, और various Acts से law data लिया गया है।',
            },
            {
              step: '2',
              title: 'RAG System',
              desc: 'Retrieval-Augmented Generation — AI पहले database से relevant sections ढूंढता है, फिर उन्हें context में रखकर answer generate करता है।',
            },
            {
              step: '3',
              title: 'Proof-Based Answers',
              desc: 'हर answer में actual law section और source cite होता है — hallucination minimize होती है।',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-blue-400">
                {step}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{title}</p>
                <p className="text-xs text-slate-400 font-hindi mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="card">
        <h2 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Globe size={18} className="text-green-400" /> Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TECH_STACK.map(({ label, value }) => (
            <div key={label} className="bg-slate-700/50 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-semibold text-slate-200">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Free legal aid */}
      <div className="card">
        <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Phone size={18} className="text-green-400" /> Free Legal Aid Resources
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {LEGAL_AIDS.map(({ name, desc, url, phone }) => (
            <div
              key={name}
              className="bg-slate-700/40 border border-slate-600/30 rounded-xl p-3"
            >
              <p className="text-sm font-semibold text-orange-400 mb-0.5">{name}</p>
              <p className="text-xs text-slate-400 mb-2">{desc}</p>
              <div className="flex gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={11} /> Website
                </a>
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="text-xs text-green-400 hover:underline flex items-center gap-1"
                  >
                    <Phone size={11} /> {phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-600">
        Nyay AI v1.0 · Made for India · Open Source · Not affiliated with any government body
      </p>
    </div>
  )
}
