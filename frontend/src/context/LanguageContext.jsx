import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => useContext(LanguageContext)

// ── Saara UI text yahan hai ────────────────────────────────
export const T = {
  hi: {
    // Navbar
    legalChat:    'कानूनी चैट',
    draft:        'ड्राफ्ट',
    riskCheck:    'जोखिम जाँच',
    about:        'जानकारी',

    // Home
    homePill:     'भारत का मुफ़्त AI कानूनी सहायक',
    homeH1a:      'अपना',
    homeH1b:      'कानूनी हक',
    homeH1c:      'जानो — AI से',
    homeSub:      'बिना lawyer के basic legal guidance। हर जवाब में law section + source reference।',
    homeBtn1:     'कानूनी सवाल पूछो',
    homeBtn2:     'ड्राफ्ट बनाओ',
    stat1:        'कानूनी धाराएं',
    stat2:        'ड्राफ्ट प्रकार',
    stat3:        'भाषाएं',
    stat4:        'हमेशा के लिए',
    featuresHead: 'क्या-क्या कर सकते हो?',
    featuresSub:  'तीन powerful tools, एक platform पर',
    howHead:      'यह कैसे काम करता है?',
    step1t:       'सवाल पूछो',
    step1d:       'Hindi या English में type करो या बोलो',
    step2t:       'AI ढूंढता है',
    step2d:       'India Code से relevant law sections retrieve होते हैं',
    step3t:       'Proof मिलता है',
    step3d:       'Section number + source के साथ accurate answer',
    disclaimer:   'Nyay AI एक legal information assistant है — lawyer नहीं। गंभीर matters में qualified lawyer से मिलें।',
    freeAid:      'Free legal aid:',

    // Features
    feat1t:  'कानूनी चैट',
    feat1hi: 'कानूनी सहायता',
    feat1d:  'Law section reference के साथ हर legal सवाल का जवाब।',
    feat2t:  'ड्राफ्ट जनरेटर',
    feat2hi: 'ड्राफ्ट बनाएं',
    feat2d:  'FIR, complaint, legal notice — एक click में तैयार।',
    feat3t:  'जोखिम जाँच',
    feat3hi: 'जोखिम जाँच',
    feat3d:  'Message भेजने से पहले legal risk check करो।',
    useNow:  'अभी उपयोग करें',

    // Chat
    chatTitle:   'कानूनी चैट सहायक',
    chatSub:     'बोलकर या लिखकर पूछें — जवाब सुनें भी',
    chatPlaceholder: 'लिखें या 🎤 बोलकर पूछें...',
    chatDisclaimer: '⚖️ यह legal information है, legal advice नहीं।',
    nextSteps:   'अगले कदम',
    refLaws:     'संदर्भित कानून',
    relevance:   'प्रासंगिकता',
    welcome:     '**नमस्ते! मैं Nyay AI हूँ।** 🏛️\n\nआपका कोई भी legal सवाल पूछिए — applicable law sections और next steps के साथ जवाब मिलेगा।\n\n*भाषा बदलने के लिए ऊपर toggle करें। 🔊 सुनें से जवाब सुनें।*',
    quick: [
      'Salary नहीं मिला 2 महीने से?',
      'Online fraud हुआ, क्या करें?',
      'घर से निकाला जा रहा हूँ?',
      'FIR लिखने से police मना कर रही है?',
      'Consumer complaint कैसे करें?',
    ],
    speak:       '🔊 सुनें',
    stop:        'बंद करो',
    send:        'भेजें',
    typing:      'टाइप हो रहा है...',
    error:       '❌ Error आई। कृपया दोबारा try करें।',

    // Draft
    draftTitle:  'ड्राफ्ट जनरेटर',
    draftSub:    'Legal document professionally तैयार करें — सभी जरूरी details भरें',
    step1label:  'Document type चुनें',
    step2label:  'Details भरें',
    required:    'जरूरी fields',
    filled:      'भरे',
    optional:    '(वैकल्पिक)',
    generateBtn: 'ड्राफ्ट Generate करें',
    generating:  'ड्राफ्ट बन रहा है...',
    fillFirst:   'सभी * fields भरें पहले',
    remaining:   'fields बाकी हैं',
    fillError:   'यह field जरूरी है',
    draftDisclaimer: 'यह draft एक template है। Submit करने से पहले lawyer से verify करायें।',

    // Risk
    riskTitle:   'जोखिम जाँच',
    riskSub:     'कोई message भेजने से पहले — type करो या बोलो — legal risk check karo',
    riskLabel:   'Text paste करें, type करें, या 🎤 बोलें:',
    riskPlaceholder: 'जो message, post, या statement आप check करना चाहते हैं...',
    riskBtn:     'जोखिम जाँचें',
    riskAnalyzing: 'जाँच हो रही है...',
    riskResult:  'विश्लेषण परिणाम:',
    riskExamples: 'Examples try करें:',
    riskHow:     'यह tool क्या करता है?',
    riskHow1:    'Type करो या बोलो — दोनों तरीके काम करते हैं',
    riskHow2:    'Text को IPC sections के साथ match करता है',
    riskHow3:    'Risk level 0–10 पर rate करता है',
    riskHow4:    'Result को आवाज़ में सुन सकते हो',
    riskHow5:    'Safer alternative suggest करता है',
    recording:   'Recording...',
    speakBtn:    'बोलें',
    ignoreAll:   'सभी सुझाव ignore करें',
    reset:       'Reset',

    // About
    aboutTitle:   'Nyay AI के बारे में',
    aboutSub:     'India में करोड़ों लोग अपने legal rights से अनजान हैं। Nyay AI उन्हें accessible, proof-based legal information देने के लिए बनाया गया है।',
    whatDoes:     'Nyay AI क्या करता है?',
    howWorks:     'यह AI कैसे काम करता है?',
    techStack:    'Tech Stack',
    freeResources:'Free Legal Aid Resources',
    footerNote:   'Nyay AI v1.0 · India के लिए बनाया · Open Source',

    // Disclaimer
    disclaimerTitle: 'कानूनी अस्वीकरण',
    disclaimerText:  'Nyay AI एक legal information assistant है — यह lawyer नहीं है। यहाँ दी गई जानकारी educational purpose के लिए है। गंभीर legal matters में किसी qualified lawyer से ज़रूर मिलें।',
    disclaimerShort: '⚖️ यह legal information है, legal advice नहीं। Serious matters में lawyer से मिलें।',
    freeAidLink:     'Free Legal Aid → NALSA',
    helpline:        'Helpline: 15100',
  },

  en: {
    // Navbar
    legalChat:    'Legal Chat',
    draft:        'Draft',
    riskCheck:    'Risk Check',
    about:        'About',

    // Home
    homePill:     "India's Free Legal AI",
    homeH1a:      'Know Your',
    homeH1b:      'Legal Rights',
    homeH1c:      'with AI',
    homeSub:      'Basic legal guidance without a lawyer. Every answer includes law section + source reference.',
    homeBtn1:     'Ask Legal Question',
    homeBtn2:     'Create Draft',
    stat1:        'Law Sections',
    stat2:        'Draft Types',
    stat3:        'Languages',
    stat4:        'Always Free',
    featuresHead: 'What Can You Do?',
    featuresSub:  'Three powerful tools, one platform',
    howHead:      'How Does It Work?',
    step1t:       'Ask a Question',
    step1d:       'Type or speak in Hindi or English',
    step2t:       'AI Searches',
    step2d:       'Retrieves relevant law sections from India Code',
    step3t:       'Get Proof',
    step3d:       'Accurate answer with section number + source',
    disclaimer:   'Nyay AI is a legal information assistant — not a lawyer. Consult a qualified lawyer for serious matters.',
    freeAid:      'Free legal aid:',

    // Features
    feat1t:  'Legal Chat',
    feat1hi: 'Legal Assistance',
    feat1d:  'Get answers to any legal question with law section references.',
    feat2t:  'Draft Generator',
    feat2hi: 'Create Drafts',
    feat2d:  'FIR, complaint, legal notice — ready in one click.',
    feat3t:  'Risk Checker',
    feat3hi: 'Risk Check',
    feat3d:  'Check legal risk before sending any message.',
    useNow:  'Use Now',

    // Chat
    chatTitle:   'Legal Chat Assistant',
    chatSub:     'Type or speak — listen to answers too',
    chatPlaceholder: 'Type or use 🎤 mic to speak...',
    chatDisclaimer: '⚖️ This is legal information, not legal advice.',
    nextSteps:   'Next Steps',
    refLaws:     'Referenced Laws',
    relevance:   'Relevance',
    welcome:     '**Namaste! I am Nyay AI.** 🏛️\n\nAsk me any legal question — I will answer with applicable law sections and next steps.\n\n*Switch language using the toggle above. Click 🔊 Listen to hear the answer.*',
    quick: [
      'My salary not paid for 2 months?',
      'I was cheated online, what to do?',
      'Police refusing to file FIR?',
      'How to file consumer complaint?',
      'Employer not giving salary slip?',
    ],
    speak:       '🔊 Listen',
    stop:        'Stop',
    send:        'Send',
    typing:      'Typing...',
    error:       '❌ An error occurred. Please try again.',

    // Draft
    draftTitle:  'Draft Generator',
    draftSub:    'Create professional legal documents — fill in all required details',
    step1label:  'Choose Document Type',
    step2label:  'Fill in Details',
    required:    'Required fields',
    filled:      'filled',
    optional:    '(optional)',
    generateBtn: 'Generate Draft',
    generating:  'Generating draft...',
    fillFirst:   'Fill all * fields first',
    remaining:   'fields remaining',
    fillError:   'This field is required',
    draftDisclaimer: 'This draft is a template. Please verify with a lawyer before submitting.',

    // Risk
    riskTitle:   'Risk Checker',
    riskSub:     'Before sending any message — type or speak — check legal risk',
    riskLabel:   'Paste text, type, or 🎤 speak:',
    riskPlaceholder: 'Enter the message, post, or statement you want to check...',
    riskBtn:     'Check Risk',
    riskAnalyzing: 'Analyzing...',
    riskResult:  'Analysis Result:',
    riskExamples: 'Try examples:',
    riskHow:     'What does this tool do?',
    riskHow1:    'Type or speak — both methods work',
    riskHow2:    'Matches text against IPC sections',
    riskHow3:    'Rates risk level from 0 to 10',
    riskHow4:    'You can listen to the result',
    riskHow5:    'Suggests a safer alternative',
    recording:   'Recording...',
    speakBtn:    'Speak',
    ignoreAll:   'Ignore all suggestions',
    reset:       'Reset',

    // About
    aboutTitle:   'About Nyay AI',
    aboutSub:     'Millions in India are unaware of their legal rights. Nyay AI was built to give them accessible, proof-based legal information.',
    whatDoes:     'What Does Nyay AI Do?',
    howWorks:     'How Does This AI Work?',
    techStack:    'Tech Stack',
    freeResources:'Free Legal Aid Resources',
    footerNote:   'Nyay AI v1.0 · Made for India · Open Source',

    // Disclaimer
    disclaimerTitle: 'Legal Disclaimer',
    disclaimerText:  'Nyay AI is a legal information assistant — not a lawyer. Information provided is for educational purposes only. Please consult a qualified lawyer for serious legal matters.',
    disclaimerShort: '⚖️ This is legal information, not legal advice. Consult a lawyer for serious matters.',
    freeAidLink:     'Free Legal Aid → NALSA',
    helpline:        'Helpline: 15100',
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('hi')
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}
