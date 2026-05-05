import { trackEvent } from '../services/analytics'
import { useState, useEffect } from 'react'
import { FileText, Loader, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react'
import { getDraftTypes, generateDraft } from '../services/api'
import DraftCard from '../components/DraftCard'
import Disclaimer from '../components/Disclaimer'
import { useLanguage } from '../context/LanguageContext'

const DRAFT_FIELDS = {
  complaint_letter: [
    { key: 'complainant_name',    label: { hi: 'आपका पूरा नाम',            en: 'Your Full Name' },           placeholder: { hi: 'Ramesh Kumar',           en: 'Ramesh Kumar' },           required: true },
    { key: 'complainant_address', label: { hi: 'आपका पूरा पता',            en: 'Your Full Address' },        placeholder: { hi: 'Full address',           en: 'House No, Street, City' }, required: true },
    { key: 'complainant_mobile',  label: { hi: 'Mobile Number',            en: 'Mobile Number' },            placeholder: { hi: '9876543210',             en: '9876543210' },             required: true },
    { key: 'authority_name',      label: { hi: 'Authority का नाम',         en: 'Authority Name' },           placeholder: { hi: 'SP / Commissioner',      en: 'SP / Commissioner' },      required: true },
    { key: 'authority_office',    label: { hi: 'Authority का Office',      en: 'Authority Office' },         placeholder: { hi: 'SP Office, Delhi',       en: 'SP Office, Delhi' },       required: true },
    { key: 'subject',             label: { hi: 'Subject (विषय)',           en: 'Subject' },                  placeholder: { hi: 'Complaint regarding...', en: 'Complaint regarding...' }, required: true },
    { key: 'respondent_name',     label: { hi: 'जिसकी complaint है — नाम', en: 'Respondent Name' },          placeholder: { hi: 'Suresh Sharma',          en: 'Suresh Sharma' },          required: true },
    { key: 'incident_date',       label: { hi: 'घटना की तारीख',            en: 'Date of Incident' },         placeholder: { hi: '25 April 2025',          en: '25 April 2025' },          required: true },
    { key: 'incident_location',   label: { hi: 'घटना का स्थान',            en: 'Location of Incident' },     placeholder: { hi: 'XYZ Market, Delhi',      en: 'XYZ Market, Delhi' },      required: true },
    { key: 'complaint_details',   label: { hi: 'Complaint का विवरण',       en: 'Complaint Details' },        placeholder: { hi: 'Poori baat likhein...',  en: 'Describe in detail...' },  required: true, multiline: true },
    { key: 'relief_sought',       label: { hi: 'आप क्या चाहते हैं?',       en: 'Relief Sought' },            placeholder: { hi: 'FIR / Action / Refund',  en: 'FIR / Action / Refund' },  required: true },
    { key: 'complaint_date',      label: { hi: 'आज की Date',               en: "Today's Date" },             placeholder: { hi: '29 April 2025',          en: '29 April 2025' },          required: true },
  ],
  legal_notice: [
    { key: 'sender_name',         label: { hi: 'भेजने वाले का नाम',        en: 'Sender Name' },              placeholder: { hi: 'Ramesh Kumar',           en: 'Ramesh Kumar' },           required: true },
    { key: 'sender_address',      label: { hi: 'भेजने वाले का पूरा पता',   en: 'Sender Full Address' },      placeholder: { hi: 'Full address',           en: 'Full address' },           required: true },
    { key: 'sender_mobile',       label: { hi: 'Mobile Number',            en: 'Mobile Number' },            placeholder: { hi: '9876543210',             en: '9876543210' },             required: true },
    { key: 'sender_email',        label: { hi: 'Email',                    en: 'Email' },                    placeholder: { hi: 'ramesh@email.com',       en: 'ramesh@email.com' },       required: false },
    { key: 'recipient_name',      label: { hi: 'जिसे भेजना है — नाम',      en: 'Recipient Name' },           placeholder: { hi: 'Suresh Sharma',          en: 'Suresh Sharma' },          required: true },
    { key: 'recipient_address',   label: { hi: 'उसका पूरा पता',            en: 'Recipient Full Address' },   placeholder: { hi: 'Full address',           en: 'Full address' },           required: true },
    { key: 'subject',             label: { hi: 'Notice का विषय',           en: 'Notice Subject' },           placeholder: { hi: 'Non-payment of dues',    en: 'Non-payment of dues' },    required: true },
    { key: 'issue_description',   label: { hi: 'मामला क्या है?',           en: 'Issue Description' },        placeholder: { hi: 'Describe clearly...',    en: 'Describe clearly...' },    required: true, multiline: true },
    { key: 'amount_involved',     label: { hi: 'रकम (₹)',                  en: 'Amount Involved (₹)' },      placeholder: { hi: '50000',                  en: '50000' },                  required: false },
    { key: 'demand',              label: { hi: 'आप क्या चाहते हैं?',       en: 'Your Demand' },              placeholder: { hi: 'Refund / Stop action',   en: 'Refund / Stop action' },   required: true },
    { key: 'compliance_days',     label: { hi: 'कितने दिन में comply करे?', en: 'Days to Comply' },           placeholder: { hi: '15',                     en: '15' },                     required: true },
    { key: 'notice_date',         label: { hi: 'Notice की Date',           en: 'Notice Date' },              placeholder: { hi: '29 April 2025',          en: '29 April 2025' },          required: true },
    { key: 'applicable_law',      label: { hi: 'कौन सा Law (अगर पता हो)', en: 'Applicable Law (if known)' },placeholder: { hi: 'IPC Section 406',        en: 'IPC Section 406' },        required: false },
  ],
  fir_application: [
    { key: 'complainant_name',     label: { hi: 'शिकायतकर्ता का नाम',      en: 'Complainant Name' },         placeholder: { hi: 'Ramesh Kumar',           en: 'Ramesh Kumar' },           required: true },
    { key: 'complainant_address',  label: { hi: 'पूरा पता',                en: 'Full Address' },             placeholder: { hi: 'House No, Street, City', en: 'House No, Street, City' }, required: true },
    { key: 'complainant_mobile',   label: { hi: 'Mobile Number',           en: 'Mobile Number' },            placeholder: { hi: '9876543210',             en: '9876543210' },             required: true },
    { key: 'complainant_age',      label: { hi: 'आयु (Age)',               en: 'Age' },                      placeholder: { hi: '28',                     en: '28' },                     required: true },
    { key: 'father_name',          label: { hi: 'पिता का नाम',             en: "Father's Name" },            placeholder: { hi: 'Ram Kumar',              en: 'Ram Kumar' },              required: true },
    { key: 'police_station',       label: { hi: 'थाने का नाम',             en: 'Police Station' },           placeholder: { hi: 'Kotwali Police Station', en: 'Kotwali Police Station' }, required: true },
    { key: 'district',             label: { hi: 'जिला (District)',         en: 'District' },                 placeholder: { hi: 'New Delhi',              en: 'New Delhi' },              required: true },
    { key: 'incident_date',        label: { hi: 'घटना की दिनांक',          en: 'Date of Incident' },         placeholder: { hi: '25 April 2025',          en: '25 April 2025' },          required: true },
    { key: 'incident_time',        label: { hi: 'घटना का समय',             en: 'Time of Incident' },         placeholder: { hi: 'Shaam 6 baje',           en: 'Around 6 PM' },            required: true },
    { key: 'incident_location',    label: { hi: 'घटना का स्थान',           en: 'Location of Incident' },     placeholder: { hi: 'Near XYZ Market',        en: 'Near XYZ Market' },        required: true },
    { key: 'accused_name',         label: { hi: 'आरोपी का नाम',            en: 'Accused Name' },             placeholder: { hi: 'Pata nahi / Suresh',     en: 'Unknown / Suresh' },       required: true },
    { key: 'accused_address',      label: { hi: 'आरोपी का पता',            en: 'Accused Address' },          placeholder: { hi: 'Unknown / Full address', en: 'Unknown / Full address' }, required: false },
    { key: 'incident_description', label: { hi: 'घटना का पूरा विवरण',      en: 'Full Incident Description' },placeholder: { hi: 'Kya hua, kaise hua...',  en: 'What happened, how...' },  required: true, multiline: true },
    { key: 'loss_description',     label: { hi: 'नुकसान / चोट का विवरण',   en: 'Loss / Injury Description' },placeholder: { hi: 'Chori gaya saman...',    en: 'Stolen items, injuries...' },required: true },
    { key: 'witnesses',            label: { hi: 'गवाह (Witnesses)',         en: 'Witnesses' },                placeholder: { hi: 'Mohan Kumar, address',   en: 'Mohan Kumar, address' },   required: false },
    { key: 'application_date',     label: { hi: 'आवेदन की Date',           en: 'Application Date' },         placeholder: { hi: '29 April 2025',          en: '29 April 2025' },          required: true },
  ],
  consumer_complaint: [
    { key: 'complainant_name',    label: { hi: 'आपका पूरा नाम',            en: 'Your Full Name' },           placeholder: { hi: 'Ramesh Kumar',           en: 'Ramesh Kumar' },           required: true },
    { key: 'complainant_address', label: { hi: 'आपका पूरा पता',            en: 'Your Full Address' },        placeholder: { hi: 'Full address',           en: 'Full address' },           required: true },
    { key: 'complainant_mobile',  label: { hi: 'Mobile Number',            en: 'Mobile Number' },            placeholder: { hi: '9876543210',             en: '9876543210' },             required: true },
    { key: 'complainant_email',   label: { hi: 'Email',                    en: 'Email' },                    placeholder: { hi: 'ramesh@email.com',       en: 'ramesh@email.com' },       required: false },
    { key: 'company_name',        label: { hi: 'Company / Seller का नाम',  en: 'Company / Seller Name' },    placeholder: { hi: 'XYZ Electronics',        en: 'XYZ Electronics' },        required: true },
    { key: 'company_address',     label: { hi: 'Company का पता',           en: 'Company Address' },          placeholder: { hi: 'Shop / Office address',  en: 'Shop / Office address' },  required: true },
    { key: 'product_name',        label: { hi: 'Product / Service का नाम', en: 'Product / Service Name' },   placeholder: { hi: 'Samsung TV Model X2',    en: 'Samsung TV Model X2' },    required: true },
    { key: 'purchase_date',       label: { hi: 'खरीद की तारीख',            en: 'Purchase Date' },            placeholder: { hi: '1 December 2024',        en: '1 December 2024' },        required: true },
    { key: 'bill_number',         label: { hi: 'Bill / Receipt Number',    en: 'Bill / Receipt Number' },    placeholder: { hi: 'INV-2024-001',           en: 'INV-2024-001' },           required: false },
    { key: 'amount_paid',         label: { hi: 'भुगतान की राशि (₹)',        en: 'Amount Paid (₹)' },          placeholder: { hi: '35000',                  en: '35000' },                  required: true },
    { key: 'defect_description',  label: { hi: 'क्या खराबी / समस्या है?',  en: 'Defect / Issue Description' },placeholder: { hi: 'Product band ho gaya...',en: 'Product stopped working...' },required: true, multiline: true },
    { key: 'complaint_made_on',   label: { hi: 'Company को कब complaint की?',en: 'When did you complain?' }, placeholder: { hi: '10 January 2025',        en: '10 January 2025' },        required: true },
    { key: 'company_response',    label: { hi: 'Company का जवाब क्या था?', en: "Company's Response" },       placeholder: { hi: 'Koi jawab nahi',         en: 'No response received' },   required: true },
    { key: 'relief_sought',       label: { hi: 'आप क्या चाहते हैं?',       en: 'Relief Sought' },            placeholder: { hi: 'Refund / Replacement',   en: 'Refund / Replacement' },   required: true },
    { key: 'compensation_amount', label: { hi: 'Compensation (₹)',         en: 'Compensation Amount (₹)' },  placeholder: { hi: '10000',                  en: '10000' },                  required: false },
    { key: 'complaint_date',      label: { hi: 'Complaint की Date',        en: 'Complaint Date' },           placeholder: { hi: '29 April 2025',          en: '29 April 2025' },          required: true },
  ],
  salary_complaint: [
    { key: 'complainant_name',    label: { hi: 'आपका पूरा नाम',            en: 'Your Full Name' },           placeholder: { hi: 'Ramesh Kumar',           en: 'Ramesh Kumar' },           required: true },
    { key: 'complainant_address', label: { hi: 'आपका पूरा पता',            en: 'Your Full Address' },        placeholder: { hi: 'Full address',           en: 'Full address' },           required: true },
    { key: 'complainant_mobile',  label: { hi: 'Mobile Number',            en: 'Mobile Number' },            placeholder: { hi: '9876543210',             en: '9876543210' },             required: true },
    { key: 'complainant_email',   label: { hi: 'Email',                    en: 'Email' },                    placeholder: { hi: 'ramesh@email.com',       en: 'ramesh@email.com' },       required: false },
    { key: 'company_name',        label: { hi: 'Company का नाम',           en: 'Company Name' },             placeholder: { hi: 'ABC Pvt Ltd',            en: 'ABC Pvt Ltd' },            required: true },
    { key: 'company_address',     label: { hi: 'Company का पता',           en: 'Company Address' },          placeholder: { hi: 'Company full address',   en: 'Company full address' },   required: true },
    { key: 'employer_name',       label: { hi: 'Employer / HR का नाम',     en: 'Employer / HR Name' },       placeholder: { hi: 'Suresh Sharma',          en: 'Suresh Sharma' },          required: true },
    { key: 'designation',         label: { hi: 'आपकी Job Position',        en: 'Your Job Position' },        placeholder: { hi: 'Software Developer',     en: 'Software Developer' },     required: true },
    { key: 'joining_date',        label: { hi: 'Joining Date',             en: 'Joining Date' },             placeholder: { hi: '1 January 2024',         en: '1 January 2024' },         required: true },
    { key: 'monthly_salary',      label: { hi: 'Monthly Salary (₹)',       en: 'Monthly Salary (₹)' },       placeholder: { hi: '25000',                  en: '25000' },                  required: true },
    { key: 'pending_months',      label: { hi: 'कितने महीने बकाया?',       en: 'Months Pending' },           placeholder: { hi: '2',                      en: '2' },                      required: true },
    { key: 'pending_from',        label: { hi: 'कब से बकाया है?',          en: 'Pending Since' },            placeholder: { hi: 'January 2025',           en: 'January 2025' },           required: true },
    { key: 'total_amount',        label: { hi: 'कुल बकाया राशि (₹)',       en: 'Total Pending Amount (₹)' }, placeholder: { hi: '50000',                  en: '50000' },                  required: true },
    { key: 'complaint_date',      label: { hi: 'आज की Date',               en: "Today's Date" },             placeholder: { hi: '29 April 2025',          en: '29 April 2025' },          required: true },
  ],
  harassment_complaint: [
    { key: 'complainant_name',     label: { hi: 'आपका पूरा नाम',           en: 'Your Full Name' },           placeholder: { hi: 'Priya Sharma',           en: 'Priya Sharma' },           required: true },
    { key: 'complainant_address',  label: { hi: 'आपका पूरा पता',           en: 'Your Full Address' },        placeholder: { hi: 'Full address',           en: 'Full address' },           required: true },
    { key: 'complainant_mobile',   label: { hi: 'Mobile Number',           en: 'Mobile Number' },            placeholder: { hi: '9876543210',             en: '9876543210' },             required: true },
    { key: 'designation',          label: { hi: 'आपकी Job Position',       en: 'Your Job Position' },        placeholder: { hi: 'Marketing Executive',    en: 'Marketing Executive' },    required: true },
    { key: 'company_name',         label: { hi: 'Company का नाम',          en: 'Company Name' },             placeholder: { hi: 'XYZ Pvt Ltd',            en: 'XYZ Pvt Ltd' },            required: true },
    { key: 'company_address',      label: { hi: 'Company का पता',          en: 'Company Address' },          placeholder: { hi: 'Full address',           en: 'Full address' },           required: true },
    { key: 'accused_name',         label: { hi: 'आरोपी का नाम',            en: 'Accused Name' },             placeholder: { hi: 'Ramesh Kumar',           en: 'Ramesh Kumar' },           required: true },
    { key: 'accused_designation',  label: { hi: 'आरोपी की Position',       en: 'Accused Designation' },      placeholder: { hi: 'Senior Manager',         en: 'Senior Manager' },         required: true },
    { key: 'incident_dates',       label: { hi: 'घटना की तारीखें',          en: 'Dates of Incidents' },       placeholder: { hi: '10, 15 March 2025',      en: '10, 15 March 2025' },      required: true },
    { key: 'incident_description', label: { hi: 'घटना का विवरण',           en: 'Incident Description' },     placeholder: { hi: 'Kya hua, kab hua...',    en: 'What happened, when...' }, required: true, multiline: true },
    { key: 'witnesses',            label: { hi: 'गवाह (अगर हों)',           en: 'Witnesses (if any)' },       placeholder: { hi: 'Mohan Kumar',            en: 'Mohan Kumar' },            required: false },
    { key: 'evidence',             label: { hi: 'सबूत (Messages, emails)', en: 'Evidence (Messages, etc)' }, placeholder: { hi: 'WhatsApp screenshots',    en: 'WhatsApp screenshots' },   required: false },
    { key: 'icc_informed',         label: { hi: 'ICC को बताया? (हाँ/नहीं)', en: 'ICC Informed? (Yes/No)' },  placeholder: { hi: 'Nahi',                   en: 'No' },                     required: true },
    { key: 'relief_sought',        label: { hi: 'आप क्या चाहते हैं?',      en: 'Relief Sought' },            placeholder: { hi: 'Action / Transfer',      en: 'Action / Transfer' },      required: true },
    { key: 'complaint_date',       label: { hi: 'Complaint की Date',       en: 'Complaint Date' },           placeholder: { hi: '29 April 2025',          en: '29 April 2025' },          required: true },
  ],
  rent_dispute: [
    { key: 'tenant_name',          label: { hi: 'किराएदार का नाम',          en: 'Tenant Name' },              placeholder: { hi: 'Ramesh Kumar',           en: 'Ramesh Kumar' },           required: true },
    { key: 'tenant_address',       label: { hi: 'वर्तमान पता',              en: 'Current Address' },          placeholder: { hi: 'Full rental address',    en: 'Full rental address' },    required: true },
    { key: 'tenant_mobile',        label: { hi: 'Mobile Number',           en: 'Mobile Number' },            placeholder: { hi: '9876543210',             en: '9876543210' },             required: true },
    { key: 'landlord_name',        label: { hi: 'मकान मालिक का नाम',        en: 'Landlord Name' },            placeholder: { hi: 'Suresh Sharma',          en: 'Suresh Sharma' },          required: true },
    { key: 'landlord_address',     label: { hi: 'मकान मालिक का पता',        en: 'Landlord Address' },         placeholder: { hi: 'Full address',           en: 'Full address' },           required: true },
    { key: 'property_address',     label: { hi: 'Property का पता',          en: 'Property Address' },         placeholder: { hi: 'Full rental property',   en: 'Full rental property' },   required: true },
    { key: 'rent_amount',          label: { hi: 'Monthly किराया (₹)',       en: 'Monthly Rent (₹)' },         placeholder: { hi: '8000',                   en: '8000' },                   required: true },
    { key: 'rent_since',           label: { hi: 'कब से किराएदार हैं?',      en: 'Tenant Since' },             placeholder: { hi: 'January 2023',           en: 'January 2023' },           required: true },
    { key: 'agreement_type',       label: { hi: 'Agreement Type',          en: 'Agreement Type' },           placeholder: { hi: 'Written / Verbal',        en: 'Written / Verbal' },       required: true },
    { key: 'dispute_description',  label: { hi: 'विवाद क्या है?',           en: 'Dispute Description' },      placeholder: { hi: 'Deposit wapas nahi...',  en: 'Deposit not returned...' },required: true, multiline: true },
    { key: 'deposit_amount',       label: { hi: 'Security Deposit (₹)',    en: 'Security Deposit (₹)' },     placeholder: { hi: '16000',                  en: '16000' },                  required: false },
    { key: 'notice_given',         label: { hi: 'Notice दिया था?',         en: 'Was Notice Given?' },        placeholder: { hi: 'Haan 30 din / Nahi',     en: 'Yes 30 days / No' },       required: true },
    { key: 'relief_sought',        label: { hi: 'आप क्या चाहते हैं?',      en: 'Relief Sought' },            placeholder: { hi: 'Deposit wapas / Stay',   en: 'Deposit return / Stay' },  required: true },
    { key: 'complaint_date',       label: { hi: 'Application की Date',     en: 'Application Date' },         placeholder: { hi: '29 April 2025',          en: '29 April 2025' },          required: true },
  ],
}

export default function DraftGenerator() {
  const { lang, t } = useLanguage()
  const [draftTypes, setDraftTypes]     = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [formData, setFormData]         = useState({})
  const [loading, setLoading]           = useState(false)
  const [result, setResult]             = useState(null)
  const [errors, setErrors]             = useState({})
  const [submitted, setSubmitted]       = useState(false)

  useEffect(() => {
    getDraftTypes().then(setDraftTypes).catch(() => {})
  }, [])

  // Language change hone par result reset karo
  useEffect(() => {
    setResult(null)
  }, [lang])

  const fields = selectedType
    ? (DRAFT_FIELDS[selectedType.id] || [])
    : []

  const requiredFields = fields.filter(f => f.required)
  const filledRequired = requiredFields.filter(f => formData[f.key]?.trim())
  const allFilled      = filledRequired.length === requiredFields.length
  const progress       = requiredFields.length > 0
    ? Math.round((filledRequired.length / requiredFields.length) * 100)
    : 0

  const validate = () => {
    const newErrors = {}
    requiredFields.forEach(f => {
      if (!formData[f.key]?.trim()) newErrors[f.key] = t.fillError
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGenerate = async () => {
    setSubmitted(true)
    if (!validate()) return
    setLoading(true)
    setResult(null)
    try {
      const draft = await generateDraft(selectedType.id, formData, lang)
      setResult(draft)
      trackEvent('draft_generated', { type: selectedType.id, lang })
      setTimeout(() => {
        document.getElementById('draft-result')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } finally { setLoading(false) }
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setFormData({})
    setErrors({})
    setSubmitted(false)
    setResult(null)
  }

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }))
  }

  // Helper — label aur placeholder lang ke hisaab se lo
  const getL = (field, prop) =>
    typeof field[prop] === 'object' ? field[prop][lang] : field[prop]

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1rem 60px' }}>

      {/* Header */}
      <div style={{ padding: '32px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="#60a5fa" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'white', margin: 0, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {t.draftTitle}
          </h1>
        </div>
        <p style={{ color: '#475569', fontSize: '13px', fontFamily: 'Noto Sans Devanagari, sans-serif', margin: 0 }}>
          {t.draftSub}
        </p>
      </div>

      {/* Step 1 — Type Select */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: selectedType ? '#22c55e' : '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {selectedType ? '✓' : '1'}
          </div>
          <span style={{ fontWeight: 600, color: 'white', fontSize: '15px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {t.step1label}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' }}>
          {draftTypes.map(type => (
            <button key={type.id} onClick={() => handleTypeSelect(type)} style={{
              textAlign: 'left', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
              border: `1px solid ${selectedType?.id === type.id ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.07)'}`,
              background: selectedType?.id === type.id ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: selectedType?.id === type.id ? '#f97316' : '#e2e8f0', marginBottom: '3px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                {lang === 'hi' ? type.label_hi : type.label}
              </div>
              <div style={{ fontSize: '11px', color: '#475569' }}>
                {lang === 'hi' ? type.label : type.label_hi}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Form */}
      {selectedType && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>

          {/* Step header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: allFilled ? '#22c55e' : '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {allFilled ? '✓' : '2'}
              </div>
              <span style={{ fontWeight: 600, color: 'white', fontSize: '15px', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                {t.step2label}
              </span>
            </div>

            {/* Language indicator */}
            <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'Noto Sans Devanagari, sans-serif', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '5px 12px' }}>
              {lang === 'hi' ? '📝 हिंदी में draft बनेगा' : '📝 Draft will be in English'}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: '#475569', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                {t.required}: {filledRequired.length} / {requiredFields.length} {t.filled}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: allFilled ? '#22c55e' : '#f97316' }}>
                {progress}%
              </span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '999px', transition: 'all 0.4s', width: `${progress}%`, background: allFilled ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#f97316,#ea580c)' }} />
            </div>
          </div>

          {/* Form fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
            {fields.map((field) => {
              const { key, required, multiline } = field
              const label       = getL(field, 'label')
              const placeholder = getL(field, 'placeholder')
              const hasError    = submitted && errors[key]
              const isFilled    = formData[key]?.trim()

              return (
                <div key={key} style={{ gridColumn: multiline ? '1 / -1' : 'auto' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: hasError ? '#f87171' : '#94a3b8', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                    {label}
                    {required
                      ? <span style={{ color: '#f97316', fontSize: '14px' }}>*</span>
                      : <span style={{ fontSize: '10px', color: '#334155', fontWeight: 400 }}>{t.optional}</span>
                    }
                    {isFilled && !hasError && (
                      <CheckCircle size={12} color="#22c55e" style={{ marginLeft: 'auto' }} />
                    )}
                  </label>

                  {multiline ? (
                    <textarea
                      rows={3}
                      placeholder={placeholder}
                      value={formData[key] || ''}
                      onChange={e => handleChange(key, e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${hasError ? 'rgba(248,113,113,0.5)' : isFilled ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', resize: 'vertical', fontFamily: 'Noto Sans Devanagari, sans-serif', lineHeight: 1.5, outline: 'none', transition: 'border 0.2s' }}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={formData[key] || ''}
                      onChange={e => handleChange(key, e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${hasError ? 'rgba(248,113,113,0.5)' : isFilled ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'Noto Sans Devanagari, sans-serif', outline: 'none', transition: 'border 0.2s' }}
                    />
                  )}

                  {hasError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <AlertCircle size={11} color="#f87171" />
                      <span style={{ fontSize: '11px', color: '#f87171', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{errors[key]}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Warning */}
          {submitted && !allFilled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', padding: '10px 14px', marginTop: '16px' }}>
              <AlertCircle size={15} color="#f87171" />
              <span style={{ fontSize: '13px', color: '#f87171', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                {lang === 'hi'
                  ? `सभी * जरूरी fields भरें — ${requiredFields.length - filledRequired.length} ${t.remaining}`
                  : `Fill all * required fields — ${requiredFields.length - filledRequired.length} ${t.remaining}`
                }
              </span>
            </div>
          )}

          {/* Generate Button */}
          <button onClick={handleGenerate} disabled={loading} style={{ width: '100%', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', transition: 'all 0.2s', background: allFilled ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'rgba(255,255,255,0.06)', color: allFilled ? 'white' : '#475569', boxShadow: allFilled ? '0 8px 24px rgba(234,88,12,0.3)' : 'none', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            {loading
              ? <><Loader size={17} style={{ animation: 'spin 1s linear infinite' }} /> {t.generating}</>
              : allFilled
                ? <><ChevronRight size={17} /> {t.generateBtn}</>
                : <><AlertCircle size={17} /> {t.fillFirst}</>
            }
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div id="draft-result">
          <DraftCard draft={result} />
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        <Disclaimer />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
