const app = document.getElementById('app');
const toastRoot = document.getElementById('toast-root');

const translations = {
  en: {
    appName: 'Agritech Connect',
    tagline: '',
    heroBadge: 'One platform for farm, labour, market and AI help',
    heroTitle: 'Smart farming marketplace for every role.',
    heroText: 'Connect farmers, labourers and small scale consumers with direct crop sales, labour booking, live agri-store search, crop guidance, schemes and profit tracking.',
    selectRole: 'Select your role',
    login: 'Login',
    signup: 'Signup',
    logout: 'Logout',
    language: 'Language',
    dark: 'Dark',
    light: 'Light',
    profile: 'Profile',
    save: 'Save',
    update: 'Update',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone Number',
    location: 'Location',
    dashboard: 'Dashboard'
  },
  hi: {
    appName: 'एग्रीटेक कनेक्ट',
    tagline: '',
    heroBadge: 'खेती, मजदूर, बाजार और AI सहायता के लिए एक प्लेटफॉर्म',
    heroTitle: 'हर भूमिका के लिए स्मार्ट खेती मार्केटप्लेस।',
    heroText: 'किसान, मजदूर और उपभोक्ता को सीधी फसल बिक्री, मजदूर बुकिंग, लाइव एग्री स्टोर खोज, फसल मार्गदर्शन, योजनाओं और प्रॉफिट ट्रैकिंग से जोड़ें।',
    selectRole: 'अपनी भूमिका चुनें',
    login: 'लॉगिन',
    signup: 'साइनअप',
    logout: 'लॉगआउट',
    language: 'भाषा',
    dark: 'डार्क',
    light: 'लाइट',
    profile: 'प्रोफाइल',
    save: 'सेव',
    update: 'अपडेट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    phone: 'फोन नंबर',
    location: 'स्थान',
    dashboard: 'डैशबोर्ड'
  },
  kn: {
    appName: 'ಅಗ್ರಿಟೆಕ್ ಕನೆಕ್ಟ್',
    tagline: '',
    heroBadge: 'ಕೃಷಿ, ಕಾರ್ಮಿಕ, ಮಾರುಕಟ್ಟೆ ಮತ್ತು AI ಸಹಾಯಕ್ಕೆ ಒಂದೇ ವೇದಿಕೆ',
    heroTitle: 'ಪ್ರತಿ ಪಾತ್ರಕ್ಕೂ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ.',
    heroText: 'ರೈತರು, ಕಾರ್ಮಿಕರು ಮತ್ತು ಗ್ರಾಹಕರನ್ನು ನೇರ ಬೆಳೆ ಮಾರಾಟ, ಕಾರ್ಮಿಕ ಬುಕ್ಕಿಂಗ್, ಕೃಷಿ ಅಂಗಡಿ ಹುಡುಕಾಟ, ಬೆಳೆ ಮಾರ್ಗದರ್ಶನ, ಯೋಜನೆಗಳು ಮತ್ತು ಲಾಭ ಟ್ರ್ಯಾಕಿಂಗ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ.',
    selectRole: 'ನಿಮ್ಮ ಪಾತ್ರ ಆಯ್ಕೆಮಾಡಿ',
    login: 'ಲಾಗಿನ್',
    signup: 'ಸೈನ್ ಅಪ್',
    logout: 'ಲಾಗೌಟ್',
    language: 'ಭಾಷೆ',
    dark: 'ಡಾರ್ಕ್',
    light: 'ಲೈಟ್',
    profile: 'ಪ್ರೊಫೈಲ್',
    save: 'ಉಳಿಸಿ',
    update: 'ನವೀಕರಿಸಿ',
    email: 'ಇಮೇಲ್',
    password: 'ಪಾಸ್ವರ್ಡ್',
    name: 'ಹೆಸರು',
    phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    location: 'ಸ್ಥಳ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'
  }
};

const roleDetails = {
  Farmer: {
    icon: '🌾',
    title: 'Farmer',
    description: 'List crops, manage incoming deals, book labour and calculate investment profit.'
  },
  Labour: {
    icon: '🧑‍🌾',
    title: 'Labour',
    description: 'Go online, add working slots, receive bookings from farmers and track daily earnings.'
  },
  Consumer: {
    icon: '🛒',
    title: 'Small Scale Consumer',
    description: 'Buy crops directly from farmers with quantity and price negotiation.'
  }
};

const state = {
  user: JSON.parse(localStorage.getItem('agriUser') || 'null'),
  selectedRole: localStorage.getItem('agriSelectedRole') || '',
  authMode: 'login',
  activeTab: localStorage.getItem('agriActiveTab') || '',
  lang: localStorage.getItem('agriLanguage') || 'en',
  theme: localStorage.getItem('agriTheme') || 'light',
  chatOpen: false,
  farmerItems: [],
  investments: []
};


const agriKnowledge = {
  pesticides: [
    { name: 'Neem-based Bio Pesticide', use: 'Useful for sucking pests, aphids and whitefly in vegetable crops.', safety: 'Spray in evening, use gloves and avoid overuse.' },
    { name: 'Fungicide Advisory', use: 'Used when leaf spot, blight or powdery mildew symptoms are visible.', safety: 'Use only after checking crop label and agriculture officer advice.' },
    { name: 'Insect Trap / Sticky Trap', use: 'Low-cost pest monitoring for tomato, chilli, brinjal and cucurbits.', safety: 'Safe IPM method, replace traps when sticky surface is full.' }
  ],
  seeds: [
    { name: 'Certified Paddy Seeds', use: 'Best for irrigated and high rainfall fields.', tip: 'Use certified seeds and seed treatment before sowing.' },
    { name: 'Ragi / Finger Millet Seeds', use: 'Suitable for dryland and red soil regions of Karnataka.', tip: 'Good option when rainfall is limited.' },
    { name: 'Vegetable Hybrid Seeds', use: 'Tomato, chilli, brinjal, beans and gourds for local markets.', tip: 'Select based on season, market demand and water availability.' }
  ],
  soilWeather: [
    { condition: 'Black soil + medium rain', crops: 'Cotton, maize, pulses, sunflower', note: 'Good moisture holding capacity.' },
    { condition: 'Red soil + low/medium rain', crops: 'Ragi, groundnut, pulses, millets', note: 'Works well for dryland crops.' },
    { condition: 'Clay soil + high water', crops: 'Paddy, sugarcane', note: 'Needs water management and drainage.' },
    { condition: 'Loamy soil + irrigation', crops: 'Vegetables, maize, banana, flowers', note: 'Highly suitable for commercial cultivation.' }
  ]
};

const cropRules = [
  { crop: 'Paddy', soil: ['clay', 'loamy'], humidity: ['high'], rain: ['high'], water: ['canal', 'river', 'pond'], reason: 'Needs standing water, high rainfall and fertile soil.' },
  { crop: 'Ragi / Finger Millet', soil: ['red', 'sandy', 'loamy'], humidity: ['low', 'medium'], rain: ['low', 'medium'], water: ['rainfed', 'borewell'], reason: 'Strong dryland crop for Karnataka and handles lower rainfall.' },
  { crop: 'Maize', soil: ['black', 'red', 'loamy'], humidity: ['medium'], rain: ['medium'], water: ['borewell', 'canal', 'rainfed'], reason: 'Works in medium rainfall with good drainage.' },
  { crop: 'Sugarcane', soil: ['black', 'loamy', 'clay'], humidity: ['medium', 'high'], rain: ['medium', 'high'], water: ['canal', 'river', 'borewell'], reason: 'High water requirement and long crop duration.' },
  { crop: 'Groundnut', soil: ['red', 'sandy', 'loamy'], humidity: ['low', 'medium'], rain: ['low', 'medium'], water: ['rainfed', 'borewell'], reason: 'Best in well-drained sandy/red soils.' },
  { crop: 'Pulses', soil: ['red', 'black', 'loamy'], humidity: ['low', 'medium'], rain: ['low', 'medium'], water: ['rainfed', 'borewell'], reason: 'Good for low investment and improves soil nitrogen.' },
  { crop: 'Cotton', soil: ['black'], humidity: ['low', 'medium'], rain: ['medium'], water: ['rainfed', 'borewell'], reason: 'Black cotton soil stores moisture and supports cotton.' },
  { crop: 'Vegetables', soil: ['loamy', 'red'], humidity: ['medium', 'high'], rain: ['medium'], water: ['borewell', 'canal', 'drip'], reason: 'Needs regular water, nutrient management and market access.' }
];


function schemeImage(title, emoji, colorOne = '#166534', colorTwo = '#84cc16') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colorOne}"/><stop offset="1" stop-color="${colorTwo}"/></linearGradient></defs>
    <rect width="900" height="520" rx="44" fill="url(#g)"/>
    <circle cx="760" cy="90" r="120" fill="rgba(255,255,255,.16)"/>
    <circle cx="110" cy="440" r="150" fill="rgba(255,255,255,.10)"/>
    <text x="70" y="205" font-size="112" font-family="Arial">${emoji}</text>
    <text x="70" y="320" font-size="46" font-weight="800" font-family="Arial" fill="white">${title}</text>
    <text x="70" y="380" font-size="24" font-family="Arial" fill="rgba(255,255,255,.82)">Government farmer support scheme</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const karnatakaSchemes = [
  {
    id: 'crop-insurance',
    image: schemeImage('Crop Insurance', '🌦️', '#0f766e', '#38bdf8'),
    languages: {
      en: {
        name: 'Karnataka Raitha Suraksha Pradhan Mantri Fasal Bima Yojana',
        summary: 'Crop insurance support for notified crops against natural calamity, dry spell, flood, pest and disease risk.',
        profit: 'Reduces financial loss when crop yield fails. Eligible farmers can receive insurance claim support according to notified crop, area and season rules.',
        eligibility: 'Farmers cultivating notified crops in notified areas during the notified season. Loanee and non-loanee farmers can apply as per current notification.',
        documents: ['Aadhaar card', 'Bank passbook', 'Land or crop details', 'Sowing certificate if required', 'Mobile number'],
        procedure: ['Check notified crop and last date at the nearest Raitha Samparka Kendra or bank.', 'Apply through bank, CSC, insurance portal, or agriculture office.', 'Submit crop, land and bank details before the cut-off date.', 'Keep acknowledgement and track claim status after crop-loss assessment.'],
        helpline: 'Raitha Call Center: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/en'
      },
      hi: {
        name: 'कर्नाटक रैथा सुरक्षा प्रधानमंत्री फसल बीमा योजना',
        summary: 'सूचित फसलों के लिए सूखा, बाढ़, कीट, रोग और प्राकृतिक आपदा से होने वाले नुकसान पर बीमा सहायता।',
        profit: 'फसल नुकसान होने पर आर्थिक जोखिम कम होता है और नियमों के अनुसार बीमा दावा मिल सकता है।',
        eligibility: 'सूचित क्षेत्र और सूचित मौसम में सूचित फसल उगाने वाले किसान। ऋणी और गैर-ऋणी किसान वर्तमान नियमों के अनुसार आवेदन कर सकते हैं।',
        documents: ['आधार कार्ड', 'बैंक पासबुक', 'भूमि/फसल विवरण', 'आवश्यक होने पर बुवाई प्रमाणपत्र', 'मोबाइल नंबर'],
        procedure: ['नजदीकी रैथा संपर्क केंद्र या बैंक में फसल और अंतिम तिथि जांचें।', 'बैंक, CSC, बीमा पोर्टल या कृषि कार्यालय के माध्यम से आवेदन करें।', 'कट-ऑफ तारीख से पहले फसल, भूमि और बैंक विवरण जमा करें।', 'रसीद संभाल कर रखें और नुकसान आकलन के बाद दावा स्थिति देखें।'],
        helpline: 'रैथा कॉल सेंटर: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/en'
      },
      kn: {
        name: 'ಕರ್ನಾಟಕ ರೈತ ಸುರಕ್ಷಾ ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ',
        summary: 'ನೋಟಿಫೈಡ್ ಬೆಳೆಗಳಿಗೆ ಬರ, ಪ್ರವಾಹ, ಕೀಟ, ರೋಗ ಮತ್ತು ಪ್ರಕೃತಿ ವಿಕೋಪಗಳಿಂದಾಗುವ ನಷ್ಟಕ್ಕೆ ವಿಮಾ ಸಹಾಯ.',
        profit: 'ಬೆಳೆ ನಷ್ಟವಾದಾಗ ಆರ್ಥಿಕ ಅಪಾಯ ಕಡಿಮೆಯಾಗುತ್ತದೆ ಮತ್ತು ನಿಯಮಾನುಸಾರ ವಿಮಾ ಪರಿಹಾರ ಸಿಗಬಹುದು.',
        eligibility: 'ನೋಟಿಫೈಡ್ ಪ್ರದೇಶದಲ್ಲಿ ನೋಟಿಫೈಡ್ ಋತುವಿನಲ್ಲಿ ನೋಟಿಫೈಡ್ ಬೆಳೆ ಬೆಳೆದ ರೈತರು. ಸಾಲಗಾರ ಮತ್ತು ಸಾಲವಿಲ್ಲದ ರೈತರು ಪ್ರಸ್ತುತ ಅಧಿಸೂಚನೆಯ ಪ್ರಕಾರ ಅರ್ಜಿ ಹಾಕಬಹುದು.',
        documents: ['ಆಧಾರ್ ಕಾರ್ಡ್', 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್', 'ಭೂಮಿ/ಬೆಳೆ ವಿವರ', 'ಅಗತ್ಯವಿದ್ದರೆ ಬಿತ್ತನೆ ಪ್ರಮಾಣಪತ್ರ', 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'],
        procedure: ['ಹತ್ತಿರದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ ಅಥವಾ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಬೆಳೆ ಮತ್ತು ಕೊನೆಯ ದಿನಾಂಕ ಪರಿಶೀಲಿಸಿ.', 'ಬ್ಯಾಂಕ್, CSC, ವಿಮಾ ಪೋರ್ಟಲ್ ಅಥವಾ ಕೃಷಿ ಕಚೇರಿ ಮೂಲಕ ಅರ್ಜಿ ಹಾಕಿ.', 'ಕೊನೆಯ ದಿನಾಂಕದ ಮೊದಲು ಬೆಳೆ, ಭೂಮಿ ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಸಲ್ಲಿಸಿ.', 'ರಸೀದಿ ಉಳಿಸಿ ಮತ್ತು ಬೆಳೆ ನಷ್ಟ ಮೌಲ್ಯಮಾಪನದ ನಂತರ ಕ್ಲೈಮ್ ಸ್ಥಿತಿ ನೋಡಿ.'],
        helpline: 'ರೈತ ಕಾಲ್ ಸೆಂಟರ್: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/en'
      }
    }
  },
  {
    id: 'krishi-bhagya',
    image: schemeImage('Krishi Bhagya', '💧', '#1d4ed8', '#22c55e'),
    languages: {
      en: {
        name: 'Krishi Bhagya Scheme',
        summary: 'Water conservation support for farm ponds, rainwater harvesting and protective irrigation in dryland areas.',
        profit: 'Helps farmers store rainwater, reduce crop failure in dry spells and improve productivity through protective irrigation.',
        eligibility: 'Farmers selected as per Agriculture Department guidelines for the year, taluk, landholding and component availability.',
        documents: ['Aadhaar card', 'FRUITS ID if available', 'Land records / RTC', 'Bank details', 'Photos and field details if asked'],
        procedure: ['Visit Raitha Samparka Kendra or Assistant Director of Agriculture office.', 'Confirm eligibility, component and subsidy availability.', 'Submit application with land records and bank details.', 'After approval, complete the work as per technical guidelines and submit for subsidy/payment processing.'],
        helpline: 'Raitha Call Center: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/52/Krishi%20Bhagya%20Scheme/en'
      },
      hi: {
        name: 'कृषि भाग्य योजना',
        summary: 'खेत तालाब, वर्षा जल संचयन और सूखा क्षेत्रों में सुरक्षात्मक सिंचाई के लिए सहायता।',
        profit: 'वर्षा जल संग्रह, सूखे समय में फसल बचाव और उत्पादकता बढ़ाने में मदद।',
        eligibility: 'वर्ष, तालुक, भूमि और उपलब्ध घटकों के अनुसार कृषि विभाग के दिशानिर्देशों के तहत चयनित किसान।',
        documents: ['आधार कार्ड', 'FRUITS ID यदि उपलब्ध हो', 'भूमि रिकॉर्ड / RTC', 'बैंक विवरण', 'मांगे जाने पर खेत की फोटो और विवरण'],
        procedure: ['रैथा संपर्क केंद्र या सहायक कृषि निदेशक कार्यालय जाएं।', 'योग्यता, घटक और सब्सिडी उपलब्धता की पुष्टि करें।', 'भूमि रिकॉर्ड और बैंक विवरण के साथ आवेदन जमा करें।', 'अनुमोदन के बाद तकनीकी नियमों के अनुसार कार्य पूरा करें और भुगतान प्रक्रिया के लिए जमा करें।'],
        helpline: 'रैथा कॉल सेंटर: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/52/Krishi%20Bhagya%20Scheme/en'
      },
      kn: {
        name: 'ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ',
        summary: 'ಕೃಷಿ ಹೊಂಡ, ಮಳೆ ನೀರು ಸಂಗ್ರಹಣೆ ಮತ್ತು ಬರ ಪ್ರದೇಶಗಳಲ್ಲಿ ರಕ್ಷಣಾತ್ಮಕ ನೀರಾವರಿಗೆ ಸಹಾಯ.',
        profit: 'ಮಳೆ ನೀರು ಸಂಗ್ರಹಿಸಲು, ಬರ ಸಮಯದಲ್ಲಿ ಬೆಳೆ ಉಳಿಸಲು ಮತ್ತು ಉತ್ಪಾದಕತೆ ಹೆಚ್ಚಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
        eligibility: 'ಆ ವರ್ಷದ ಕೃಷಿ ಇಲಾಖೆ ಮಾರ್ಗಸೂಚಿ, ತಾಲೂಕು, ಭೂಸ್ವಾಮ್ಯ ಮತ್ತು ಲಭ್ಯ ಘಟಕಗಳ ಪ್ರಕಾರ ಆಯ್ಕೆಯಾದ ರೈತರು.',
        documents: ['ಆಧಾರ್ ಕಾರ್ಡ್', 'ಲಭ್ಯವಿದ್ದರೆ FRUITS ID', 'ಭೂ ದಾಖಲೆ / RTC', 'ಬ್ಯಾಂಕ್ ವಿವರ', 'ಅಗತ್ಯವಿದ್ದರೆ ಕ್ಷೇತ್ರದ ಫೋಟೋ ಮತ್ತು ವಿವರ'],
        procedure: ['ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ ಅಥವಾ ಸಹಾಯಕ ಕೃಷಿ ನಿರ್ದೇಶಕರ ಕಚೇರಿಗೆ ಭೇಟಿ ನೀಡಿ.', 'ಅರ್ಹತೆ, ಘಟಕ ಮತ್ತು ಅನುದಾನ ಲಭ್ಯತೆ ಪರಿಶೀಲಿಸಿ.', 'ಭೂ ದಾಖಲೆ ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳೊಂದಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.', 'ಅನುಮೋದನೆಯ ನಂತರ ತಾಂತ್ರಿಕ ಮಾರ್ಗಸೂಚಿಯಂತೆ ಕೆಲಸ ಪೂರ್ಣಗೊಳಿಸಿ ಪಾವತಿ ಪ್ರಕ್ರಿಯೆಗೆ ಸಲ್ಲಿಸಿ.'],
        helpline: 'ರೈತ ಕಾಲ್ ಸೆಂಟರ್: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/52/Krishi%20Bhagya%20Scheme/en'
      }
    }
  },
  {
    id: 'raita-siri',
    image: schemeImage('Raita Siri', '🌾', '#854d0e', '#facc15'),
    languages: {
      en: {
        name: 'Raita Siri',
        summary: 'Scheme support for millets and high nutrient value crops such as minor millets and selected nutritious crops.',
        profit: 'Encourages cultivation of nutritious crops and can provide DBT/support as per active government notification.',
        eligibility: 'Farmers cultivating notified millet or high nutrient crops when the scheme is open for the season.',
        documents: ['Aadhaar card', 'Bank passbook', 'Land/crop details', 'FRUITS ID if available', 'Mobile number'],
        procedure: ['Ask at the nearest Raitha Samparka Kendra about current season availability.', 'Register crop and farmer details as instructed.', 'Submit required documents and bank details.', 'Track DBT/support status through agriculture office or official portal.'],
        helpline: 'Raitha Call Center: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/90/Raita%20Siri/en'
      },
      hi: {
        name: 'रैता सिरी',
        summary: 'मिलेट और उच्च पोषण वाली फसलों जैसे लघु अनाज और चयनित पोषक फसलों के लिए सहायता।',
        profit: 'पोषक फसलों की खेती को बढ़ावा देता है और वर्तमान सरकारी अधिसूचना के अनुसार DBT/सहायता मिल सकती है।',
        eligibility: 'योजना खुली होने पर सूचित मिलेट या उच्च पोषण फसल उगाने वाले किसान।',
        documents: ['आधार कार्ड', 'बैंक पासबुक', 'भूमि/फसल विवरण', 'FRUITS ID यदि उपलब्ध हो', 'मोबाइल नंबर'],
        procedure: ['नजदीकी रैथा संपर्क केंद्र में वर्तमान मौसम की उपलब्धता पूछें।', 'निर्देश के अनुसार फसल और किसान विवरण पंजीकृत करें।', 'आवश्यक दस्तावेज और बैंक विवरण जमा करें।', 'कृषि कार्यालय या आधिकारिक पोर्टल से DBT स्थिति देखें।'],
        helpline: 'रैथा कॉल सेंटर: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/90/Raita%20Siri/en'
      },
      kn: {
        name: 'ರೈತ ಸಿರಿ',
        summary: 'ಸಿರಿಧಾನ್ಯಗಳು ಮತ್ತು ಹೆಚ್ಚಿನ ಪೌಷ್ಟಿಕ ಮೌಲ್ಯದ ಬೆಳೆಗಳಿಗೆ ಸರ್ಕಾರದ ಸಹಾಯ ಯೋಜನೆ.',
        profit: 'ಪೌಷ್ಟಿಕ ಬೆಳೆಗಳ ಬೆಳೆಗಾರಿಕೆಯನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ ಮತ್ತು ಪ್ರಸ್ತುತ ಅಧಿಸೂಚನೆಯ ಪ್ರಕಾರ DBT/ಸಹಾಯ ಸಿಗಬಹುದು.',
        eligibility: 'ಯೋಜನೆ ಪ್ರಸ್ತುತ ಋತುವಿನಲ್ಲಿ ತೆರೆದಿರುವಾಗ ನೋಟಿಫೈಡ್ ಸಿರಿಧಾನ್ಯ ಅಥವಾ ಪೌಷ್ಟಿಕ ಬೆಳೆ ಬೆಳೆಸುವ ರೈತರು.',
        documents: ['ಆಧಾರ್ ಕಾರ್ಡ್', 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್', 'ಭೂಮಿ/ಬೆಳೆ ವಿವರ', 'ಲಭ್ಯವಿದ್ದರೆ FRUITS ID', 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'],
        procedure: ['ಹತ್ತಿರದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರದಲ್ಲಿ ಪ್ರಸ್ತುತ ಋತುವಿನ ಲಭ್ಯತೆ ವಿಚಾರಿಸಿ.', 'ಸೂಚನೆಯಂತೆ ಬೆಳೆ ಮತ್ತು ರೈತ ವಿವರ ನೋಂದಾಯಿಸಿ.', 'ಅಗತ್ಯ ದಾಖಲೆಗಳು ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಸಲ್ಲಿಸಿ.', 'ಕೃಷಿ ಕಚೇರಿ ಅಥವಾ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಮೂಲಕ DBT ಸ್ಥಿತಿ ನೋಡಿ.'],
        helpline: 'ರೈತ ಕಾಲ್ ಸೆಂಟರ್: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/90/Raita%20Siri/en'
      }
    }
  },
  {
    id: 'pm-kisan',
    image: schemeImage('PM-KISAN', '🇮🇳', '#15803d', '#f97316'),
    languages: {
      en: {
        name: 'PM-KISAN Samman Nidhi',
        summary: 'Central government income support scheme for eligible landholding farmer families.',
        profit: 'Eligible farmers receive ₹6,000 per year in three equal instalments through Direct Benefit Transfer.',
        eligibility: 'Eligible landholding farmer families subject to exclusion rules and Aadhaar/bank/e-KYC requirements.',
        documents: ['Aadhaar card', 'Bank account details', 'Land record details', 'Mobile number', 'e-KYC completion'],
        procedure: ['Register through PM-KISAN portal, CSC, or local agriculture/revenue office.', 'Complete Aadhaar, bank and land record verification.', 'Complete e-KYC.', 'Track beneficiary status and instalments on the official portal.'],
        helpline: 'PM-KISAN: 155261 / 011-24300606',
        link: 'https://pmkisan.gov.in/'
      },
      hi: {
        name: 'पीएम-किसान सम्मान निधि',
        summary: 'योग्य भूमि धारक किसान परिवारों के लिए केंद्र सरकार की आय सहायता योजना।',
        profit: 'योग्य किसानों को DBT के माध्यम से सालाना ₹6,000 तीन किस्तों में मिलते हैं।',
        eligibility: 'भूमि धारक किसान परिवार, अपवर्जन नियमों और आधार/बैंक/e-KYC शर्तों के अनुसार।',
        documents: ['आधार कार्ड', 'बैंक खाता विवरण', 'भूमि रिकॉर्ड', 'मोबाइल नंबर', 'e-KYC पूर्ण'],
        procedure: ['PM-KISAN पोर्टल, CSC या स्थानीय कृषि/राजस्व कार्यालय से पंजीकरण करें।', 'आधार, बैंक और भूमि रिकॉर्ड सत्यापन पूरा करें।', 'e-KYC पूरा करें।', 'आधिकारिक पोर्टल पर लाभार्थी स्थिति और किस्तें देखें।'],
        helpline: 'PM-KISAN: 155261 / 011-24300606',
        link: 'https://pmkisan.gov.in/'
      },
      kn: {
        name: 'ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ',
        summary: 'ಅರ್ಹ ಭೂಸ್ವಾಮ್ಯ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ಕೇಂದ್ರ ಸರ್ಕಾರದ ಆದಾಯ ಸಹಾಯ ಯೋಜನೆ.',
        profit: 'ಅರ್ಹ ರೈತರಿಗೆ DBT ಮೂಲಕ ವರ್ಷಕ್ಕೆ ₹6,000 ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ ಸಿಗುತ್ತದೆ.',
        eligibility: 'ವಿಭಿನ್ನ ಹೊರತುಪಡಿಸುವ ನಿಯಮಗಳು ಮತ್ತು ಆಧಾರ್/ಬ್ಯಾಂಕ್/e-KYC ನಿಯಮಗಳಿಗೆ ಒಳಪಟ್ಟ ಭೂಸ್ವಾಮ್ಯ ರೈತ ಕುಟುಂಬಗಳು.',
        documents: ['ಆಧಾರ್ ಕಾರ್ಡ್', 'ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರ', 'ಭೂ ದಾಖಲೆ', 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', 'e-KYC ಪೂರ್ಣ'],
        procedure: ['PM-KISAN ಪೋರ್ಟಲ್, CSC ಅಥವಾ ಸ್ಥಳೀಯ ಕೃಷಿ/ರಾಜಸ್ವ ಕಚೇರಿ ಮೂಲಕ ನೋಂದಣಿ ಮಾಡಿ.', 'ಆಧಾರ್, ಬ್ಯಾಂಕ್ ಮತ್ತು ಭೂ ದಾಖಲೆ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಿ.', 'e-KYC ಪೂರ್ಣಗೊಳಿಸಿ.', 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಫಲಾನುಭವಿಯ ಸ್ಥಿತಿ ಮತ್ತು ಕಂತುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'],
        helpline: 'PM-KISAN: 155261 / 011-24300606',
        link: 'https://pmkisan.gov.in/'
      }
    }
  },
  {
    id: 'soil-health-card',
    image: schemeImage('Soil Health', '🧪', '#7c2d12', '#84cc16'),
    languages: {
      en: {
        name: 'Soil Health Card / Soil Health Mission',
        summary: 'Soil testing based nutrient advisory to help farmers plan fertilizer and crop management scientifically.',
        profit: 'Can reduce unnecessary fertilizer cost, improve soil fertility and guide crop selection based on soil condition.',
        eligibility: 'Farmers who submit soil sample through agriculture department or soil testing service.',
        documents: ['Farmer details', 'Field/location details', 'Soil sample', 'Mobile number'],
        procedure: ['Collect soil sample as advised by agriculture officer.', 'Submit it to soil testing centre or through department channel.', 'Receive soil health report and nutrient recommendation.', 'Apply fertilizers and crop plan according to recommendation.'],
        helpline: 'Kisan Call Center: 1800-180-1551',
        link: 'https://soilhealth.dac.gov.in/'
      },
      hi: {
        name: 'मृदा स्वास्थ्य कार्ड / सॉइल हेल्थ मिशन',
        summary: 'वैज्ञानिक तरीके से उर्वरक और फसल प्रबंधन के लिए मिट्टी जांच आधारित सलाह।',
        profit: 'अनावश्यक उर्वरक खर्च कम कर सकता है, मिट्टी की उर्वरता सुधारता है और फसल चयन में मदद करता है।',
        eligibility: 'कृषि विभाग या मिट्टी जांच सेवा के माध्यम से मिट्टी नमूना जमा करने वाले किसान।',
        documents: ['किसान विवरण', 'खेत/स्थान विवरण', 'मिट्टी नमूना', 'मोबाइल नंबर'],
        procedure: ['कृषि अधिकारी की सलाह के अनुसार मिट्टी नमूना लें।', 'मिट्टी जांच केंद्र या विभाग के माध्यम से जमा करें।', 'मृदा स्वास्थ्य रिपोर्ट और पोषक तत्व सलाह प्राप्त करें।', 'रिपोर्ट के अनुसार उर्वरक और फसल योजना अपनाएं।'],
        helpline: 'किसान कॉल सेंटर: 1800-180-1551',
        link: 'https://soilhealth.dac.gov.in/'
      },
      kn: {
        name: 'ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ / Soil Health Mission',
        summary: 'ಮಣ್ಣು ಪರೀಕ್ಷೆಯ ಆಧಾರದ ಮೇಲೆ ಗೊಬ್ಬರ ಮತ್ತು ಬೆಳೆ ನಿರ್ವಹಣೆಗೆ ವೈಜ್ಞಾನಿಕ ಸಲಹೆ.',
        profit: 'ಅನಗತ್ಯ ಗೊಬ್ಬರ ಖರ್ಚು ಕಡಿಮೆ ಮಾಡಬಹುದು, ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಸುಧಾರಿಸುತ್ತದೆ ಮತ್ತು ಬೆಳೆ ಆಯ್ಕೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
        eligibility: 'ಕೃಷಿ ಇಲಾಖೆ ಅಥವಾ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಸೇವೆ ಮೂಲಕ ಮಣ್ಣಿನ ಮಾದರಿ ಸಲ್ಲಿಸುವ ರೈತರು.',
        documents: ['ರೈತ ವಿವರ', 'ಕ್ಷೇತ್ರ/ಸ್ಥಳ ವಿವರ', 'ಮಣ್ಣಿನ ಮಾದರಿ', 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'],
        procedure: ['ಕೃಷಿ ಅಧಿಕಾರಿಯ ಸಲಹೆಯಂತೆ ಮಣ್ಣಿನ ಮಾದರಿ ತೆಗೆದುಕೊಳ್ಳಿ.', 'ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕೇಂದ್ರ ಅಥವಾ ಇಲಾಖೆ ಮೂಲಕ ಸಲ್ಲಿಸಿ.', 'ಮಣ್ಣು ಆರೋಗ್ಯ ವರದಿ ಮತ್ತು ಪೋಷಕಾಂಶ ಶಿಫಾರಸು ಪಡೆಯಿರಿ.', 'ವರದಿ ಪ್ರಕಾರ ಗೊಬ್ಬರ ಮತ್ತು ಬೆಳೆ ಯೋಜನೆ ಅನುಸರಿಸಿ.'],
        helpline: 'ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್: 1800-180-1551',
        link: 'https://soilhealth.dac.gov.in/'
      }
    }
  },
  {
    id: 'rsk',
    image: schemeImage('Raitha Samparka', '🏢', '#14532d', '#65a30d'),
    languages: {
      en: {
        name: 'Raitha Samparka Kendra Support',
        summary: 'Local agriculture extension support for crop guidance, inputs, schemes and department services.',
        profit: 'Saves time by getting local advice on seeds, fertilizers, crop protection, schemes and official procedures.',
        eligibility: 'Farmers seeking agriculture department services and crop advisory support.',
        documents: ['Farmer identity', 'Land or crop details', 'Mobile number', 'Relevant scheme documents'],
        procedure: ['Visit the nearest Raitha Samparka Kendra.', 'Explain crop, soil, input or scheme requirement.', 'Get advisory, application guidance or service link.', 'Follow up with agriculture officer for final approval/service.'],
        helpline: 'Raitha Call Center: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/en'
      },
      hi: {
        name: 'रैथा संपर्क केंद्र सहायता',
        summary: 'फसल सलाह, इनपुट, योजनाओं और कृषि विभाग सेवाओं के लिए स्थानीय सहायता।',
        profit: 'बीज, उर्वरक, फसल सुरक्षा, योजनाओं और सरकारी प्रक्रिया पर स्थानीय सलाह से समय बचता है।',
        eligibility: 'कृषि विभाग सेवाओं और फसल सलाह की जरूरत वाले किसान।',
        documents: ['किसान पहचान', 'भूमि या फसल विवरण', 'मोबाइल नंबर', 'संबंधित योजना दस्तावेज'],
        procedure: ['नजदीकी रैथा संपर्क केंद्र जाएं।', 'फसल, मिट्टी, इनपुट या योजना की जरूरत बताएं।', 'सलाह, आवेदन मार्गदर्शन या सेवा लिंक प्राप्त करें।', 'अंतिम स्वीकृति/सेवा के लिए कृषि अधिकारी से संपर्क बनाए रखें।'],
        helpline: 'रैथा कॉल सेंटर: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/en'
      },
      kn: {
        name: 'ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ ಸಹಾಯ',
        summary: 'ಬೆಳೆ ಮಾರ್ಗದರ್ಶನ, ಇನ್ಪುಟ್, ಯೋಜನೆಗಳು ಮತ್ತು ಕೃಷಿ ಇಲಾಖೆ ಸೇವೆಗಳಿಗೆ ಸ್ಥಳೀಯ ಸಹಾಯ.',
        profit: 'ಬೀಜ, ಗೊಬ್ಬರ, ಬೆಳೆ ರಕ್ಷಣೆ, ಯೋಜನೆಗಳು ಮತ್ತು ಅಧಿಕೃತ ಪ್ರಕ್ರಿಯೆಗಳ ಸ್ಥಳೀಯ ಸಲಹೆಯಿಂದ ಸಮಯ ಉಳಿಯುತ್ತದೆ.',
        eligibility: 'ಕೃಷಿ ಇಲಾಖೆ ಸೇವೆಗಳು ಮತ್ತು ಬೆಳೆ ಸಲಹೆ ಬೇಕಾದ ರೈತರು.',
        documents: ['ರೈತ ಗುರುತು', 'ಭೂಮಿ ಅಥವಾ ಬೆಳೆ ವಿವರ', 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', 'ಸಂಬಂಧಿತ ಯೋಜನೆ ದಾಖಲೆಗಳು'],
        procedure: ['ಹತ್ತಿರದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.', 'ಬೆಳೆ, ಮಣ್ಣು, ಇನ್ಪುಟ್ ಅಥವಾ ಯೋಜನೆ ಅಗತ್ಯ ತಿಳಿಸಿ.', 'ಸಲಹೆ, ಅರ್ಜಿ ಮಾರ್ಗದರ್ಶನ ಅಥವಾ ಸೇವಾ ಲಿಂಕ್ ಪಡೆಯಿರಿ.', 'ಅಂತಿಮ ಅನುಮೋದನೆ/ಸೇವೆಗೆ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.'],
        helpline: 'ರೈತ ಕಾಲ್ ಸೆಂಟರ್: 1800-425-3553 / 8277003553',
        link: 'https://raitamitra.karnataka.gov.in/en'
      }
    }
  }
];


document.body.classList.toggle('dark', state.theme === 'dark');

function t(key) {
  return translations[state.lang][key] || translations.en[key] || key;
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function money(value) {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function initials(name) {
  return String(name || 'A')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

function imageOrAvatar(src, name, className = 'avatar') {
  if (src) return `<img class="${className}" src="${escapeHTML(src)}" alt="${escapeHTML(name)}">`;
  return `<div class="${className}" aria-label="${escapeHTML(name)}">${initials(name)}</div>`;
}

function isProfileComplete(user = state.user) {
  if (!user) return false;
  return Boolean(user.profile_completed) && Boolean(user.phone || user.location || user.address);
}

function mapUrl(location = '', latitude = null, longitude = null) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  const text = String(location || '').trim();
  const parsed = text.match(/Lat\s*([-0-9.]+)\s*,?\s*Lng\s*([-0-9.]+)/i);
  if (parsed) return `https://www.google.com/maps/search/?api=1&query=${parsed[1]},${parsed[2]}`;
  if (text) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;
  return '';
}

function mapButton(location, latitude, longitude, label = 'Open Map') {
  const url = mapUrl(location, latitude, longitude);
  if (!url) return '';
  return `<a class="btn secondary small" target="_blank" rel="noopener" href="${escapeHTML(url)}">🗺️ ${label}</a>`;
}

function formatDateTime(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'Not available';
  const normalized = raw.includes('T') ? raw : `${raw.replace(' ', 'T')}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

function showModal(html) {
  let root = document.getElementById('modalRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'modalRoot';
    document.body.appendChild(root);
  }
  root.innerHTML = `<div class="modal-backdrop" onclick="if(event.target === this) closeModal()">${html}</div>`;
}

window.closeModal = function closeModal() {
  const root = document.getElementById('modalRoot');
  if (root) root.innerHTML = '';
};

function getSchemeText(scheme, lang = state.lang) {
  return scheme.languages?.[lang] || scheme.languages?.en || scheme;
}

function roleTips(role) {
  const tips = {
    Farmer: [
      'Keep crop quantity accurate. Accepted customer offers automatically reduce stock.',
      'Use live location so customers can open your farm on Google Maps and nearby store search works correctly.',
      'Check schemes, crop advisor and agri stores before every season to reduce cost and improve planning.'
    ],
    Labour: [
      'Turn Go Online on only when you are ready to receive farmer booking requests.',
      'Add clear slots with start and end time. Booked slots are hidden from public search.',
      'Use Revoke Booking if a booked slot must be made available again.'
    ],
    Consumer: [
      'Check farmer stock before sending a negotiated offer.',
      'Use farm map location before pickup or delivery planning.',
      'Track pending, accepted and declined deals in My Orders.'
    ]
  };
  return tips[role] || [];
}

function renderTips(role) {
  return `
    <section class="tips-panel">
      <div class="tips-title"><span>💡</span><div><strong>${escapeHTML(role)} Smart Tips</strong><small>Practical suggestions for this role</small></div></div>
      <div class="tips-grid">
        ${roleTips(role).map((tip) => `<div class="tip-card">${escapeHTML(tip)}</div>`).join('')}
      </div>
    </section>
  `;
}

async function api(path, options = {}) {
  const headers = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };
  const response = await fetch(`/api${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }
  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }
  return data;
}

function toast(message, type = 'success') {
  const node = document.createElement('div');
  node.className = `toast ${type}`;
  node.textContent = message;
  toastRoot.appendChild(node);
  setTimeout(() => node.remove(), 3300);
}

function setUser(user) {
  state.user = user;
  localStorage.setItem('agriUser', JSON.stringify(user));
}

async function refreshUser() {
  if (!state.user) return;
  try {
    const data = await api(`/users/${state.user.id}`);
    setUser(data.user);
  } catch (error) {
    console.warn(error.message);
  }
}

function defaultTab(role) {
  return 'home';
}

function getTabs(role) {
  const tabs = {
    Labour: [
      { id: 'home', icon: '🏡', label: 'Home' },
      ...(!isProfileComplete() ? [{ id: 'profile', icon: '👤', label: 'Profile' }] : []),
      { id: 'availability', icon: '🟢', label: 'Availability' },
      { id: 'bookings', icon: '📅', label: 'Bookings' },
      { id: 'labour-stats', icon: '📈', label: 'Stats' }
    ],
    Farmer: [
      { id: 'home', icon: '🏡', label: 'Home' },
      ...(!isProfileComplete() ? [{ id: 'profile', icon: '👨‍🌾', label: 'Profile' }] : []),
      { id: 'farmer-items', icon: '🌽', label: 'List Crops' },
      { id: 'incoming-orders', icon: '📥', label: 'Customer Orders' },
      { id: 'find-labour', icon: '🧑‍🌾', label: 'Book Labour' },
      { id: 'nearby-agri-stores', icon: '🏪', label: 'Nearby Agri Stores' },
      { id: 'agri-inputs', icon: '🧪', label: 'Pesticides & Seeds' },
      { id: 'crop-advisor', icon: '🌦️', label: 'Crop Advisor' },
      { id: 'schemes', icon: '🏛️', label: 'Karnataka Schemes' },
      { id: 'farmer-profit', icon: '📊', label: 'Investment & Profit' }
    ],
    Consumer: [
      { id: 'home', icon: '🏡', label: 'Home' },
      ...(!isProfileComplete() ? [{ id: 'profile', icon: '🏠', label: 'Profile' }] : []),
      { id: 'farmer-market', icon: '🚜', label: 'Buy from Farmers' },
      { id: 'my-orders', icon: '🤝', label: 'My Orders & Deals' }
    ]
  };
  return tabs[role] || [];
}

function render() {
  const content = state.user ? renderDashboard() : renderPublicScreens();
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopNav()}
      ${content}
      ${renderChatbot()}
      ${renderWhatsAppAgentButton()}
    </div>
  `;
  bindAfterRender();
}

function renderTopNav() {
  return `
    <nav class="top-nav">
      <div class="brand">
        <div class="brand-logo">🌱</div>
        <div>
          <strong>${t('appName')}</strong>
        </div>
      </div>
      <div class="nav-actions">
        <select class="select nav-select" id="languageSelect" aria-label="${t('language')}">
          <option value="en" ${state.lang === 'en' ? 'selected' : ''}>English</option>
          <option value="hi" ${state.lang === 'hi' ? 'selected' : ''}>Hindi</option>
          <option value="kn" ${state.lang === 'kn' ? 'selected' : ''}>Kannada</option>
        </select>
        <button class="icon-btn" id="themeToggle" title="Toggle theme">${state.theme === 'dark' ? '☀️' : '🌙'}</button>
        ${state.user ? `<button class="btn secondary small" id="logoutBtn">${t('logout')}</button>` : ''}
      </div>
    </nav>
  `;
}

function renderPublicScreens() {
  if (state.selectedRole) return renderAuth();
  return `
    <main class="hero">
      <section class="hero-card">
        <span class="badge">✨ ${t('heroBadge')}</span>
        <h1>${t('heroTitle')}</h1>
        <p>${t('heroText')}</p>
        <div class="hero-pills">
          <span class="hero-pill">Local Database Storage</span>
          <span class="hero-pill">Vanilla JavaScript SPA</span>
          <span class="hero-pill">Smart Agri Assistant</span>
          <span class="hero-pill">Google Maps Location</span>
        </div>
      </section>
      <section class="role-grid" aria-label="${t('selectRole')}">
        ${Object.keys(roleDetails).map((role) => {
          const detail = roleDetails[role];
          return `
            <button class="role-card" data-role="${role}">
              <div class="role-icon">${detail.icon}</div>
              <h3>${detail.title}</h3>
              <p>${detail.description}</p>
            </button>
          `;
        }).join('')}
      </section>
    </main>
  `;
}

function renderAuth() {
  const role = roleDetails[state.selectedRole];
  const signup = state.authMode === 'signup';
  return `
    <main class="auth-layout">
      <aside class="panel">
        <span class="badge">${role.icon} ${role.title}</span>
        <h2 style="margin-top:18px;">${signup ? 'Create your account' : 'Welcome back'}</h2>
        <p class="panel-muted">You are entering the platform as <strong>${role.title}</strong>. You can go back and choose another role any time before login.</p>
        <button class="btn secondary" id="changeRoleBtn" style="margin-top:18px;">Change role</button>
      </aside>
      <section class="panel">
        <h2>${signup ? t('signup') : t('login')}</h2>
        <form id="authForm" class="form-grid">
          ${signup ? `
            <div class="field full">
              <label>${t('name')}</label>
              <input class="input" name="name" placeholder="Enter your name" required>
            </div>
            <div class="field full">
              <label>Register as</label>
              <select class="select" name="role" id="signupRoleSelect" required>
                ${Object.keys(roleDetails).map((roleName) => `<option value="${roleName}" ${state.selectedRole === roleName ? 'selected' : ''}>${roleDetails[roleName].icon} ${roleDetails[roleName].title}</option>`).join('')}
              </select>
            </div>
          ` : ''}
          <div class="field full">
            <label>${t('email')}</label>
            <input class="input" type="email" name="email" placeholder="name@example.com" required>
          </div>
          <div class="field full">
            <label>${t('password')}</label>
            <input class="input" type="password" name="password" placeholder="Minimum 6 characters" required minlength="6">
          </div>
          <button class="btn full" type="submit">${signup ? t('signup') : t('login')}</button>
        </form>
        <p class="panel-muted" style="margin-top:18px;">
          ${signup ? 'Already have an account?' : 'New to this role?'}
          <button class="btn secondary small" id="switchAuthBtn">${signup ? 'Login instead' : 'Create account'}</button>
        </p>
      </section>
    </main>
  `;
}

function renderDashboard() {
  const tabs = getTabs(state.user.role);
  if (!state.activeTab || !tabs.some((tab) => tab.id === state.activeTab)) {
    state.activeTab = defaultTab(state.user.role);
    localStorage.setItem('agriActiveTab', state.activeTab);
  }
  return `
    <main class="dashboard">
      <aside class="sidebar">
        <div class="user-mini">
          ${imageOrAvatar(state.user.photo, state.user.name)}
          <div class="user-mini-text">
            <strong>${escapeHTML(state.user.name)}</strong>
            <small>${escapeHTML(state.user.role)} ${state.user.is_online ? '• Online' : ''}</small>
          </div>
          ${isProfileComplete() ? `<button class="mini-edit" data-tab="profile" title="Edit profile">✏️</button>` : ''}
        </div>
        <div class="tab-list">
          ${tabs.map((tab) => `
            <button class="tab-btn ${state.activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
              <span>${tab.icon}</span><span>${tab.label}</span>
            </button>
          `).join('')}
        </div>
      </aside>
      <section class="content-area" id="contentArea">
        ${renderTabContent()}
      </section>
    </main>
  `;
}

function renderTabContent() {
  const role = state.user.role;
  if (state.activeTab === 'home') return renderHomeTab();
  if (state.activeTab === 'profile') return renderProfileTab();
  if (role === 'Labour' && state.activeTab === 'availability') return renderLabourAvailability();
  if (role === 'Labour' && state.activeTab === 'bookings') return renderLabourBookings();
  if (role === 'Labour' && state.activeTab === 'labour-stats') return renderLabourStats();
  if (role === 'Farmer' && state.activeTab === 'farmer-items') return renderFarmerItems();
  if (role === 'Farmer' && state.activeTab === 'incoming-orders') return renderIncomingOrders();
  if (role === 'Farmer' && state.activeTab === 'find-labour') return renderFindLabour();
  if (role === 'Farmer' && state.activeTab === 'nearby-agri-stores') return renderNearbyAgriStores();
  if (role === 'Farmer' && state.activeTab === 'agri-inputs') return renderAgriInputsGuide();
  if (role === 'Farmer' && state.activeTab === 'crop-advisor') return renderCropAdvisor();
  if (role === 'Farmer' && state.activeTab === 'schemes') return renderKarnatakaSchemes();
  if (role === 'Farmer' && state.activeTab === 'farmer-profit') return renderFarmerProfit();
  if (role === 'Consumer' && state.activeTab === 'farmer-market') return renderFarmerMarket();
  if (role === 'Consumer' && state.activeTab === 'my-orders') return renderMyOrders();
  return `<div class="empty">This screen is not available for your role.</div>`;
}

function pageHead(title, text) {
  return `<div class="page-head"><h1>${title}</h1><p>${text}</p></div>`;
}

function renderHomeTab() {
  setTimeout(loadHomeOverview, 0);
  return `
    ${pageHead(`Welcome, ${escapeHTML(state.user.name)}`, `Your ${state.user.role} control room is ready. See recent activity, quick actions and smart tips before opening other sections.`)}
    ${!isProfileComplete() ? `
      <section class="profile-nudge">
        <div><strong>Complete your profile first</strong><p>Add phone, photo and Google Maps location so others can contact and reach you.</p></div>
        <button class="btn" data-tab="profile">Complete Profile</button>
      </section>
    ` : ''}
    <section id="homeOverviewContainer"></section>
    ${renderTips(state.user.role)}
  `;
}

function renderProfileTab() {
  const user = state.user;
  const roleText = {
    Labour: 'Update daily cost, phone, WhatsApp number, profile photo and live location for farmer booking visibility.',
    Farmer: 'Update farmer photo, phone number and farm location. This location is used for Google Maps and nearby agri-store search.',
    Consumer: 'Update consumer photo, phone number and delivery address.'
  }[user.role];
  return `
    ${pageHead(`${user.role} Profile`, roleText)}
    <section class="panel">
      <form id="profileForm" class="form-grid">
        <div class="field full">
          <label>${t('name')}</label>
          <input class="input" name="name" value="${escapeHTML(user.name)}" required>
        </div>
        <div class="field">
          <label>${t('phone')}</label>
          <input class="input" name="phone" value="${escapeHTML(user.phone)}" placeholder="9876543210">
        </div>
        ${user.role === 'Labour' ? `
          <div class="field">
            <label>WhatsApp Number</label>
            <input class="input" name="whatsapp" value="${escapeHTML(user.whatsapp)}" placeholder="WhatsApp number">
          </div>
          <div class="field">
            <label>Cost of labour per day</label>
            <input class="input" name="labour_rate" type="number" min="0" value="${escapeHTML(user.labour_rate)}" placeholder="650">
          </div>
        ` : ''}
        ${user.role === 'Consumer' ? `
          <div class="field full">
            <label>Delivery Address</label>
            <textarea class="textarea" name="address" placeholder="Enter delivery address">${escapeHTML(user.address)}</textarea>
          </div>
        ` : ''}
        <div class="field full">
          <label>${user.role === 'Consumer' ? 'Area / City' : t('location')}</label>
          <div style="display:grid;grid-template-columns:1fr auto auto;gap:10px;">
            <input class="input" name="location" id="locationInput" value="${escapeHTML(user.location)}" placeholder="Mysuru, Karnataka or live coordinates">
            <input type="hidden" name="latitude" id="latitudeInput" value="${escapeHTML(user.latitude || '')}">
            <input type="hidden" name="longitude" id="longitudeInput" value="${escapeHTML(user.longitude || '')}">
            <button class="btn secondary" type="button" id="geoBtn">📍 Get Live Location</button>
            ${mapButton(user.location, user.latitude, user.longitude, 'Open')}
          </div>
        </div>
        <div class="field full">
          <label>Photo URL or upload image</label>
          <input class="input" name="photo" id="photoUrlInput" value="${escapeHTML(user.photo)}" placeholder="Paste image URL or upload below">
        </div>
        <div class="field full">
          <input class="input" type="file" id="photoFileInput" accept="image/*">
        </div>
        <div class="field full">
          <button class="btn" type="submit">${t('save')} Profile</button>
        </div>
      </form>
    </section>
  `;
}

function renderLabourAvailability() {
  setTimeout(loadLabourSlots, 0);
  return `
    ${pageHead('Availability', 'Go online and add date/time slots. Once a farmer books a slot, it becomes Booked and disappears from the public labour search.')}
    <section class="panel">
      <div class="switch-row">
        <div>
          <h3 style="margin:0 0 4px;">Go Online</h3>
          <p class="panel-muted" style="margin:0;">Online labourers appear in Farmer Book Labour screen only.</p>
        </div>
        <label class="switch">
          <input type="checkbox" id="onlineToggle" ${state.user.is_online ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
      <form id="slotForm" class="form-grid">
        <div class="field">
          <label>Date</label>
          <input class="input" name="date" type="date" required>
        </div>
        <div class="field">
          <label>Start Time</label>
          <input class="input" name="start_time" type="time" required>
        </div>
        <div class="field">
          <label>End Time</label>
          <input class="input" name="end_time" type="time" required>
        </div>
        <div class="field" style="align-self:end;">
          <button class="btn" type="submit">Add Slot</button>
        </div>
      </form>
    </section>
    <section style="margin-top:18px;" id="labourSlotsContainer"></section>
  `;
}

function renderLabourBookings() {
  setTimeout(loadLabourBookings, 0);
  return `
    ${pageHead('Bookings', 'View farmers who booked your working slots with contact information.')}
    <section id="labourBookingsContainer"></section>
  `;
}

function renderLabourStats() {
  setTimeout(loadLabourStats, 0);
  return `
    ${pageHead('Labour Stats', 'Track total working hours, number of confirmed bookings and earnings.')}
    <section id="labourStatsContainer"></section>
  `;
}

function renderFindLabour() {
  setTimeout(loadFindLabour, 0);
  return `
    ${pageHead('Find Labour', 'View online labourers nearby, check daily cost, available slots and book them for farm work.')}
    <section class="map-box">
      <div class="map-pin pin-one"><span>🧑‍🌾</span></div>
      <div class="map-pin pin-two"><span>🌱</span></div>
      <div class="map-pin pin-three"><span>📍</span></div>
      <h2 style="margin:0;">Nearby Labour Map</h2>
      <p class="panel-muted" style="max-width:560px;">This smart map panel works with saved live locations. Use each card’s Open Map button to redirect into Google Maps.</p>
    </section>
    <section style="margin-top:18px;" id="findLabourContainer"></section>
  `;
}

function renderFarmerItems() {
  setTimeout(loadFarmerItems, 0);
  return `
    ${pageHead('List Items', 'Upload harvested crops or upcoming harvest dates with expected price and quantity.')}
    <section class="panel">
      <form id="farmerItemForm" class="form-grid">
        <div class="field full"><label>Item Name</label><input class="input" name="item_name" required placeholder="Organic Tomato"></div>
        <div class="field"><label>Expected Price</label><input class="input" name="expected_price" type="number" min="0" step="0.01" required placeholder="28"></div>
        <div class="field"><label>Quantity</label><input class="input" name="quantity" type="number" min="1" step="0.01" value="1"></div>
        <div class="field"><label>Harvest Date</label><input class="input" name="harvest_date" type="date"></div>
        <div class="field full"><label>Photo URL</label><input class="input" name="photo" placeholder="Crop image URL"></div>
        <button class="btn full" type="submit">List Crop</button>
      </form>
    </section>
    <section style="margin-top:18px;" id="farmerItemsContainer"></section>
  `;
}

function renderIncomingOrders() {
  setTimeout(loadIncomingOrders, 0);
  return `
    ${pageHead('Incoming Orders', 'Accept or decline negotiated offers from customers.')}
    <section id="incomingOrdersContainer"></section>
  `;
}

function renderFarmerProfit() {
  setTimeout(loadFarmerProfit, 0);
  return `
    ${pageHead('Investment & Profit', 'Log seeds, fertilizer, labour and other investments. Net Profit = Total Revenue - Total Investments.')}
    <div class="split">
      <section class="panel">
        <h2>Add Investment</h2>
        <form id="investmentForm" class="form-grid">
          <div class="field"><label>Category</label><select class="select" name="category"><option>Seeds</option><option>Fertilizer</option><option>Labour</option><option>Transport</option><option>Equipment</option><option>Other</option></select></div>
          <div class="field"><label>Amount</label><input class="input" name="amount" type="number" min="0" step="0.01" required placeholder="2500"></div>
          <div class="field full"><label>Note</label><input class="input" name="note" placeholder="Optional note"></div>
          <button class="btn full" type="submit">Save Investment</button>
        </form>
      </section>
      <section id="farmerProfitContainer"></section>
    </div>
  `;
}

function renderFarmerMarket() {
  setTimeout(loadFarmerMarket, 0);
  return `
    ${pageHead('Buy from Farmers', 'Browse crop items listed directly by farmers. Request quantity and send negotiated price offers.')}
    <section id="farmerMarketContainer"></section>
  `;
}

function renderMyOrders() {
  setTimeout(loadMyOrders, 0);
  return `
    ${pageHead('My Orders & Deals', 'Track pending, accepted and declined offers with farmer profile details.')}
    <section id="myOrdersContainer"></section>
  `;
}


async function loadHomeOverview() {
  const container = document.getElementById('homeOverviewContainer');
  if (!container) return;
  const role = state.user.role;
  try {
    if (role === 'Farmer') {
      const [offersData, itemsData, statsData] = await Promise.all([
        api(`/offers?user_id=${state.user.id}&box=received`),
        api(`/farmer/items?farmer_id=${state.user.id}`),
        api(`/stats/farmer/${state.user.id}`)
      ]);
      const customerOrders = offersData.offers.filter((offer) => offer.from_user?.role === 'Consumer').slice(0, 3);
      container.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card"><small>Listed Crops</small><strong>${itemsData.items.length}</strong></div>
          <div class="stat-card"><small>Customer Orders</small><strong>${customerOrders.length}</strong></div>
          <div class="stat-card"><small>Accepted Deals</small><strong>${statsData.stats.accepted_deals}</strong></div>
          <div class="stat-card"><small>Net Profit</small><strong>${money(statsData.stats.net_profit)}</strong></div>
        </div>
        <section class="panel"><h2>Recent Customer Orders</h2>${customerOrders.length ? renderOfferList(customerOrders, true) : '<div class="empty">No customer orders yet. List crops to receive direct customer requests.</div>'}</section>
      `;
      return;
    }
    if (role === 'Labour') {
      const [slotsData, bookingsData, statsData] = await Promise.all([
        api(`/labour/${state.user.id}/slots`),
        api(`/bookings?labour_id=${state.user.id}`),
        api(`/stats/labour/${state.user.id}`)
      ]);
      container.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card"><small>Status</small><strong>${state.user.is_online ? 'Online' : 'Offline'}</strong></div>
          <div class="stat-card"><small>Slots</small><strong>${slotsData.slots.length}</strong></div>
          <div class="stat-card"><small>Farmer Bookings</small><strong>${statsData.stats.bookings_count}</strong></div>
          <div class="stat-card"><small>Earnings</small><strong>${money(statsData.stats.earnings)}</strong></div>
        </div>
        <section class="panel"><h2>Recent Farmer Bookings</h2>${bookingsData.bookings.length ? renderLabourBookingCards(bookingsData.bookings.slice(0, 3), true) : '<div class="empty">No bookings yet. Go online and add slots.</div>'}</section>
      `;
      return;
    }
    const [sentOffers, farmerMarket] = await Promise.all([
      api(`/offers?user_id=${state.user.id}&box=sent`),
      api('/market/farmer-items')
    ]);
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><small>My Offers</small><strong>${sentOffers.offers.length}</strong></div>
        <div class="stat-card"><small>Farmer Crops</small><strong>${farmerMarket.items.length}</strong></div>
        <div class="stat-card"><small>Accepted</small><strong>${sentOffers.offers.filter(o => o.status === 'Accepted').length}</strong></div>
        <div class="stat-card"><small>Pending</small><strong>${sentOffers.offers.filter(o => o.status === 'Pending').length}</strong></div>
      </div>
      <section class="panel"><h2>My Recent Farmer Deals</h2>${renderOfferList(sentOffers.offers.slice(0, 3), false)}</section>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}


function getStoredOrLivePosition() {
  return new Promise((resolve, reject) => {
    const savedLat = Number(state.user?.latitude);
    const savedLng = Number(state.user?.longitude);
    const fallback = Number.isFinite(savedLat) && Number.isFinite(savedLng) && (savedLat !== 0 || savedLng !== 0)
      ? { lat: savedLat, lng: savedLng, source: 'Saved profile location' }
      : null;
    if (!navigator.geolocation) {
      if (fallback) resolve(fallback);
      else reject(new Error('Geolocation is not supported and profile location is empty.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude, source: 'Current live location' }),
      () => fallback ? resolve(fallback) : reject(new Error('Location permission denied. Save profile location or allow browser location.')),
      { enableHighAccuracy: true, timeout: 9000 }
    );
  });
}

function renderNearbyAgriStores() {
  setTimeout(loadNearbyAgriStores, 0);
  return `
    ${pageHead('Nearby Agri Stores', 'Use your current location to find agro chemical stores, Krishi Kendras, fertilizer shops, seed shops, farm supply shops and agriculture essentials near your farm.')}
    <section class="panel action-panel">
      <div>
        <h2>Live location based search</h2>
        <p class="panel-muted">The backend first uses Google Places if you add your API key in config.js. If the key is empty, it uses free OpenStreetMap Overpass fallback for demo.</p>
      </div>
      <button class="btn" id="loadAgriStoresBtn">📍 Find Nearby Agri Stores</button>
    </section>
    <section id="agriStoresContainer" style="margin-top:18px;"><div class="empty">Click the button or allow location permission to load stores.</div></section>
  `;
}

async function loadNearbyAgriStores() {
  const container = document.getElementById('agriStoresContainer');
  if (!container) return;
  container.innerHTML = '<div class="empty">Searching nearby agri stores...</div>';
  try {
    const position = await getStoredOrLivePosition();
    const data = await api(`/agri-stores/nearby?lat=${position.lat}&lng=${position.lng}`);
    if (!data.stores.length) {
      container.innerHTML = `<div class="empty">No stores found nearby. Try increasing radius in config.js or use Google Places API for better results.</div>`;
      return;
    }
    container.innerHTML = `
      <div class="source-banner"><strong>Source:</strong> ${escapeHTML(data.source)} • <span>${escapeHTML(position.source)}</span>${data.warning ? `<br><small>${escapeHTML(data.warning)}</small>` : ''}</div>
      <div class="card-grid">
        ${data.stores.map((store) => `
          <article class="item-card store-card">
            <div class="item-body">
              <div class="store-icon">🏪</div>
              <h3>${escapeHTML(store.name)}</h3>
              <div class="meta-row">
                <span class="tag">${escapeHTML(store.category || 'Agri Store')}</span>
                <span class="status ${String(store.availability).toLowerCase().includes('closed') ? 'out' : ''}">${escapeHTML(store.availability || 'Call to confirm')}</span>
              </div>
              <p class="panel-muted"><strong>Phone:</strong> ${escapeHTML(store.phone || 'Not available')}<br><strong>Address:</strong> ${escapeHTML(store.address || 'Open in map')}<br><strong>Hours:</strong> ${escapeHTML(store.opening_hours || 'Not available')}</p>
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                ${store.phone && !String(store.phone).includes('not') ? `<a class="btn small" href="tel:${escapeHTML(store.phone)}">Call</a>` : ''}
                ${store.map_url ? `<a class="btn secondary small" target="_blank" rel="noopener" href="${escapeHTML(store.map_url)}">🗺️ Store Map</a>` : ''}
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

function renderAgriInputsGuide() {
  return `
    ${pageHead('Pesticides, Seeds, Soil & Weather Guide', 'Reference section for common crop input decisions. Always verify dosage and chemical label with an agriculture officer before use.')}
    <div class="guide-grid">
      <section class="panel"><h2>🧪 Pesticides / Crop Protection</h2>${agriKnowledge.pesticides.map((item) => `<div class="info-row"><strong>${escapeHTML(item.name)}</strong><p>${escapeHTML(item.use)}</p><small>${escapeHTML(item.safety)}</small></div>`).join('')}</section>
      <section class="panel"><h2>🌱 Seeds</h2>${agriKnowledge.seeds.map((item) => `<div class="info-row"><strong>${escapeHTML(item.name)}</strong><p>${escapeHTML(item.use)}</p><small>${escapeHTML(item.tip)}</small></div>`).join('')}</section>
      <section class="panel full"><h2>🌦️ Soil & Weather Suitability</h2><div class="table-wrap"><table class="table"><thead><tr><th>Condition</th><th>Suitable Crops</th><th>Note</th></tr></thead><tbody>${agriKnowledge.soilWeather.map((row) => `<tr><td>${escapeHTML(row.condition)}</td><td>${escapeHTML(row.crops)}</td><td>${escapeHTML(row.note)}</td></tr>`).join('')}</tbody></table></div></section>
    </div>
  `;
}

function renderCropAdvisor() {
  return `
    ${pageHead('Crop Suitability Advisor', 'Select field conditions and get crop suggestions for Karnataka farming conditions.')}
    <section class="panel">
      <form id="cropAdvisorForm" class="form-grid">
        <div class="field"><label>Soil Type</label><select class="select" name="soil"><option value="red">Red soil</option><option value="black">Black soil</option><option value="clay">Clay soil</option><option value="sandy">Sandy soil</option><option value="loamy">Loamy soil</option></select></div>
        <div class="field"><label>Humidity</label><select class="select" name="humidity"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
        <div class="field"><label>Rain Availability</label><select class="select" name="rain"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
        <div class="field"><label>Water Source</label><select class="select" name="water"><option value="rainfed">Rainfed</option><option value="borewell">Borewell</option><option value="canal">Canal</option><option value="river">River</option><option value="pond">Farm Pond</option><option value="drip">Drip Irrigation</option></select></div>
        <button class="btn full" type="submit">Show Suitable Crops</button>
      </form>
    </section>
    <section id="cropAdvisorResult" style="margin-top:18px;"><div class="empty">Select parameters and click the button.</div></section>
  `;
}

function handleCropAdvisor(event) {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.target).entries());
  const scored = cropRules.map((rule) => {
    let score = 0;
    if (rule.soil.includes(form.soil)) score += 3;
    if (rule.humidity.includes(form.humidity)) score += 2;
    if (rule.rain.includes(form.rain)) score += 2;
    if (rule.water.includes(form.water)) score += 3;
    return { ...rule, score };
  }).filter((rule) => rule.score > 2).sort((a, b) => b.score - a.score);
  const result = document.getElementById('cropAdvisorResult');
  if (!result) return;
  result.innerHTML = `
    <div class="card-grid">
      ${(scored.length ? scored : cropRules.slice(0, 3)).map((rule) => `
        <article class="item-card"><div class="item-body"><h3>${escapeHTML(rule.crop)}</h3><div class="meta-row"><span class="tag">Match Score ${rule.score || 1}/10</span></div><p class="panel-muted">${escapeHTML(rule.reason)}</p></div></article>
      `).join('')}
    </div>
  `;
}


function renderKarnatakaSchemes() {
  return `
    ${pageHead('Karnataka Farmer Schemes', 'Clean scheme cards with benefit, official link, complete procedure, helpline and Kannada/Hindi reading options.')}
    <div class="scheme-grid">
      ${karnatakaSchemes.map((scheme) => {
        const text = getSchemeText(scheme);
        return `
          <article class="scheme-card-modern">
            <img class="scheme-cover" src="${escapeHTML(scheme.image)}" alt="${escapeHTML(text.name)}">
            <div class="scheme-content">
              <span class="scheme-chip">Government Scheme</span>
              <h3>${escapeHTML(text.name)}</h3>
              <p>${escapeHTML(text.summary)}</p>
              <div class="scheme-mini-grid">
                <div><small>Profit</small><strong>${escapeHTML(text.profit)}</strong></div>
                <div><small>Helpline</small><strong>${escapeHTML(text.helpline)}</strong></div>
              </div>
              <div class="scheme-button-row">
                <button class="btn small" onclick="openSchemeDetails('${scheme.id}', 'en')">Read English</button>
                <button class="btn secondary small" onclick="openSchemeDetails('${scheme.id}', 'kn')">ಕನ್ನಡ</button>
                <button class="btn secondary small" onclick="openSchemeDetails('${scheme.id}', 'hi')">हिंदी</button>
                <a class="btn ghost small" target="_blank" rel="noopener" href="${escapeHTML(text.link)}">Official Link</a>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

window.openSchemeDetails = function openSchemeDetails(schemeId, lang = 'en') {
  const scheme = karnatakaSchemes.find((entry) => entry.id === schemeId);
  if (!scheme) return;
  const text = getSchemeText(scheme, lang);
  showModal(`
    <section class="modal-card scheme-detail-modal">
      <button class="modal-close" onclick="closeModal()">×</button>
      <img class="scheme-detail-image" src="${escapeHTML(scheme.image)}" alt="${escapeHTML(text.name)}">
      <div class="scheme-detail-body">
        <span class="scheme-chip">${lang === 'kn' ? 'ಕನ್ನಡ ವಿವರ' : lang === 'hi' ? 'हिंदी विवरण' : 'English Details'}</span>
        <h2>${escapeHTML(text.name)}</h2>
        <p class="panel-muted">${escapeHTML(text.summary)}</p>
        <div class="scheme-detail-grid">
          <div><h4>a) Profit / Benefit</h4><p>${escapeHTML(text.profit)}</p></div>
          <div><h4>Eligibility</h4><p>${escapeHTML(text.eligibility)}</p></div>
          <div><h4>c) Helpline Number</h4><p>${escapeHTML(text.helpline)}</p></div>
          <div><h4>b) Official Link</h4><p><a class="btn small" target="_blank" rel="noopener" href="${escapeHTML(text.link)}">Open Official Website</a></p></div>
        </div>
        <h4>Required Documents</h4>
        <ul class="clean-list">${text.documents.map((doc) => `<li>${escapeHTML(doc)}</li>`).join('')}</ul>
        <h4>Complete Procedure to Use the Scheme</h4>
        <ol class="clean-list numbered">${text.procedure.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}</ol>
        <div class="scheme-button-row">
          <button class="btn secondary small" onclick="openSchemeDetails('${scheme.id}', 'en')">English</button>
          <button class="btn secondary small" onclick="openSchemeDetails('${scheme.id}', 'kn')">ಕನ್ನಡ</button>
          <button class="btn secondary small" onclick="openSchemeDetails('${scheme.id}', 'hi')">हिंदी</button>
        </div>
      </div>
    </section>
  `);
};

function renderWhatsAppAgentButton() {
  if (!state.user) return '';
  return `<button type="button" class="whatsapp-agent-fab" id="whatsappAgentBtn" title="WhatsApp Farming Agent"><span>☎</span><strong>WA</strong></button>`;
}

async function openWhatsAppAgent() {
  try {
    const message = `Hello, I am ${state.user.name} (${state.user.role}). I need help with Farming Hub.`;
    const data = await api(`/whatsapp-agent?message=${encodeURIComponent(message)}`);
    window.open(data.url, '_blank', 'noopener');
  } catch (error) {
    toast(error.message, 'error');
  }
}

function renderChatbot() {
  if (!state.user) return '';
  const commandsByRole = {
    Farmer: [
      ['incoming orders', '📥 Orders'],
      ['list crop', '🌽 List Crop'],
      ['nearby stores', '🏪 Stores'],
      ['crop advisor', '🌦️ Advisor'],
      ['schemes', '🏛️ Schemes'],
      ['labour available nearby', '🧑‍🌾 Labour']
    ],
    Labour: [
      ['go online', '🟢 Online'],
      ['my bookings', '📅 Bookings'],
      ['see rate and stats', '📈 Earnings'],
      ['tips', '💡 Tips']
    ],
    Consumer: [
      ['farmer crops', '🚜 Farmer Crops'],
      ['my orders', '🤝 My Orders'],
      ['tips', '💡 Tips']
    ]
  };
  const chips = commandsByRole[state.user.role] || [];
  return `
    <div class="chatbot">
      <div class="chat-panel ${state.chatOpen ? 'open' : ''}" id="chatPanel">
        <div class="chat-head smart-chat-head">
          <div class="ai-orb">✦</div>
          <div>
            <strong>Farming AI Command Center</strong>
            <small>Smart shortcuts, role tips and instant navigation</small>
          </div>
        </div>
        <div class="chat-suggestions">
          ${chips.map(([cmd, label]) => `<button type="button" class="chat-chip" data-chat-command="${escapeHTML(cmd)}">${escapeHTML(label)}</button>`).join('')}
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="bubble">Hi ${escapeHTML(state.user.name)}! I can open screens, show role tips, guide stock checks and help you move faster.</div>
          <div class="bubble ai-card"><strong>Try asking:</strong><br>“nearby stores”, “crop advisor”, “schemes”, “labour available nearby”, “farmer crops”, “my bookings”.</div>
        </div>
        <form class="chat-form" id="chatForm">
          <input class="input" name="message" placeholder="Ask Farming AI or use chips..." autocomplete="off">
          <button class="btn small" type="submit">Send</button>
        </form>
      </div>
      <button class="chat-toggle" id="chatToggle"><span>✦</span></button>
    </div>
  `;
}

function bindAfterRender() {
  document.getElementById('languageSelect')?.addEventListener('change', (event) => {
    state.lang = event.target.value;
    localStorage.setItem('agriLanguage', state.lang);
    render();
  });

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('dark', state.theme === 'dark');
    localStorage.setItem('agriTheme', state.theme);
    render();
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    state.user = null;
    state.activeTab = '';
    localStorage.removeItem('agriUser');
    localStorage.removeItem('agriActiveTab');
    render();
  });

  document.querySelectorAll('[data-role]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedRole = button.dataset.role;
      localStorage.setItem('agriSelectedRole', state.selectedRole);
      state.authMode = 'login';
      render();
    });
  });

  document.getElementById('changeRoleBtn')?.addEventListener('click', () => {
    state.selectedRole = '';
    localStorage.removeItem('agriSelectedRole');
    render();
  });

  document.getElementById('switchAuthBtn')?.addEventListener('click', () => {
    state.authMode = state.authMode === 'login' ? 'signup' : 'login';
    render();
  });

  document.getElementById('authForm')?.addEventListener('submit', handleAuth);

  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => changeTab(button.dataset.tab));
  });

  document.getElementById('profileForm')?.addEventListener('submit', handleProfileSave);
  document.getElementById('geoBtn')?.addEventListener('click', handleGeoLocation);
  document.getElementById('photoFileInput')?.addEventListener('change', handlePhotoFile);
  document.getElementById('onlineToggle')?.addEventListener('change', handleOnlineToggle);
  document.getElementById('slotForm')?.addEventListener('submit', handleSlotCreate);
  document.getElementById('farmerItemForm')?.addEventListener('submit', handleFarmerItemCreate);
  document.getElementById('investmentForm')?.addEventListener('submit', handleInvestmentCreate);
  document.getElementById('loadAgriStoresBtn')?.addEventListener('click', loadNearbyAgriStores);
  document.getElementById('cropAdvisorForm')?.addEventListener('submit', handleCropAdvisor);
  document.getElementById('whatsappAgentBtn')?.addEventListener('click', openWhatsAppAgent);
  document.getElementById('chatToggle')?.addEventListener('click', () => {
    state.chatOpen = !state.chatOpen;
    const panel = document.getElementById('chatPanel');
    panel?.classList.toggle('open', state.chatOpen);
  });
  document.getElementById('chatForm')?.addEventListener('submit', handleChatSubmit);
  document.querySelectorAll('[data-chat-command]').forEach((button) => {
    button.addEventListener('click', () => runAssistantCommand(button.dataset.chatCommand || ''));
  });
}

function changeTab(tabId) {
  state.activeTab = tabId;
  localStorage.setItem('agriActiveTab', state.activeTab);
  render();
}

async function handleAuth(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const payload = Object.fromEntries(form.entries());
  if (state.authMode === 'signup') {
    payload.role = payload.role || state.selectedRole;
    state.selectedRole = payload.role;
    localStorage.setItem('agriSelectedRole', state.selectedRole);
  } else {
    payload.role = state.selectedRole;
  }
  try {
    const endpoint = state.authMode === 'signup' ? '/auth/signup' : '/auth/login';
    const data = await api(endpoint, { method: 'POST', body: JSON.stringify(payload) });
    setUser(data.user);
    state.activeTab = defaultTab(data.user.role);
    localStorage.setItem('agriActiveTab', state.activeTab);
    toast(`${state.authMode === 'signup' ? 'Account created' : 'Login successful'} as ${data.user.role}`);
    render();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function handleProfileSave(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const payload = Object.fromEntries(form.entries());
  try {
    const data = await api(`/users/${state.user.id}/profile`, { method: 'PUT', body: JSON.stringify(payload) });
    setUser(data.user);
    toast('Profile updated successfully.');
    render();
  } catch (error) {
    toast(error.message, 'error');
  }
}

function handleGeoLocation() {
  const input = document.getElementById('locationInput');
  if (!navigator.geolocation) {
    toast('Geolocation is not supported by this browser.', 'error');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);
      input.value = `Lat ${lat}, Lng ${lng}`;
      const latInput = document.getElementById('latitudeInput');
      const lngInput = document.getElementById('longitudeInput');
      if (latInput) latInput.value = lat;
      if (lngInput) lngInput.value = lng;
      toast('Live location captured. Save profile to store it and enable Google Maps redirect.');
    },
    () => toast('Unable to access location permission.', 'error'),
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function handlePhotoFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('photoUrlInput').value = reader.result;
    toast('Photo converted to local data URL. Save profile to store it.');
  };
  reader.readAsDataURL(file);
}

async function handleOnlineToggle(event) {
  try {
    const data = await api(`/labour/${state.user.id}/status`, { method: 'PUT', body: JSON.stringify({ is_online: event.target.checked }) });
    setUser(data.user);
    toast(data.user.is_online ? 'You are online now.' : 'You are offline now.');
    render();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function handleSlotCreate(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  try {
    await api(`/labour/${state.user.id}/slots`, { method: 'POST', body: JSON.stringify(payload) });
    toast('Availability slot added.');
    event.target.reset();
    loadLabourSlots();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function loadLabourSlots() {
  const container = document.getElementById('labourSlotsContainer');
  if (!container) return;
  try {
    const data = await api(`/labour/${state.user.id}/slots`);
    if (!data.slots.length) {
      container.innerHTML = '<div class="empty">No slots added yet.</div>';
      return;
    }
    container.innerHTML = `
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Date</th><th>Start</th><th>End</th><th>Status</th><th>Booked By</th><th>Action</th></tr></thead>
          <tbody>
            ${data.slots.map((slot) => `
              <tr>
                <td>${escapeHTML(slot.date)}</td>
                <td>${escapeHTML(slot.start_time)}</td>
                <td>${escapeHTML(slot.end_time)}</td>
                <td><span class="status ${slot.status === 'Booked' ? 'booked' : ''}">${slot.status}</span></td>
                <td>${slot.booked_by_name ? `${escapeHTML(slot.booked_by_name)} (${escapeHTML(slot.booked_by_role || '')})` : '-'}</td>
                <td>${slot.booking_id ? `<button class="btn danger small" onclick="cancelBooking(${slot.booking_id})">Revoke</button>` : '<span class="panel-muted">Available</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

function renderLabourBookingCards(bookings, allowRevoke = false) {
  if (!bookings.length) return '<div class="empty">No labour bookings yet.</div>';
  return `
    <div class="card-grid">
      ${bookings.map((booking) => `
        <article class="item-card">
          <div class="item-body">
            <h3>${escapeHTML(booking.customer_name)}</h3>
            <div class="meta-row">
              <span class="tag">${escapeHTML(booking.customer_role)}</span>
              <span class="tag">${escapeHTML(booking.date)}</span>
              <span class="tag">${escapeHTML(booking.start_time)} - ${escapeHTML(booking.end_time)}</span>
              <span class="status ${booking.status === 'Cancelled' ? 'declined' : ''}">${escapeHTML(booking.status)}</span>
            </div>
            <p class="panel-muted">Phone: ${escapeHTML(booking.customer_phone || 'Not added')}<br>Location: ${escapeHTML(booking.customer_location || 'Not added')}</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
              <strong>${money(booking.total_cost)}</strong><span class="panel-muted">for ${booking.total_hours} hours</span>
              ${mapButton(booking.customer_location, booking.customer_latitude, booking.customer_longitude, 'Customer Map')}
              ${allowRevoke && booking.status === 'Confirmed' ? `<button class="btn danger small" onclick="cancelBooking(${booking.id})">Revoke Booking</button>` : ''}
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

async function loadLabourBookings() {
  const container = document.getElementById('labourBookingsContainer');
  if (!container) return;
  try {
    const data = await api(`/bookings?labour_id=${state.user.id}`);
    container.innerHTML = renderLabourBookingCards(data.bookings, true);
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

window.cancelBooking = async function cancelBooking(bookingId) {
  if (!confirm('Revoke this booked slot and make it available again?')) return;
  try {
    await api(`/bookings/${bookingId}/cancel`, { method: 'PUT', body: JSON.stringify({ requester_id: state.user.id }) });
    toast('Booking revoked. Slot is available again.');
    if (state.activeTab === 'availability') loadLabourSlots();
    if (state.activeTab === 'bookings') loadLabourBookings();
    if (state.activeTab === 'home') loadHomeOverview();
  } catch (error) {
    toast(error.message, 'error');
  }
};

async function loadLabourStats() {
  const container = document.getElementById('labourStatsContainer');
  if (!container) return;
  try {
    const data = await api(`/stats/labour/${state.user.id}`);
    const stats = data.stats;
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><small>Total Hours</small><strong>${Number(stats.total_hours).toFixed(1)}</strong></div>
        <div class="stat-card"><small>Earnings</small><strong>${money(stats.earnings)}</strong></div>
        <div class="stat-card"><small>Bookings</small><strong>${stats.bookings_count}</strong></div>
        <div class="stat-card"><small>Daily Rate</small><strong>${money(state.user.labour_rate)}</strong></div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

async function loadFindLabour() {
  const container = document.getElementById('findLabourContainer');
  if (!container) return;
  try {
    const data = await api('/labour/online/list');
    if (!data.labours.length) {
      container.innerHTML = '<div class="empty">No labourers are online currently.</div>';
      return;
    }
    container.innerHTML = `
      <div class="card-grid">
        ${data.labours.map((labour) => `
          <article class="item-card">
            ${imageOrAvatar(labour.photo, labour.name, 'item-image')}
            <div class="item-body">
              <h3>${escapeHTML(labour.name)}</h3>
              <div class="meta-row">
                <span class="tag">${money(labour.labour_rate)} / day</span>
                <span class="tag">📍 ${escapeHTML(labour.location || 'Location not set')}</span>
                <span class="status">Online</span>
              </div>
              <p class="panel-muted">Phone: ${escapeHTML(labour.phone || 'Not added')} • WhatsApp: ${escapeHTML(labour.whatsapp || 'Not added')}</p>
              <div style="margin-bottom:10px;">${mapButton(labour.location, labour.latitude, labour.longitude, 'Labour Map')}</div>
              ${labour.slots.length ? labour.slots.map((slot) => `
                <div class="slot-row">
                  <div><strong>${escapeHTML(slot.date)}</strong><br><small>${escapeHTML(slot.start_time)} - ${escapeHTML(slot.end_time)}</small></div>
                  <button class="btn small" onclick="bookLabourSlot(${slot.id})">Book</button>
                </div>
              `).join('') : '<div class="empty">No available slots.</div>'}
            </div>
          </article>
        `).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

window.bookLabourSlot = async function bookLabourSlot(slotId) {
  try {
    await api('/bookings', { method: 'POST', body: JSON.stringify({ slot_id: slotId, booked_by: state.user.id }) });
    toast('Labour booked successfully. Slot is now marked as Booked.');
    loadFindLabour();
  } catch (error) {
    toast(error.message, 'error');
  }
};

async function handleFarmerItemCreate(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  payload.farmer_id = state.user.id;
  try {
    await api('/farmer/items', { method: 'POST', body: JSON.stringify(payload) });
    toast('Crop listed successfully.');
    event.target.reset();
    loadFarmerItems();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function loadFarmerItems() {
  const container = document.getElementById('farmerItemsContainer');
  if (!container) return;
  try {
    const data = await api(`/farmer/items?farmer_id=${state.user.id}`);
    state.farmerItems = data.items;
    if (!data.items.length) {
      container.innerHTML = '<div class="empty">No crops listed yet.</div>';
      return;
    }
    container.innerHTML = `
      <div class="card-grid">
        ${data.items.map((item) => `
          <article class="item-card">
            ${item.photo ? `<img class="item-image" src="${escapeHTML(item.photo)}" alt="${escapeHTML(item.item_name)}">` : `<div class="item-image"></div>`}
            <div class="item-body">
              <h3>${escapeHTML(item.item_name)}</h3>
              <div class="meta-row">
                <span class="tag">Expected ${money(item.expected_price)}</span>
                <span class="tag">Qty ${escapeHTML(item.quantity)}</span>
                <span class="tag">Harvest ${escapeHTML(item.harvest_date || 'Ready')}</span>
              </div>
              <span class="status ${item.status === 'Sold' ? 'out' : ''}">${escapeHTML(item.status)}</span>
              <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
                <button class="btn small" onclick="openFarmerItemEdit(${item.id})">Edit Item</button>
                <button class="btn danger small" onclick="deleteFarmerItem(${item.id})">Delete Item</button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}


window.deleteFarmerItem = async function deleteFarmerItem(id) {
  if (!confirm('Delete this crop listing? It will be hidden from buyers.')) return;
  try {
    await api(`/farmer/items/${id}?user_id=${state.user.id}`, { method: 'DELETE' });
    toast('Crop listing deleted.');
    loadFarmerItems();
  } catch (error) {
    toast(error.message, 'error');
  }
};

window.openFarmerItemEdit = function openFarmerItemEdit(id) {
  const item = state.farmerItems.find((entry) => Number(entry.id) === Number(id));
  if (!item) return toast('Crop not found. Refresh and try again.', 'error');
  showModal(`
    <section class="modal-card">
      <button class="modal-close" onclick="closeModal()">×</button>
      <h2>Edit Listed Crop</h2>
      <p class="panel-muted">Update crop name, rate, image URL, quantity and harvest date.</p>
      <form id="farmerItemEditForm" data-item-id="${item.id}" class="form-grid modal-form">
        <div class="field full"><label>Crop Name</label><input class="input" name="item_name" required value="${escapeHTML(item.item_name)}"></div>
        <div class="field"><label>Expected Rate</label><input class="input" name="expected_price" type="number" min="0" step="0.01" required value="${escapeHTML(item.expected_price)}"></div>
        <div class="field"><label>Quantity</label><input class="input" name="quantity" type="number" min="0" step="0.01" required value="${escapeHTML(item.quantity)}"></div>
        <div class="field"><label>Harvest Date / Time</label><input class="input" name="harvest_date" type="date" value="${escapeHTML(item.harvest_date || '')}"></div>
        <div class="field"><label>Status</label><select class="select" name="status"><option ${item.status === 'Available' ? 'selected' : ''}>Available</option><option ${item.status === 'Sold' ? 'selected' : ''}>Sold</option></select></div>
        <div class="field full"><label>Image URL</label><input class="input" name="photo" value="${escapeHTML(item.photo || '')}" placeholder="Paste crop image URL"></div>
        <button class="btn full" type="submit">Save Crop Changes</button>
      </form>
    </section>
  `);
  document.getElementById('farmerItemEditForm')?.addEventListener('submit', handleFarmerItemEdit);
};

async function handleFarmerItemEdit(event) {
  event.preventDefault();
  const id = event.currentTarget.dataset.itemId;
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
  payload.farmer_id = state.user.id;
  try {
    await api(`/farmer/items/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    toast('Crop listing updated.');
    closeModal();
    loadFarmerItems();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function loadIncomingOrders() {
  const container = document.getElementById('incomingOrdersContainer');
  if (!container) return;
  try {
    const data = await api(`/offers?user_id=${state.user.id}&box=received`);
    container.innerHTML = renderOfferList(data.offers, true);
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

async function handleInvestmentCreate(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  payload.farmer_id = state.user.id;
  try {
    await api('/investments', { method: 'POST', body: JSON.stringify(payload) });
    toast('Investment saved.');
    event.target.reset();
    loadFarmerProfit();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function loadFarmerProfit() {
  const container = document.getElementById('farmerProfitContainer');
  if (!container) return;
  try {
    const [statsData, investmentsData] = await Promise.all([
      api(`/stats/farmer/${state.user.id}`),
      api(`/investments?farmer_id=${state.user.id}`)
    ]);
    const stats = statsData.stats;
    state.investments = investmentsData.investments;
    container.innerHTML = `
      <section class="panel">
        <h2>Profit Summary</h2>
        <div class="stats-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));">
          <div class="stat-card"><small>Revenue</small><strong>${money(stats.total_revenue)}</strong></div>
          <div class="stat-card"><small>Investments</small><strong>${money(stats.total_investments)}</strong></div>
          <div class="stat-card"><small>Net Profit</small><strong>${money(stats.net_profit)}</strong></div>
          <div class="stat-card"><small>Accepted Deals</small><strong>${stats.accepted_deals}</strong></div>
        </div>
        <div class="chart-box">${renderBars([
          ['Revenue', Number(stats.total_revenue)],
          ['Invest', Number(stats.total_investments)],
          ['Net', Math.max(Number(stats.net_profit), 0)]
        ])}</div>
      </section>
      <section class="panel" style="margin-top:18px;">
        <h2>Investment Logs</h2>
        ${investmentsData.investments.length ? investmentsData.investments.map((item) => `
          <div class="slot-row investment-row">
            <div><strong>${escapeHTML(item.category)}</strong><br><small>${escapeHTML(item.note || 'No note')} • ${formatDateTime(item.created_at)}</small></div>
            <div class="investment-actions">
              <strong>${money(item.amount)}</strong>
              <button class="btn secondary small" onclick="openInvestmentEdit(${item.id})">Edit</button>
              <button class="btn danger small" onclick="deleteInvestment(${item.id})">Delete</button>
            </div>
          </div>
        `).join('') : '<div class="empty">No investments logged yet.</div>'}
      </section>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

window.openInvestmentEdit = function openInvestmentEdit(id) {
  const investment = state.investments.find((entry) => Number(entry.id) === Number(id));
  if (!investment) return toast('Investment not found. Refresh and try again.', 'error');
  showModal(`
    <section class="modal-card">
      <button class="modal-close" onclick="closeModal()">×</button>
      <h2>Edit Investment</h2>
      <p class="panel-muted">Correct amount, category or note without changing the original logged time.</p>
      <form id="investmentEditForm" data-investment-id="${investment.id}" class="form-grid modal-form">
        <div class="field"><label>Category</label><select class="select" name="category">
          ${['Seeds','Fertilizer','Labour','Transport','Equipment','Other'].map((cat) => `<option ${investment.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
        </select></div>
        <div class="field"><label>Amount</label><input class="input" name="amount" type="number" min="0" step="0.01" required value="${escapeHTML(investment.amount)}"></div>
        <div class="field full"><label>Note</label><input class="input" name="note" value="${escapeHTML(investment.note || '')}"></div>
        <button class="btn full" type="submit">Save Investment Changes</button>
      </form>
    </section>
  `);
  document.getElementById('investmentEditForm')?.addEventListener('submit', handleInvestmentEdit);
};

async function handleInvestmentEdit(event) {
  event.preventDefault();
  const id = event.currentTarget.dataset.investmentId;
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
  payload.farmer_id = state.user.id;
  try {
    await api(`/investments/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    toast('Investment updated.');
    closeModal();
    loadFarmerProfit();
  } catch (error) {
    toast(error.message, 'error');
  }
}

window.deleteInvestment = async function deleteInvestment(id) {
  if (!confirm('Delete this investment log?')) return;
  try {
    await api(`/investments/${id}?farmer_id=${state.user.id}`, { method: 'DELETE' });
    toast('Investment deleted.');
    loadFarmerProfit();
  } catch (error) {
    toast(error.message, 'error');
  }
};

function renderBars(data) {
  const max = Math.max(...data.map((entry) => Number(entry[1])), 1);
  return `
    <div class="chart-bars">
      ${data.map(([label, value]) => `
        <div class="bar-wrap">
          <div class="bar" style="height:${Math.max((Number(value) / max) * 100, 4)}%;"></div>
          <span>${escapeHTML(label)}<br>${money(value)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

async function loadFarmerMarket() {
  const container = document.getElementById('farmerMarketContainer');
  if (!container) return;
  try {
    const data = await api('/market/farmer-items');
    if (!data.items.length) {
      container.innerHTML = '<div class="empty">No farmer bulk crops available currently.</div>';
      return;
    }
    container.innerHTML = `
      <div class="card-grid">
        ${data.items.map((item) => `
          <article class="item-card">
            ${item.photo ? `<img class="item-image" src="${escapeHTML(item.photo)}" alt="${escapeHTML(item.item_name)}">` : `<div class="item-image"></div>`}
            <div class="item-body">
              <h3>${escapeHTML(item.item_name)}</h3>
              <div class="meta-row">
                <span class="tag">Farmer: ${escapeHTML(item.farmer_name)}</span>
                <span class="tag">Expected ${money(item.expected_price)}</span>
                <span class="tag">Available ${escapeHTML(item.quantity)}</span>
              </div>
              <p class="panel-muted">Harvest: ${escapeHTML(item.harvest_date || 'Ready')} • ${escapeHTML(item.farmer_location || 'Farm location not set')}</p>
              <div style="margin-bottom:10px;">${mapButton(item.farmer_location, item.farmer_latitude, item.farmer_longitude, 'Farm Map')}</div>
              <div class="form-grid" style="grid-template-columns:1fr 1fr;">
                <input class="input" id="farmerQty${item.id}" type="number" min="1" max="${escapeHTML(item.quantity)}" value="1" placeholder="Bulk qty">
                <input class="input" id="farmerOffer${item.id}" type="number" min="0" value="${escapeHTML(item.expected_price)}" placeholder="Offer">
                <button class="btn full" onclick="sendOffer('FarmerItem', ${item.id}, ${item.farmer_id}, 'farmerQty${item.id}', 'farmerOffer${item.id}', ${Number(item.quantity) || 0})">Send Bulk Offer</button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

window.sendOffer = async function sendOffer(itemType, itemId, toUserId, qtyInputId, offerInputId, maxQty = Infinity) {
  const quantity = Number(document.getElementById(qtyInputId)?.value || 1);
  const offerPrice = Number(document.getElementById(offerInputId)?.value || 0);
  if (!quantity || quantity <= 0) {
    toast('Enter a valid quantity.', 'error');
    return;
  }
  if (Number.isFinite(Number(maxQty)) && quantity > Number(maxQty)) {
    toast(`Only ${maxQty} quantity is available. Reduce your order quantity.`, 'error');
    return;
  }
  if (!offerPrice || offerPrice <= 0) {
    toast('Enter a valid offer price.', 'error');
    return;
  }
  try {
    await api('/offers', {
      method: 'POST',
      body: JSON.stringify({
        from_user_id: state.user.id,
        to_user_id: toUserId,
        item_type: itemType,
        item_id: itemId,
        quantity,
        offer_price: offerPrice,
        note: `${state.user.role} negotiated offer`
      })
    });
    toast('Offer sent successfully. Track it in My Orders & Deals.');
  } catch (error) {
    toast(error.message, 'error');
  }
};

async function loadMyOrders() {
  const container = document.getElementById('myOrdersContainer');
  if (!container) return;
  try {
    const data = await api(`/offers?user_id=${state.user.id}&box=sent`);
    container.innerHTML = renderOfferList(data.offers, false);
  } catch (error) {
    container.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`;
  }
}

function renderOfferList(offers, allowActions) {
  if (!offers.length) return '<div class="empty">No offers found.</div>';
  return `
    <div class="card-grid">
      ${offers.map((offer) => {
        const itemName = offer.item?.item_name || 'Item';
        const statusClass = offer.status === 'Pending' ? 'pending' : (offer.status === 'Declined' || offer.status === 'Withdrawn') ? 'declined' : '';
        const otherUser = allowActions ? offer.from_user : offer.to_user;
        const canWithdraw = !allowActions && offer.status === 'Pending' && Number(offer.from_user_id) === Number(state.user?.id);
        return `
          <article class="item-card">
            ${offer.item?.photo ? `<img class="item-image" src="${escapeHTML(offer.item.photo)}" alt="${escapeHTML(itemName)}">` : '<div class="item-image"></div>'}
            <div class="item-body">
              <h3>${escapeHTML(itemName)}</h3>
              <div class="meta-row">
                <span class="status ${statusClass}">${escapeHTML(offer.status)}</span>
                <span class="tag">Qty ${escapeHTML(offer.quantity)}</span>
                <span class="tag">Offer ${money(offer.offer_price)}</span>
              </div>
              <p class="panel-muted">${allowActions ? 'From' : 'To'}: <strong>${escapeHTML(otherUser?.name || 'User')}</strong><br>Phone: ${escapeHTML(otherUser?.phone || 'Not added')}<br>Location: ${escapeHTML(otherUser?.location || otherUser?.address || 'Not added')}</p>
              <div style="margin-bottom:10px;">${mapButton(otherUser?.location || otherUser?.address, otherUser?.latitude, otherUser?.longitude, 'Profile Map')}</div>
              ${allowActions && offer.status === 'Pending' ? `
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                  <button class="btn small" onclick="updateOfferStatus(${offer.id}, 'Accepted')">Accept</button>
                  <button class="btn danger small" onclick="updateOfferStatus(${offer.id}, 'Declined')">Decline</button>
                </div>
              ` : ''}
              ${canWithdraw ? `
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                  <button class="btn danger small" onclick="withdrawOffer(${offer.id})">Withdraw Order</button>
                </div>
              ` : ''}
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

window.updateOfferStatus = async function updateOfferStatus(offerId, status) {
  try {
    await api(`/offers/${offerId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    toast(`Offer ${status.toLowerCase()}.`);
    if (state.activeTab === 'incoming-orders') loadIncomingOrders();
    if (state.activeTab === 'home') loadHomeOverview();
  } catch (error) {
    toast(error.message, 'error');
  }
};

window.withdrawOffer = async function withdrawOffer(offerId) {
  if (!confirm('Withdraw this order request from the farmer?')) return;
  try {
    await api(`/offers/${offerId}/withdraw`, { method: 'PUT', body: JSON.stringify({ requester_id: state.user.id }) });
    toast('Order withdrawn.');
    if (state.activeTab === 'my-orders') loadMyOrders();
    if (state.activeTab === 'home') loadHomeOverview();
  } catch (error) {
    toast(error.message, 'error');
  }
};

function handleChatSubmit(event) {
  event.preventDefault();
  const input = event.target.elements.message;
  const message = String(input.value || '').trim();
  if (!message) return;
  addChatBubble(message, true);
  input.value = '';
  runAssistantCommand(message);
}

function runAssistantCommand(message) {
  const lowered = String(message || '').toLowerCase();
  if (!lowered) return;
  if (lowered.includes('tip')) {
    addChatBubble(roleTips(state.user.role).map((tip, index) => `${index + 1}. ${tip}`).join('\\n'));
    return;
  }
  if (lowered.includes('home')) {
    addChatBubble('Opening your Home control room.');
    changeTab('home');
    return;
  }
  if (lowered.includes('profile')) {
    addChatBubble('Opening profile editor so you can update photo, phone and map location.');
    changeTab('profile');
    return;
  }
  if (lowered.includes('nearby stores') || lowered.includes('agri store') || lowered.includes('krishi kendra') || lowered.includes('fertilizer') || lowered.includes('pesticide shop')) {
    if (state.user.role === 'Farmer') {
      addChatBubble('Opening Nearby Agri Stores. Allow location permission for live results.');
      changeTab('nearby-agri-stores');
      return;
    }
  }
  if (lowered.includes('crop advisor') || lowered.includes('suitable crop') || lowered.includes('soil') || lowered.includes('weather')) {
    if (state.user.role === 'Farmer') {
      addChatBubble('Opening Crop Advisor. Select soil, rain, humidity and water source.');
      changeTab('crop-advisor');
      return;
    }
  }
  if (lowered.includes('scheme') || lowered.includes('subsidy')) {
    if (state.user.role === 'Farmer') {
      addChatBubble('Opening Karnataka Schemes with benefit, link, procedure and helpline.');
      changeTab('schemes');
      return;
    }
  }
  if (lowered.includes('pesticide') || lowered.includes('seeds')) {
    if (state.user.role === 'Farmer') {
      addChatBubble('Opening Pesticides & Seeds reference guide.');
      changeTab('agri-inputs');
      return;
    }
  }
  if (lowered.includes('labour available nearby') || lowered.includes('find labour') || lowered.includes('labour nearby')) {
    if (state.user.role === 'Farmer') {
      addChatBubble('Opening Book Labour so you can view online labourers and book a slot.');
      changeTab('find-labour');
      return;
    }
    if (state.user.role === 'Labour') {
      addChatBubble('Opening Availability. Turn on Go Online and add working slots.');
      changeTab('availability');
      return;
    }
  }
  if (lowered.includes('go online') || lowered.includes('availability')) {
    if (state.user.role === 'Labour') {
      addChatBubble('Opening Availability. Turn on Go Online and add working slots.');
      changeTab('availability');
      return;
    }
  }
  if (lowered.includes('my bookings') || lowered.includes('bookings')) {
    if (state.user.role === 'Labour') {
      addChatBubble('Opening your bookings. You can revoke a booked slot from there.');
      changeTab('bookings');
      return;
    }
  }
  if (lowered.includes('see rate and stats') || lowered.includes('stats') || lowered.includes('profit') || lowered.includes('earning')) {
    const target = state.user.role === 'Farmer' ? 'farmer-profit' : state.user.role === 'Labour' ? 'labour-stats' : 'my-orders';
    addChatBubble('Opening your stats/profit section.');
    changeTab(target);
    return;
  }
  if (lowered.includes('farmer crops') || lowered.includes('bulk') || lowered.includes('farm market')) {
    if (state.user.role === 'Consumer') {
      addChatBubble('Opening Buy from Farmers market.');
      changeTab('farmer-market');
      return;
    }
  }
  if (lowered.includes('incoming orders')) {
    if (state.user.role === 'Farmer') {
      addChatBubble('Opening Customer Orders.');
      changeTab('incoming-orders');
      return;
    }
  }
  if (lowered.includes('list crop') || lowered.includes('list item')) {
    if (state.user.role === 'Farmer') {
      addChatBubble('Opening List Crops. You can also delete crop listings from there.');
      changeTab('farmer-items');
      return;
    }
  }
  if (lowered.includes('my orders')) {
    addChatBubble('Opening My Orders & Deals.');
    changeTab(state.user.role === 'Consumer' ? 'my-orders' : 'home');
    return;
  }
  addChatBubble('I can open screens and give role tips. Try: “nearby stores”, “crop advisor”, “schemes”, “tips”, “labour available nearby”, or “farmer crops”.');
}

function addChatBubble(message, isUser = false) {
  const box = document.getElementById('chatMessages');
  if (!box) return;
  const bubble = document.createElement('div');
  bubble.className = `bubble ${isUser ? 'user' : ''}`;
  bubble.textContent = message;
  box.appendChild(bubble);
  box.scrollTop = box.scrollHeight;
}

refreshUser().finally(render);
