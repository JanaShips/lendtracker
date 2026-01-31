import React, { useState, useEffect, createContext, useContext } from 'react'
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { 
  Plus, TrendingUp, TrendingDown, Users, Calendar, 
  Percent, Edit2, Trash2, X, ChevronDown, Search,
  CreditCard, Clock, CheckCircle, AlertCircle, LayoutDashboard,
  List, PlusCircle, Calculator, History, Globe,
  IndianRupee, CalendarDays, Lock, Eye, EyeOff, LogOut,
  User, Mail, Phone, ArrowRight, ArrowLeft, Sparkles, Shield, KeyRound,
  Settings, Save, RefreshCw, Palette, Bell, Download, Send,
  FileText, FileSpreadsheet, Printer, Filter, ShieldCheck, Activity,
  UserCheck, UserX, Crown, BarChart3, WifiOff, Wifi
} from 'lucide-react'

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const storedToken = localStorage.getItem('lendtracker_token')
    const storedUser = localStorage.getItem('lendtracker_user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (authData) => {
    setToken(authData.token)
    setUser({
      id: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role || 'USER'
    })
    localStorage.setItem('lendtracker_token', authData.token)
    localStorage.setItem('lendtracker_user', JSON.stringify({
      id: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role || 'USER'
    }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('lendtracker_token')
    localStorage.removeItem('lendtracker_user')
  }

  const updateUser = (updates) => {
    const newUser = { ...user, ...updates }
    setUser(newUser)
    localStorage.setItem('lendtracker_user', JSON.stringify(newUser))
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================
// TRANSLATIONS - English & Telugu
// ============================================
const translations = {
  en: {
    appName: 'LendTracker',
    appTagline: 'Track Money You\'ve Lent Out',
    dashboard: 'Dashboard',
    loans: 'Loans',
    addLoan: 'Add Loan',
    calculator: 'Calculator',
    history: 'History',
    totalLentOut: 'Total Lent Out',
    monthlyInterestExpected: 'Monthly Interest Expected',
    activeLoans: 'Active Loans',
    avgInterestRate: 'Avg Interest Rate',
    interestReceived: 'Interest Received',
    principalReceived: 'Principal Received',
    fullyRepaidLoans: 'Fully Repaid Loans',
    loansByFrequency: 'Loans by Payment Frequency',
    topBorrowers: 'Top Borrowers (Who Owes You Most)',
    noDataAvailable: 'No data available',
    borrowerName: 'Borrower Name',
    borrowerNamePlaceholder: 'Who did you lend money to?',
    phone: 'Phone',
    email: 'Email',
    amountLent: 'Amount Lent',
    interestRate: 'Interest Rate (%)',
    dateLent: 'Date Lent',
    dueDate: 'Due Date',
    interestFrequency: 'Interest Frequency',
    status: 'Status',
    notes: 'Notes',
    notesPlaceholder: 'Add any notes...',
    cancel: 'Cancel',
    update: 'Update Loan',
    add: 'Add Loan',
    editLoan: 'Edit Loan',
    addNewLoan: 'Add New Loan',
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Bi-Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
    active: 'Active',
    closed: 'Closed',
    defaulted: 'Defaulted',
    allStatus: 'All Status',
    noContactInfo: 'No contact info',
    principalReceivedBack: 'Principal Received Back',
    due: 'Due',
    recordInterestReceived: 'Record Interest Received',
    recordPrincipalReceived: 'Record Principal Received',
    recordingPaymentFrom: 'Recording payment from',
    amount: 'Amount',
    paymentDate: 'Payment Date',
    paymentNotes: 'Notes (Optional)',
    recordReceived: 'Record Received',
    interestCalculator: 'Interest Calculator',
    principal: 'Principal Amount',
    calculateInterest: 'Calculate Interest',
    duration: 'Duration (Months)',
    calculationResults: 'Calculation Results',
    perPayment: 'Per Payment',
    monthlyInterest: 'Monthly Interest',
    yearlyInterest: 'Yearly Interest',
    totalInterest: 'Total Interest',
    totalReturn: 'Total Return',
    enterDetails: 'Enter loan details to calculate interest',
    paymentHistory: 'Payment History',
    recentPayments: 'Recent Payments',
    allPayments: 'All Payments',
    noPaymentsYet: 'No payments recorded yet',
    interest: 'Interest',
    viewHistory: 'View History',
    searchPlaceholder: 'Search by borrower name...',
    noLoansFound: 'No loans found',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this loan?',
    retry: 'Retry',
    loading: 'Loading...',
    somethingWentWrong: 'Something went wrong. Please refresh the page.',
    // Auth
    login: 'Login',
    register: 'Register',
    welcomeBack: 'Welcome Back!',
    createAccount: 'Create Account',
    enterCredentials: 'Enter your credentials to access your account',
    joinUs: 'Join us to start tracking your loans',
    name: 'Full Name',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    welcome: 'Welcome',
    getStarted: 'Get Started',
    // OTP Verification
    verifyYourEmail: 'Verify Your Email',
    otpSentTo: "We've sent a 6-digit OTP to",
    enterOtp: 'Enter OTP',
    verifyEmail: 'Verify Email',
    didntReceiveOtp: "Didn't receive the OTP?",
    resendIn: 'Resend in',
    resendOtp: 'Resend OTP',
    sending: 'Sending...',
    backToLogin: 'Back to Login',
    // Home
    heroTitle: 'Smart Loan Tracking',
    heroSubtitle: 'for Smart Lenders',
    heroDescription: 'Track your personal loans, calculate interest, and manage repayments with ease. Built for Indian lenders.',
    feature1Title: 'Track Loans',
    feature1Desc: 'Keep all your loans organized in one place',
    feature2Title: 'Interest Calculator',
    feature2Desc: 'Calculate interest with multiple frequencies',
    feature3Title: 'Payment History',
    feature3Desc: 'Complete record of all transactions',
    startTracking: 'Start Tracking Free',
    // Settings
    settings: 'Settings',
    profile: 'Profile',
    profileSettings: 'Profile Settings',
    updateProfile: 'Update Profile',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    passwordChanged: 'Password changed successfully',
    profileUpdated: 'Profile updated successfully',
    appSettings: 'App Settings',
    defaultInterestRate: 'Default Interest Rate',
    defaultFrequency: 'Default Payment Frequency',
    notifications: 'Notifications',
    enableNotifications: 'Enable Notifications',
    exportData: 'Export Data',
    exportPDF: 'Export to PDF',
    exportCSV: 'Export to CSV',
    loanReport: 'Loan Report',
    generatedOn: 'Generated on',
    loanSummary: 'Loan Summary',
    dangerZone: 'Danger Zone',
    deleteAccount: 'Delete Account',
    memberSince: 'Member Since',
    save: 'Save',
    saving: 'Saving...',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove',
    // Email Verification
    emailVerified: 'Email Verified',
    emailNotVerified: 'Email Not Verified',
    sendOtp: 'Send Verification OTP',
    otpSent: 'OTP sent to your email!',
    verify: 'Verify',
    // Forgot Password
    forgotPasswordTitle: 'Forgot Password',
    forgotPasswordDesc: 'Enter your email address and we\'ll send you a link to reset your password.',
    sendResetLink: 'Send Reset Link',
    resetLinkSent: 'If an account exists with this email, you will receive a password reset link shortly.',
    resetPassword: 'Reset Password',
    resetPasswordDesc: 'Enter your new password below.',
    passwordResetSuccess: 'Your password has been reset successfully. You can now login with your new password.',
    invalidResetLink: 'Invalid or expired reset link. Please request a new one.',
    verifyingLink: 'Verifying reset link...',
  },
  te: {
    appName: 'లెండ్‌ట్రాకర్',
    appTagline: 'మీరు అప్పు ఇచ్చిన డబ్బును ట్రాక్ చేయండి',
    dashboard: 'డాష్‌బోర్డ్',
    loans: 'అప్పులు',
    addLoan: 'అప్పు జోడించు',
    calculator: 'కాల్క్యులేటర్',
    history: 'చరిత్ర',
    totalLentOut: 'మొత్తం అప్పు ఇచ్చినది',
    monthlyInterestExpected: 'నెలవారీ వడ్డీ అంచనా',
    activeLoans: 'యాక్టివ్ అప్పులు',
    avgInterestRate: 'సగటు వడ్డీ రేటు',
    interestReceived: 'అందుకున్న వడ్డీ',
    principalReceived: 'అందుకున్న అసలు',
    fullyRepaidLoans: 'పూర్తిగా తిరిగి చెల్లించిన అప్పులు',
    loansByFrequency: 'చెల్లింపు తరచుదనం ప్రకారం అప్పులు',
    topBorrowers: 'ఎక్కువ బాకీ ఉన్నవారు',
    noDataAvailable: 'డేటా అందుబాటులో లేదు',
    borrowerName: 'అప్పు తీసుకున్నవారి పేరు',
    borrowerNamePlaceholder: 'మీరు ఎవరికి అప్పు ఇచ్చారు?',
    phone: 'ఫోన్',
    email: 'ఇమెయిల్',
    amountLent: 'ఇచ్చిన మొత్తం',
    interestRate: 'వడ్డీ రేటు (%)',
    dateLent: 'ఇచ్చిన తేదీ',
    dueDate: 'గడువు తేదీ',
    interestFrequency: 'వడ్డీ తరచుదనం',
    status: 'స్థితి',
    notes: 'గమనికలు',
    notesPlaceholder: 'గమనికలు జోడించండి...',
    cancel: 'రద్దు చేయి',
    update: 'అప్పు అప్‌డేట్ చేయి',
    add: 'అప్పు జోడించు',
    editLoan: 'అప్పు సవరించు',
    addNewLoan: 'కొత్త అప్పు జోడించు',
    daily: 'రోజువారీ',
    weekly: 'వారపు',
    biweekly: 'రెండు వారాలకొకసారి',
    monthly: 'నెలవారీ',
    quarterly: 'త్రైమాసికం',
    yearly: 'సంవత్సరానికొకసారి',
    active: 'యాక్టివ్',
    closed: 'ముగిసింది',
    defaulted: 'డిఫాల్ట్',
    allStatus: 'అన్ని స్థితులు',
    noContactInfo: 'సంప్రదింపు సమాచారం లేదు',
    principalReceivedBack: 'తిరిగి అందుకున్న అసలు',
    due: 'గడువు',
    recordInterestReceived: 'అందుకున్న వడ్డీని నమోదు చేయండి',
    recordPrincipalReceived: 'అందుకున్న అసలును నమోదు చేయండి',
    recordingPaymentFrom: 'ఈ వ్యక్తి నుండి చెల్లింపు నమోదు',
    amount: 'మొత్తం',
    paymentDate: 'చెల్లింపు తేదీ',
    paymentNotes: 'గమనికలు (ఐచ్ఛికం)',
    recordReceived: 'నమోదు చేయండి',
    interestCalculator: 'వడ్డీ కాల్క్యులేటర్',
    principal: 'అసలు మొత్తం',
    calculateInterest: 'వడ్డీ లెక్కించు',
    duration: 'వ్యవధి (నెలలు)',
    calculationResults: 'లెక్కింపు ఫలితాలు',
    perPayment: 'ప్రతి చెల్లింపు',
    monthlyInterest: 'నెలవారీ వడ్డీ',
    yearlyInterest: 'సంవత్సర వడ్డీ',
    totalInterest: 'మొత్తం వడ్డీ',
    totalReturn: 'మొత్తం రిటర్న్',
    enterDetails: 'వడ్డీ లెక్కించడానికి అప్పు వివరాలు నమోదు చేయండి',
    paymentHistory: 'చెల్లింపు చరిత్ర',
    recentPayments: 'ఇటీవలి చెల్లింపులు',
    allPayments: 'అన్ని చెల్లింపులు',
    noPaymentsYet: 'ఇంకా చెల్లింపులు నమోదు కాలేదు',
    interest: 'వడ్డీ',
    viewHistory: 'చరిత్ర చూడండి',
    searchPlaceholder: 'అప్పు తీసుకున్నవారి పేరు ద్వారా శోధించండి...',
    noLoansFound: 'అప్పులు కనుగొనబడలేదు',
    delete: 'తొలగించు',
    confirmDelete: 'మీరు ఈ అప్పును తొలగించాలనుకుంటున్నారా?',
    retry: 'మళ్ళీ ప్రయత్నించండి',
    loading: 'లోడ్ అవుతోంది...',
    somethingWentWrong: 'ఏదో తప్పు జరిగింది. పేజీని రిఫ్రెష్ చేయండి.',
    login: 'లాగిన్',
    register: 'రిజిస్టర్',
    welcomeBack: 'మళ్ళీ స్వాగతం!',
    createAccount: 'ఖాతా సృష్టించండి',
    enterCredentials: 'మీ ఖాతాను యాక్సెస్ చేయడానికి వివరాలు నమోదు చేయండి',
    joinUs: 'మీ అప్పులను ట్రాక్ చేయడం ప్రారంభించండి',
    name: 'పూర్తి పేరు',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    dontHaveAccount: 'ఖాతా లేదా?',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    signIn: 'సైన్ ఇన్',
    signUp: 'సైన్ అప్',
    logout: 'లాగౌట్',
    welcome: 'స్వాగతం',
    getStarted: 'ప్రారంభించండి',
    // OTP Verification
    verifyYourEmail: 'మీ ఇమెయిల్‌ను ధృవీకరించండి',
    otpSentTo: 'మేము 6-అంకెల OTPని పంపాము',
    enterOtp: 'OTP నమోదు చేయండి',
    verifyEmail: 'ఇమెయిల్ ధృవీకరించండి',
    didntReceiveOtp: 'OTP రాలేదా?',
    resendIn: 'మళ్ళీ పంపడానికి',
    resendOtp: 'OTP మళ్ళీ పంపండి',
    sending: 'పంపుతోంది...',
    backToLogin: 'లాగిన్‌కు తిరిగి',
    heroTitle: 'స్మార్ట్ లోన్ ట్రాకింగ్',
    heroSubtitle: 'స్మార్ట్ లెండర్స్ కోసం',
    heroDescription: 'మీ వ్యక్తిగత అప్పులను ట్రాక్ చేయండి, వడ్డీని లెక్కించండి, మరియు చెల్లింపులను సులభంగా నిర్వహించండి.',
    feature1Title: 'అప్పులు ట్రాక్',
    feature1Desc: 'మీ అన్ని అప్పులను ఒకే చోట నిర్వహించండి',
    feature2Title: 'వడ్డీ కాల్క్యులేటర్',
    feature2Desc: 'వివిధ తరచుదనంతో వడ్డీని లెక్కించండి',
    feature3Title: 'చెల్లింపు చరిత్ర',
    feature3Desc: 'అన్ని లావాదేవీల పూర్తి రికార్డు',
    startTracking: 'ఉచితంగా ట్రాకింగ్ ప్రారంభించండి',
    // Settings
    settings: 'సెట్టింగ్‌లు',
    profile: 'ప్రొఫైల్',
    profileSettings: 'ప్రొఫైల్ సెట్టింగ్‌లు',
    updateProfile: 'ప్రొఫైల్ అప్‌డేట్ చేయి',
    changePassword: 'పాస్‌వర్డ్ మార్చు',
    currentPassword: 'ప్రస్తుత పాస్‌వర్డ్',
    newPassword: 'కొత్త పాస్‌వర్డ్',
    confirmNewPassword: 'కొత్త పాస్‌వర్డ్ నిర్ధారించండి',
    passwordChanged: 'పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది',
    memberSince: 'సభ్యత్వం నుండి',
    save: 'సేవ్ చేయి',
    saving: 'సేవ్ అవుతోంది...',
    changePhoto: 'ఫోటో మార్చండి',
    removePhoto: 'తొలగించు',
    // Email Verification
    emailVerified: 'ఇమెయిల్ ధృవీకరించబడింది',
    emailNotVerified: 'ఇమెయిల్ ధృవీకరించబడలేదు',
    sendOtp: 'OTP పంపండి',
    otpSent: 'OTP మీ ఇమెయిల్‌కు పంపబడింది!',
    verify: 'ధృవీకరించు',
    // Forgot Password
    forgotPasswordTitle: 'పాస్‌వర్డ్ మర్చిపోయారా',
    forgotPasswordDesc: 'మీ ఇమెయిల్ చిరునామా నమోదు చేయండి, మేము మీకు పాస్‌వర్డ్ రీసెట్ లింక్ పంపుతాము.',
    sendResetLink: 'రీసెట్ లింక్ పంపండి',
    resetLinkSent: 'ఈ ఇమెయిల్‌తో ఖాతా ఉంటే, మీకు పాస్‌వర్డ్ రీసెట్ లింక్ అందుతుంది.',
    resetPassword: 'పాస్‌వర్డ్ రీసెట్ చేయండి',
    resetPasswordDesc: 'మీ కొత్త పాస్‌వర్డ్ క్రింద నమోదు చేయండి.',
    passwordResetSuccess: 'మీ పాస్‌వర్డ్ విజయవంతంగా రీసెట్ చేయబడింది. మీరు ఇప్పుడు కొత్త పాస్‌వర్డ్‌తో లాగిన్ చేయవచ్చు.',
    invalidResetLink: 'చెల్లని లేదా గడువు ముగిసిన రీసెట్ లింక్. దయచేసి కొత్తది అభ్యర్థించండి.',
    verifyingLink: 'రీసెట్ లింక్ ధృవీకరిస్తోంది...',
    profileUpdated: 'ప్రొఫైల్ విజయవంతంగా అప్‌డేట్ చేయబడింది',
    appSettings: 'యాప్ సెట్టింగ్‌లు',
    defaultInterestRate: 'డిఫాల్ట్ వడ్డీ రేటు',
    defaultFrequency: 'డిఫాల్ట్ చెల్లింపు తరచుదనం',
    notifications: 'నోటిఫికేషన్‌లు',
    enableNotifications: 'నోటిఫికేషన్‌లను ఎనేబుల్ చేయండి',
    exportData: 'డేటా ఎక్స్‌పోర్ట్',
    exportPDF: 'PDF కు ఎక్స్‌పోర్ట్',
    exportCSV: 'CSV కు ఎక్స్‌పోర్ట్',
    loanReport: 'అప్పు నివేదిక',
    generatedOn: 'జనరేట్ చేయబడింది',
    loanSummary: 'అప్పు సారాంశం',
    dangerZone: 'ప్రమాద జోన్',
    deleteAccount: 'ఖాతా తొలగించు',
  },
  hi: {
    appName: 'लेंडट्रैकर',
    appTagline: 'अपने उधार दिए गए पैसे को ट्रैक करें',
    dashboard: 'डैशबोर्ड',
    loans: 'ऋण',
    addLoan: 'ऋण जोड़ें',
    calculator: 'कैलकुलेटर',
    history: 'इतिहास',
    totalLentOut: 'कुल उधार दिया',
    monthlyInterestExpected: 'अपेक्षित मासिक ब्याज',
    activeLoans: 'सक्रिय ऋण',
    avgInterestRate: 'औसत ब्याज दर',
    interestReceived: 'प्राप्त ब्याज',
    principalReceived: 'प्राप्त मूलधन',
    fullyRepaidLoans: 'पूर्ण भुगतान किए गए ऋण',
    loansByFrequency: 'भुगतान आवृत्ति के अनुसार ऋण',
    topBorrowers: 'शीर्ष उधारकर्ता (सबसे ज्यादा कर्ज)',
    noDataAvailable: 'कोई डेटा उपलब्ध नहीं',
    borrowerName: 'उधारकर्ता का नाम',
    borrowerNamePlaceholder: 'आपने किसे पैसे उधार दिए?',
    phone: 'फोन',
    email: 'ईमेल',
    amountLent: 'उधार दी गई राशि',
    interestRate: 'ब्याज दर (%)',
    dateLent: 'उधार की तारीख',
    dueDate: 'नियत तारीख',
    interestFrequency: 'ब्याज आवृत्ति',
    status: 'स्थिति',
    notes: 'नोट्स',
    notesPlaceholder: 'कोई नोट्स जोड़ें...',
    cancel: 'रद्द करें',
    update: 'ऋण अपडेट करें',
    add: 'ऋण जोड़ें',
    editLoan: 'ऋण संपादित करें',
    addNewLoan: 'नया ऋण जोड़ें',
    daily: 'दैनिक',
    weekly: 'साप्ताहिक',
    biweekly: 'पाक्षिक',
    monthly: 'मासिक',
    quarterly: 'त्रैमासिक',
    yearly: 'वार्षिक',
    active: 'सक्रिय',
    closed: 'बंद',
    defaulted: 'डिफॉल्टेड',
    allStatus: 'सभी स्थिति',
    noContactInfo: 'कोई संपर्क जानकारी नहीं',
    principalReceivedBack: 'मूलधन वापस प्राप्त',
    due: 'देय',
    recordInterestReceived: 'प्राप्त ब्याज दर्ज करें',
    recordPrincipalReceived: 'प्राप्त मूलधन दर्ज करें',
    recordingPaymentFrom: 'से भुगतान दर्ज हो रहा है',
    amount: 'राशि',
    paymentDate: 'भुगतान की तारीख',
    paymentNotes: 'नोट्स (वैकल्पिक)',
    recordReceived: 'प्राप्ति दर्ज करें',
    interestCalculator: 'ब्याज कैलकुलेटर',
    principal: 'मूल राशि',
    calculateInterest: 'ब्याज की गणना करें',
    duration: 'अवधि (महीने)',
    calculationResults: 'गणना परिणाम',
    perPayment: 'प्रति भुगतान',
    monthlyInterest: 'मासिक ब्याज',
    yearlyInterest: 'वार्षिक ब्याज',
    totalInterest: 'कुल ब्याज',
    totalReturn: 'कुल वापसी',
    enterDetails: 'ब्याज की गणना के लिए ऋण विवरण दर्ज करें',
    paymentHistory: 'भुगतान इतिहास',
    recentPayments: 'हाल के भुगतान',
    allPayments: 'सभी भुगतान',
    noPaymentsYet: 'अभी तक कोई भुगतान दर्ज नहीं',
    interest: 'ब्याज',
    viewHistory: 'इतिहास देखें',
    searchPlaceholder: 'उधारकर्ता के नाम से खोजें...',
    noLoansFound: 'कोई ऋण नहीं मिला',
    delete: 'हटाएं',
    confirmDelete: 'क्या आप वाकई इस ऋण को हटाना चाहते हैं?',
    retry: 'पुनः प्रयास करें',
    loading: 'लोड हो रहा है...',
    somethingWentWrong: 'कुछ गलत हो गया। कृपया पेज रिफ्रेश करें।',
    // Auth
    login: 'लॉगिन',
    register: 'रजिस्टर',
    welcomeBack: 'वापस स्वागत है!',
    createAccount: 'खाता बनाएं',
    enterCredentials: 'अपने खाते तक पहुंचने के लिए विवरण दर्ज करें',
    joinUs: 'अपने ऋणों को ट्रैक करना शुरू करें',
    name: 'पूरा नाम',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    dontHaveAccount: 'खाता नहीं है?',
    alreadyHaveAccount: 'पहले से खाता है?',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    logout: 'लॉगआउट',
    welcome: 'स्वागत है',
    getStarted: 'शुरू करें',
    // OTP Verification
    verifyYourEmail: 'अपना ईमेल सत्यापित करें',
    otpSentTo: 'हमने 6-अंकीय OTP भेजा है',
    enterOtp: 'OTP दर्ज करें',
    verifyEmail: 'ईमेल सत्यापित करें',
    didntReceiveOtp: 'OTP नहीं मिला?',
    resendIn: 'पुनः भेजें',
    resendOtp: 'OTP पुनः भेजें',
    sending: 'भेज रहा है...',
    backToLogin: 'लॉगिन पर वापस जाएं',
    // Home
    heroTitle: 'स्मार्ट लोन ट्रैकिंग',
    heroSubtitle: 'स्मार्ट लेंडर्स के लिए',
    heroDescription: 'अपने व्यक्तिगत ऋणों को ट्रैक करें, ब्याज की गणना करें, और भुगतान आसानी से प्रबंधित करें।',
    feature1Title: 'ऋण ट्रैक करें',
    feature1Desc: 'अपने सभी ऋणों को एक जगह व्यवस्थित रखें',
    feature2Title: 'ब्याज कैलकुलेटर',
    feature2Desc: 'विभिन्न आवृत्तियों के साथ ब्याज की गणना करें',
    feature3Title: 'भुगतान इतिहास',
    feature3Desc: 'सभी लेनदेन का पूर्ण रिकॉर्ड',
    startTracking: 'मुफ्त में ट्रैकिंग शुरू करें',
    // Settings
    settings: 'सेटिंग्स',
    profile: 'प्रोफाइल',
    profileSettings: 'प्रोफाइल सेटिंग्स',
    updateProfile: 'प्रोफाइल अपडेट करें',
    changePassword: 'पासवर्ड बदलें',
    currentPassword: 'वर्तमान पासवर्ड',
    newPassword: 'नया पासवर्ड',
    confirmNewPassword: 'नए पासवर्ड की पुष्टि करें',
    passwordChanged: 'पासवर्ड सफलतापूर्वक बदला गया',
    profileUpdated: 'प्रोफाइल सफलतापूर्वक अपडेट की गई',
    appSettings: 'ऐप सेटिंग्स',
    defaultInterestRate: 'डिफॉल्ट ब्याज दर',
    defaultFrequency: 'डिफॉल्ट भुगतान आवृत्ति',
    notifications: 'सूचनाएं',
    enableNotifications: 'सूचनाएं सक्षम करें',
    exportData: 'डेटा निर्यात करें',
    exportPDF: 'PDF में निर्यात करें',
    exportCSV: 'CSV में निर्यात करें',
    loanReport: 'ऋण रिपोर्ट',
    generatedOn: 'जनरेट किया गया',
    loanSummary: 'ऋण सारांश',
    dangerZone: 'खतरा क्षेत्र',
    deleteAccount: 'खाता हटाएं',
    memberSince: 'सदस्य तब से',
    save: 'सहेजें',
    saving: 'सहेज रहा है...',
    changePhoto: 'फोटो बदलें',
    removePhoto: 'हटाएं',
    // Email Verification
    emailVerified: 'ईमेल सत्यापित',
    emailNotVerified: 'ईमेल सत्यापित नहीं',
    sendOtp: 'OTP भेजें',
    otpSent: 'OTP आपके ईमेल पर भेजा गया!',
    verify: 'सत्यापित करें',
    // Forgot Password
    forgotPasswordTitle: 'पासवर्ड भूल गए',
    forgotPasswordDesc: 'अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट लिंक भेजेंगे।',
    sendResetLink: 'रीसेट लिंक भेजें',
    resetLinkSent: 'अगर इस ईमेल से कोई खाता है, तो आपको जल्द ही पासवर्ड रीसेट लिंक मिलेगा।',
    resetPassword: 'पासवर्ड रीसेट करें',
    resetPasswordDesc: 'नीचे अपना नया पासवर्ड दर्ज करें।',
    passwordResetSuccess: 'आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है। अब आप नए पासवर्ड से लॉगिन कर सकते हैं।',
    invalidResetLink: 'अमान्य या समाप्त रीसेट लिंक। कृपया नया अनुरोध करें।',
    verifyingLink: 'रीसेट लिंक सत्यापित हो रहा है...',
  }
}

// Language Context
const LanguageContext = createContext()
const LANGUAGE_KEY = 'lendtracker_language'

function useTranslation() {
  const { language } = useContext(LanguageContext)
  return translations[language]
}

// ============================================
// API Configuration
// ============================================
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Connection error types for better error handling
const CONNECTION_ERROR_TYPES = {
  TIMEOUT: 'TIMEOUT',
  NETWORK: 'NETWORK',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
}

// Custom error class for API errors
class ApiError extends Error {
  constructor(message, type, status = null) {
    super(message)
    this.name = 'ApiError'
    this.type = type
    this.status = status
  }
}

// Fetch with timeout support
async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection.', CONNECTION_ERROR_TYPES.TIMEOUT)
    }
    throw error
  }
}

// Fetch with retry and exponential backoff
async function fetchWithRetry(url, options = {}, { maxRetries = 3, timeout = 15000, retryDelay = 1000 } = {}) {
  let lastError
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout)
      
      // Check for server errors that might be worth retrying
      if (response.status >= 500 && attempt < maxRetries) {
        throw new ApiError(`Server error (${response.status})`, CONNECTION_ERROR_TYPES.SERVER, response.status)
      }
      
      return response
    } catch (error) {
      lastError = error
      
      // Don't retry on client errors (4xx) or if we've exhausted retries
      if (error instanceof ApiError && error.type === CONNECTION_ERROR_TYPES.TIMEOUT) {
        // Timeout errors are worth retrying
        console.log(`Request timeout, attempt ${attempt + 1}/${maxRetries + 1}`)
      } else if (error.name === 'TypeError' || error.message?.includes('fetch')) {
        // Network errors (no internet, DNS issues, etc.)
        console.log(`Network error, attempt ${attempt + 1}/${maxRetries + 1}`)
      } else if (error instanceof ApiError && error.type === CONNECTION_ERROR_TYPES.SERVER) {
        // Server errors (5xx)
        console.log(`Server error, attempt ${attempt + 1}/${maxRetries + 1}`)
      } else {
        // Don't retry for other errors
        throw error
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  // Convert the last error to a user-friendly ApiError
  if (lastError instanceof ApiError) {
    throw lastError
  } else if (lastError.name === 'TypeError' || lastError.message?.includes('fetch')) {
    throw new ApiError(
      'Unable to connect to server. Please check your internet connection.',
      CONNECTION_ERROR_TYPES.NETWORK
    )
  } else {
    throw new ApiError(
      'An unexpected error occurred. Please try again.',
      CONNECTION_ERROR_TYPES.UNKNOWN
    )
  }
}

// Helper to get user-friendly error message
function getErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error.name === 'TypeError' || error.message?.includes('fetch') || error.message?.includes('network')) {
    return 'Unable to connect to server. Please check your internet connection.'
  }
  if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
    return 'Request timed out. Server may be busy, please try again.'
  }
  return error.message || 'An unexpected error occurred. Please try again.'
}

// API Functions with Auth
function createApi(token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }

  // Helper for making API requests with retry logic
  const apiRequest = async (url, options = {}, skipRetry = false) => {
    const fetchFn = skipRetry ? fetchWithTimeout : fetchWithRetry
    return fetchFn(url, { ...options }, skipRetry ? 15000 : undefined)
  }

  return {
    // Auth endpoints (no retry for auth to avoid duplicate submissions)
    register: async (data) => {
      const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    login: async (data) => {
      const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    forgotPassword: async (email) => {
      const res = await fetchWithTimeout(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      return res.json()
    },
    validateResetToken: async (token) => {
      const res = await fetchWithRetry(`${API_BASE}/auth/validate-reset-token?token=${encodeURIComponent(token)}`)
      return res.json()
    },
    resetPassword: async (token, newPassword) => {
      const res = await fetchWithTimeout(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })
      return res.json()
    },
    verifyEmail: async (email, otp) => {
      const res = await fetchWithTimeout(`${API_BASE}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      return res.json()
    },
    sendVerificationOtp: async () => {
      const res = await fetchWithTimeout(`${API_BASE}/auth/send-verification-otp`, {
        method: 'POST',
        headers
      })
      return res.json()
    },
    // Loan endpoints (with retry for GET requests)
  getLoans: async () => {
      const res = await fetchWithRetry(`${API_BASE}/loans`, { headers })
      if (!res.ok) throw new Error('Failed to fetch loans')
      return res.json()
    },
    searchLoans: async (params = {}) => {
      const queryParams = new URLSearchParams()
      if (params.q) queryParams.append('q', params.q)
      if (params.status) queryParams.append('status', params.status)
      if (params.frequency) queryParams.append('frequency', params.frequency)
      if (params.minAmount) queryParams.append('minAmount', params.minAmount)
      if (params.maxAmount) queryParams.append('maxAmount', params.maxAmount)
      if (params.minRate) queryParams.append('minRate', params.minRate)
      if (params.maxRate) queryParams.append('maxRate', params.maxRate)
      if (params.fromDate) queryParams.append('fromDate', params.fromDate)
      if (params.toDate) queryParams.append('toDate', params.toDate)
      
      const queryString = queryParams.toString()
      const url = `${API_BASE}/loans/search${queryString ? '?' + queryString : ''}`
      const res = await fetchWithRetry(url, { headers })
      if (!res.ok) throw new Error('Failed to search loans')
      return res.json()
    },
    getFilterCounts: async () => {
      const res = await fetchWithRetry(`${API_BASE}/loans/filter-counts`, { headers })
      if (!res.ok) throw new Error('Failed to get filter counts')
      return res.json()
  },
  getDashboard: async () => {
      const res = await fetchWithRetry(`${API_BASE}/loans/dashboard`, { headers })
      if (!res.ok) throw new Error('Failed to fetch dashboard')
      return res.json()
  },
  createLoan: async (loan) => {
      const res = await fetchWithTimeout(`${API_BASE}/loans`, {
        method: 'POST',
        headers,
        body: JSON.stringify(loan)
      })
      if (!res.ok) throw new Error('Failed to create loan')
      return res.json()
  },
  updateLoan: async (id, loan) => {
      const res = await fetchWithTimeout(`${API_BASE}/loans/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(loan)
      })
      if (!res.ok) throw new Error('Failed to update loan')
      return res.json()
  },
  deleteLoan: async (id) => {
      const res = await fetchWithTimeout(`${API_BASE}/loans/${id}`, {
        method: 'DELETE',
        headers
      })
      if (!res.ok) throw new Error('Failed to delete loan')
  },
  receiveInterest: async (id, amount, paymentDate, notes) => {
      const res = await fetchWithTimeout(`${API_BASE}/loans/${id}/receive-interest`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount, paymentDate, notes })
      })
      if (!res.ok) throw new Error('Failed to record interest')
      return res.json()
  },
  receivePrincipal: async (id, amount, paymentDate, notes) => {
      const res = await fetchWithTimeout(`${API_BASE}/loans/${id}/receive-principal`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount, paymentDate, notes })
      })
      if (!res.ok) throw new Error('Failed to record principal')
      return res.json()
  },
  getPaymentHistory: async (loanId) => {
      const res = await fetchWithRetry(`${API_BASE}/loans/${loanId}/payment-history`, { headers })
      if (!res.ok) throw new Error('Failed to fetch payment history')
      return res.json()
  },
  getAllPaymentHistory: async () => {
      const res = await fetchWithRetry(`${API_BASE}/loans/payment-history/all`, { headers })
      if (!res.ok) throw new Error('Failed to fetch payment history')
      return res.json()
    },
    calculateInterest: async (principal, interestRate, frequency, days) => {
      // Helper function for local calculation fallback
      const calculateLocally = () => {
        const annualRate = interestRate / 100
        const yearlyInterest = principal * annualRate
        const monthlyInterest = yearlyInterest / 12
        const dailyInterest = yearlyInterest / 365
        
        const perPaymentInterest = {
          DAILY: dailyInterest,
          WEEKLY: yearlyInterest / 52,
          BIWEEKLY: yearlyInterest / 26,
          MONTHLY: monthlyInterest,
          QUARTERLY: monthlyInterest * 3,
          YEARLY: yearlyInterest
        }[frequency] || monthlyInterest
        
        const months = Math.ceil(days / 30)
        const totalInterest = monthlyInterest * months
        
        return {
          principal,
          interestRate,
          frequency,
          durationMonths: months,
          dailyInterest: Math.round(dailyInterest * 100) / 100,
          monthlyInterest: Math.round(monthlyInterest * 100) / 100,
          yearlyInterest: Math.round(yearlyInterest * 100) / 100,
          perPaymentInterest: Math.round(perPaymentInterest * 100) / 100,
          totalInterest: Math.round(totalInterest * 100) / 100,
          totalAmount: Math.round((principal + totalInterest) * 100) / 100
        }
      }

      try {
        const params = new URLSearchParams({ principal, interestRate, frequency, days })
        const res = await fetchWithRetry(`${API_BASE}/loans/calculate-interest?${params}`, { headers })
        if (!res.ok) {
          // Fallback to local calculation on server error
          return calculateLocally()
        }
        return res.json()
      } catch (err) {
        // Fallback to local calculation on network error
        console.log('Using local calculation due to connection issue:', err.message)
        return calculateLocally()
      }
    },
    // ==================== ADMIN API ====================
    adminGetUsers: async () => {
      const res = await fetchWithRetry(`${API_BASE}/admin/users`, { headers })
      if (!res.ok) throw new Error('Failed to fetch users')
      return res.json()
    },
    adminGetStats: async () => {
      const res = await fetchWithRetry(`${API_BASE}/admin/stats`, { headers })
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
    adminGetActivity: async (limit = 20) => {
      const res = await fetchWithRetry(`${API_BASE}/admin/activity?limit=${limit}`, { headers })
      if (!res.ok) throw new Error('Failed to fetch activity')
      return res.json()
    },
    adminToggleUserStatus: async (userId) => {
      const res = await fetchWithTimeout(`${API_BASE}/admin/users/${userId}/toggle-status`, {
        method: 'POST',
        headers
      })
      if (!res.ok) throw new Error('Failed to toggle user status')
      return res.json()
    },
    adminMakeAdmin: async (userId) => {
      const res = await fetchWithTimeout(`${API_BASE}/admin/users/${userId}/make-admin`, {
        method: 'POST',
        headers
      })
      if (!res.ok) throw new Error('Failed to make admin')
      return res.json()
    },
    adminRemoveAdmin: async (userId) => {
      const res = await fetchWithTimeout(`${API_BASE}/admin/users/${userId}/remove-admin`, {
        method: 'POST',
        headers
      })
      if (!res.ok) throw new Error('Failed to remove admin')
      return res.json()
    },
    adminCheckStatus: async () => {
      const res = await fetchWithRetry(`${API_BASE}/admin/check`, { headers })
      if (!res.ok) return { isAdmin: false }
      return res.json()
    }
  }
}

// ============================================
// Utility Functions
// ============================================
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Validation Functions
const validateIndianPhone = (phone) => {
  if (!phone) return true
  const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

const validateEmail = (email) => {
  if (!email) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ============================================
// CONNECTION STATUS INDICATOR
// ============================================
function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOffline, setShowOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Show "back online" message briefly
      setShowOffline(true)
      setTimeout(() => setShowOffline(false), 3000)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setShowOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showOffline) return null

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] px-4 py-3 text-center text-sm font-medium transition-all ${
      isOnline 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi size={16} />
            <span>Back online</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>No internet connection. Some features may not work.</span>
          </>
        )}
      </div>
    </div>
  )
}

// ============================================
// HOME / LANDING PAGE
// ============================================
function HomePage({ onGetStarted }) {
  const t = useTranslation()
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#1CC29F] rounded-lg flex items-center justify-center">
              <IndianRupee className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">{t.appName}</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 bg-[#1CC29F] hover:bg-[#16A085] text-white rounded-lg font-medium transition-all text-sm"
          >
            {t.getStarted}
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F8F5] rounded-full text-[#1CC29F] text-sm font-medium mb-6">
            <Sparkles size={14} />
            <span>Free • Secure • Easy to Use</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            {t.heroTitle}
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1CC29F] mb-6">
            {t.heroSubtitle}
          </h2>
          
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            {t.heroDescription}
          </p>

          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#1CC29F] hover:bg-[#16A085] text-white rounded-xl text-base font-semibold transition-all"
          >
            {t.startTracking}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#E8F8F5] rounded-xl flex items-center justify-center">
              <CreditCard className="text-[#1CC29F]" size={26} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.feature1Title}</h3>
            <p className="text-gray-500 text-sm">{t.feature1Desc}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-4 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calculator className="text-blue-600" size={26} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.feature2Title}</h3>
            <p className="text-gray-500 text-sm">{t.feature2Desc}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-4 bg-purple-50 rounded-xl flex items-center justify-center">
              <History className="text-purple-600" size={26} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.feature3Title}</h3>
            <p className="text-gray-500 text-sm">{t.feature3Desc}</p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#1CC29F]" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee size={18} className="text-[#1CC29F]" />
            <span>Made for India</span>
          </div>
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-[#1CC29F]" />
            <span>Your Data, Your Control</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
        <p>© 2026 LendTracker. All rights reserved.</p>
      </footer>
    </div>
  )
}

// ============================================
// AUTH PAGES
// ============================================
function LoginPage({ onSwitchToRegister, onLoginSuccess, onForgotPassword }) {
  const t = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const api = createApi(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.login({ email, password })
      
      if (response.token) {
        login(response)
        onLoginSuccess()
      } else {
        setError(response.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#1CC29F] rounded-xl flex items-center justify-center">
              <IndianRupee className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.welcomeBack}</h1>
            <p className="text-gray-500 text-sm">{t.enterCredentials}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">{t.password}</label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-[#1CC29F] hover:text-[#16A085] font-medium"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
            </div>
          )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] disabled:opacity-50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound size={18} />
                  {t.signIn}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            {t.dontHaveAccount}{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#1CC29F] hover:text-[#16A085] font-medium"
            >
              {t.signUp}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function RegisterPage({ onSwitchToLogin, onRegisterSuccess }) {
  const t = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const api = createApi(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (phone && !validateIndianPhone(phone)) {
      setError('Please enter a valid Indian mobile number')
      return
    }

    setLoading(true)

    try {
      const response = await api.register({ name, email, password, phone })
      
      if (response.token) {
        login(response)
        onRegisterSuccess()
      } else {
        setError(response.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#1CC29F] rounded-xl flex items-center justify-center">
              <IndianRupee className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.createAccount}</h1>
            <p className="text-gray-500 text-sm">{t.joinUs}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.name}</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.phone} (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.confirmPassword}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] disabled:opacity-50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <User size={18} />
                  {t.signUp}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            {t.alreadyHaveAccount}{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#1CC29F] hover:text-[#16A085] font-medium"
            >
              {t.signIn}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// OTP VERIFICATION PAGE
// ============================================
function OtpVerificationPage({ email, name, onVerificationSuccess, onBackToLogin }) {
  const t = useTranslation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const { login } = useAuth()
  const api = createApi(null)
  const inputRefs = Array(6).fill(0).map(() => React.createRef())

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Only single digit
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp]
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i]
      }
      setOtp(newOtp)
      inputRefs[Math.min(pasteData.length, 5)].current?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setLoading(true)

    try {
      const response = await api.verifyEmail(email, otpString)
      
      if (response.token) {
        login(response)
        onVerificationSuccess()
      } else {
        setError(response.message || 'Invalid OTP. Please try again.')
        setOtp(['', '', '', '', '', ''])
        inputRefs[0].current?.focus()
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    
    setResending(true)
    setError('')

    try {
      const response = await api.resendOtp(email)
      
      if (response.message && response.message.includes('OTP sent')) {
        setResendCooldown(60) // 60 second cooldown
        setOtp(['', '', '', '', '', ''])
        inputRefs[0].current?.focus()
      } else {
        setError(response.message || 'Failed to resend OTP')
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#1CC29F]/10 rounded-full flex items-center justify-center">
              <Mail className="text-[#1CC29F]" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.verifyYourEmail || 'Verify Your Email'}</h1>
            <p className="text-gray-500 text-sm">
              {t.otpSentTo || 'We\'ve sent a 6-digit OTP to'}
            </p>
            <p className="text-[#1CC29F] font-medium mt-1">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                {t.enterOtp || 'Enter OTP'}
              </label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] focus:ring-2 focus:ring-[#1CC29F]/20 transition-all text-gray-900"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] disabled:opacity-50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle size={18} />
                  {t.verifyEmail || 'Verify Email'}
                </>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              {t.didntReceiveOtp || "Didn't receive the OTP?"}{' '}
              {resendCooldown > 0 ? (
                <span className="text-gray-400">
                  {t.resendIn || 'Resend in'} {resendCooldown}s
                </span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-[#1CC29F] hover:text-[#16A085] font-medium disabled:opacity-50"
                >
                  {resending ? (t.sending || 'Sending...') : (t.resendOtp || 'Resend OTP')}
                </button>
              )}
            </p>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={onBackToLogin}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft size={16} />
              {t.backToLogin || 'Back to Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// FORGOT PASSWORD PAGE
// ============================================
function ForgotPasswordPage({ onBackToLogin }) {
  const t = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const api = createApi(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center">
              <Mail className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.forgotPasswordTitle}</h1>
            <p className="text-gray-500 text-sm">{t.forgotPasswordDesc}</p>
          </div>

          {sent ? (
            <div className="text-center space-y-5">
              <div className="p-4 bg-[#E8F8F5] border border-[#D0F0E8] rounded-lg text-[#1CC29F]">
                <CheckCircle className="mx-auto mb-2" size={32} />
                <p className="text-sm font-medium">{t.resetLinkSent}</p>
              </div>
              <button
                onClick={onBackToLogin}
                className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                {t.backToLogin}
          </button>
        </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] disabled:opacity-50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    {t.sendResetLink}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-2.5 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft size={16} />
                {t.backToLogin}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// RESET PASSWORD PAGE
// ============================================
function ResetPasswordPage({ token, onBackToLogin, onSuccess }) {
  const t = useTranslation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [valid, setValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const api = createApi(null)

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await api.validateResetToken(token)
        setValid(result.valid)
      } catch {
        setValid(false)
      } finally {
        setVerifying(false)
      }
    }
    verifyToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await api.resetPassword(token, password)
      if (result.message) {
        setSuccess(true)
      } else {
        setError(result.error || 'Failed to reset password')
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {verifying ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 mx-auto border-3 border-gray-200 border-t-[#1CC29F] rounded-full animate-spin mb-4" />
              <p className="text-gray-500">{t.verifyingLink}</p>
      </div>
          ) : !valid ? (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 mx-auto mb-4 bg-red-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-white" size={28} />
        </div>
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600">
                <p className="text-sm font-medium">{t.invalidResetLink}</p>
              </div>
              <button
                onClick={onBackToLogin}
                className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                {t.backToLogin}
              </button>
            </div>
          ) : success ? (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#1CC29F] rounded-xl flex items-center justify-center">
                <CheckCircle className="text-white" size={28} />
              </div>
              <div className="p-4 bg-[#E8F8F5] border border-[#D0F0E8] rounded-lg text-[#1CC29F]">
                <p className="text-sm font-medium">{t.passwordResetSuccess}</p>
              </div>
              <button
                onClick={onSuccess}
                className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <KeyRound size={18} />
                {t.signIn}
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 bg-[#1CC29F] rounded-xl flex items-center justify-center">
                  <Lock className="text-white" size={28} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.resetPassword}</h1>
                <p className="text-gray-500 text-sm">{t.resetPasswordDesc}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
        <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.newPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
        </div>
                </div>

        <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.confirmNewPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] disabled:opacity-50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound size={18} />
                      {t.resetPassword}
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// REUSABLE COMPONENTS
// ============================================
function StatCard({ title, value, icon: Icon, color = 'teal' }) {
  const colors = {
    teal: { bg: 'bg-[#E8F8F5]', text: 'text-[#1CC29F]', accent: 'bg-[#1CC29F]' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', accent: 'bg-blue-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', accent: 'bg-orange-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', accent: 'bg-red-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', accent: 'bg-purple-500' }
  }

  const c = colors[color] || colors.teal

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon size={22} className={c.text} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{value}</h3>
        </div>
      </div>
    </div>
  )
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-xl animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}

// Loan Form
function LoanForm({ loan, onSubmit, onCancel }) {
  const t = useTranslation()
  const [formData, setFormData] = useState(loan || {
    borrowerName: '',
    borrowerPhone: '',
    borrowerEmail: '',
    principalAmount: '',
    interestRate: '',
    lendDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    interestFrequency: 'MONTHLY',
    notes: '',
    status: 'ACTIVE'
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (formData.borrowerPhone && !validateIndianPhone(formData.borrowerPhone)) {
      newErrors.borrowerPhone = 'Enter valid Indian mobile'
    }
    if (formData.borrowerEmail && !validateEmail(formData.borrowerEmail)) {
      newErrors.borrowerEmail = 'Enter valid email'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({
      ...formData,
      principalAmount: parseFloat(formData.principalAmount),
      interestRate: parseFloat(formData.interestRate),
      totalInterestReceived: formData.totalInterestReceived || 0,
      totalPrincipalReceived: formData.totalPrincipalReceived || 0
    })
  }

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900 placeholder-gray-400"
  const inputErrorClass = "w-full px-4 py-3 bg-white border border-red-300 rounded-lg focus:border-red-500 transition-all text-gray-900 placeholder-gray-400"

  const statusOptions = [
    { value: 'ACTIVE', label: t.active, icon: '🟢', desc: 'Loan is ongoing' },
    { value: 'CLOSED', label: t.closed, icon: '⚪', desc: 'Fully repaid' },
    { value: 'DEFAULTED', label: t.defaulted, icon: '🔴', desc: 'Payment stopped' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.borrowerName} *</label>
          <input
            type="text"
            name="borrowerName"
            value={formData.borrowerName}
            onChange={handleChange}
            className={inputClass}
            placeholder={t.borrowerNamePlaceholder}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.phone}</label>
          <input
            type="tel"
            name="borrowerPhone"
            value={formData.borrowerPhone}
            onChange={handleChange}
            className={errors.borrowerPhone ? inputErrorClass : inputClass}
            placeholder="+91 98765 43210"
          />
          {errors.borrowerPhone && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.borrowerPhone}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.email}</label>
          <input
            type="email"
            name="borrowerEmail"
            value={formData.borrowerEmail}
            onChange={handleChange}
            className={errors.borrowerEmail ? inputErrorClass : inputClass}
            placeholder="name@example.com"
          />
          {errors.borrowerEmail && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.borrowerEmail}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.amountLent} (₹) *</label>
          <input
            type="number"
            name="principalAmount"
            value={formData.principalAmount}
            onChange={handleChange}
            className={inputClass}
            placeholder="1,00,000"
            required
            min="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.interestRate} *</label>
          <input
            type="number"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            className={inputClass}
            placeholder="12"
            required
            min="0"
            max="100"
            step="0.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.dateLent} *</label>
          <input
            type="date"
            name="lendDate"
            value={formData.lendDate}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.dueDate}</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={inputClass}
            min={formData.lendDate}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.interestFrequency} *</label>
          <select
            name="interestFrequency"
            value={formData.interestFrequency}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="DAILY">{t.daily}</option>
            <option value="WEEKLY">{t.weekly}</option>
            <option value="BIWEEKLY">{t.biweekly}</option>
            <option value="MONTHLY">{t.monthly}</option>
            <option value="QUARTERLY">{t.quarterly}</option>
            <option value="YEARLY">{t.yearly}</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.status}</label>
          <div className="grid grid-cols-3 gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: option.value }))}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  formData.status === option.value
                    ? option.value === 'ACTIVE' 
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : option.value === 'CLOSED'
                      ? 'border-gray-500 bg-gray-500/10'
                      : 'border-rose-500 bg-rose-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span className={`font-medium ${formData.status === option.value ? 'text-white' : 'text-gray-400'}`}>
                    {option.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.notes}</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={inputClass}
            placeholder={t.notesPlaceholder}
            rows={2}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
        >
          {t.cancel}
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-[#1CC29F] hover:bg-[#16A085] text-white rounded-lg font-medium transition-all"
        >
          {loan ? t.update : t.add}
        </button>
      </div>
    </form>
  )
}

// Payment Modal
function PaymentModal({ isOpen, onClose, loan, onPayment, type }) {
  const t = useTranslation()
  const [amount, setAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  
  if (!isOpen || !loan) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onPayment(loan.id, parseFloat(amount), type, paymentDate, notes)
    setAmount('')
    setNotes('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={type === 'interest' ? t.recordInterestReceived : t.recordPrincipalReceived}>
      <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-400 mb-4">
            {t.recordingPaymentFrom} <span className="text-white font-medium">{loan.borrowerName}</span>
          </p>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.amount} *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500/50 text-white"
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.paymentDate}</label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.paymentNotes}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
            rows={2}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-white/5 rounded-xl font-medium">
            {t.cancel}
          </button>
          <button type="submit" className="flex-1 px-6 py-3 bg-[#1CC29F] hover:bg-[#16A085] text-white rounded-lg font-medium">
            {t.recordReceived}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// Payment History Modal
function PaymentHistoryModal({ isOpen, onClose, payments, borrowerName, loading }) {
  const t = useTranslation()
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t.paymentHistory} - ${borrowerName}`}>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History size={48} className="mx-auto mb-4 opacity-50" />
          <p>{t.noPaymentsYet}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {payments.map((payment) => (
            <div 
              key={payment.id} 
              className={`p-4 rounded-xl border ${
                payment.paymentType === 'INTEREST' 
                  ? 'bg-amber-500/10 border-amber-500/20' 
                  : 'bg-emerald-500/10 border-emerald-500/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    payment.paymentType === 'INTEREST'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {payment.paymentType === 'INTEREST' ? t.interest : t.principal}
                  </span>
                  <p className="text-lg font-bold text-white mt-2">{formatCurrency(payment.amount)}</p>
                  {payment.notes && <p className="text-sm text-gray-400 mt-1">{payment.notes}</p>}
                </div>
                  <p className="text-sm text-gray-400">{formatDate(payment.paymentDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

// Dashboard
function Dashboard({ stats }) {
  const t = useTranslation()
  const COLORS = ['#1CC29F', '#3498DB', '#F5A623', '#E74C3C', '#9B59B6']

  const frequencyData = stats?.loansByFrequency 
    ? Object.entries(stats.loansByFrequency).map(([name, value]) => ({ name, value }))
    : []

  const topBorrowersData = stats?.topBorrowers || []

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t.totalLentOut} value={formatCurrency(stats?.totalLentOut || 0)} icon={IndianRupee} color="teal" />
        <StatCard title={t.monthlyInterestExpected} value={formatCurrency(stats?.monthlyInterestExpected || 0)} icon={TrendingUp} color="orange" />
        <StatCard title={t.activeLoans} value={stats?.activeLoans || 0} icon={CreditCard} color="blue" />
        <StatCard title={t.avgInterestRate} value={`${stats?.averageInterestRate || 0}%`} icon={Percent} color="purple" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">{t.loansByFrequency}</h3>
          {frequencyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={frequencyData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                  {frequencyData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400">{t.noDataAvailable}</div>
          )}
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            {frequencyData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">{t.topBorrowers}</h3>
          {topBorrowersData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topBorrowersData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="totalAmount" fill="#1CC29F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400">{t.noDataAvailable}</div>
          )}
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E8F8F5] rounded-lg flex items-center justify-center">
              <CheckCircle className="text-[#1CC29F]" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.interestReceived}</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats?.totalInterestReceived || 0)}</p>
          </div>
        </div>
            </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <IndianRupee className="text-blue-600" size={20} />
          </div>
            <div>
              <p className="text-sm text-gray-500">{t.principalReceived}</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats?.totalPrincipalReceived || 0)}</p>
        </div>
            </div>
          </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.fullyRepaidLoans}</p>
              <p className="text-xl font-bold text-gray-900">{stats?.closedLoans || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loans List
function LoansList({ loans, onEdit, onDelete, onPayment, api }) {
  const t = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [frequencyFilter, setFrequencyFilter] = useState('ALL')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [paymentType, setPaymentType] = useState(null)
  const [historyLoan, setHistoryLoan] = useState(null)
  const [historyPayments, setHistoryPayments] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = searchTerm === '' || 
      loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.borrowerEmail && loan.borrowerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (loan.borrowerPhone && loan.borrowerPhone.includes(searchTerm))
    const matchesStatus = statusFilter === 'ALL' || loan.status === statusFilter
    const matchesFrequency = frequencyFilter === 'ALL' || loan.interestFrequency === frequencyFilter
    return matchesSearch && matchesStatus && matchesFrequency
  })

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('ALL')
    setFrequencyFilter('ALL')
  }

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'ALL' || frequencyFilter !== 'ALL'

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Borrower Name', 'Phone', 'Email', 'Amount', 'Interest Rate', 'Frequency', 'Status', 'Lend Date', 'Due Date', 'Interest Received', 'Principal Received', 'Notes']
    const csvData = filteredLoans.map(loan => [
      loan.borrowerName,
      loan.borrowerPhone || '',
      loan.borrowerEmail || '',
      loan.principalAmount,
      `${loan.interestRate}%`,
      loan.interestFrequency,
      loan.status,
      loan.lendDate,
      loan.dueDate || '',
      loan.totalInterestReceived || 0,
      loan.totalPrincipalReceived || 0,
      loan.notes || ''
    ])
    
    const csvContent = [headers, ...csvData].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `lendtracker-loans-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Export to PDF (using print dialog)
  const exportToPDF = () => {
    const totalLent = filteredLoans.reduce((sum, l) => sum + (l.principalAmount || 0), 0)
    const totalInterestReceived = filteredLoans.reduce((sum, l) => sum + (l.totalInterestReceived || 0), 0)
    const totalPrincipalReceived = filteredLoans.reduce((sum, l) => sum + (l.totalPrincipalReceived || 0), 0)
    const activeCount = filteredLoans.filter(l => l.status === 'ACTIVE').length
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>LendTracker - ${t.loanReport}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; background: #fff; color: #333; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #10b981; }
          .header h1 { color: #10b981; font-size: 28px; margin-bottom: 5px; }
          .header p { color: #666; font-size: 14px; }
          .summary { display: flex; justify-content: space-around; margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; }
          .summary-item { text-align: center; }
          .summary-item .label { font-size: 12px; color: #666; margin-bottom: 5px; }
          .summary-item .value { font-size: 20px; font-weight: bold; color: #10b981; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #10b981; color: white; padding: 12px 8px; text-align: left; font-size: 12px; }
          td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
          tr:nth-child(even) { background: #f8fafc; }
          .status { padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; }
          .active { background: #d1fae5; color: #059669; }
          .closed { background: #e5e7eb; color: #6b7280; }
          .defaulted { background: #fee2e2; color: #dc2626; }
          .amount { font-weight: 600; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🪙 LendTracker</h1>
          <p>${t.loanReport} - ${t.generatedOn} ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <div class="label">${t.totalLentOut}</div>
            <div class="value">${formatCurrency(totalLent)}</div>
          </div>
          <div class="summary-item">
            <div class="label">${t.activeLoans}</div>
            <div class="value">${activeCount}</div>
          </div>
          <div class="summary-item">
            <div class="label">${t.interestReceived}</div>
            <div class="value">${formatCurrency(totalInterestReceived)}</div>
          </div>
          <div class="summary-item">
            <div class="label">${t.principalReceived}</div>
            <div class="value">${formatCurrency(totalPrincipalReceived)}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>${t.borrowerName}</th>
              <th>${t.phone}</th>
              <th>${t.amountLent}</th>
              <th>${t.interestRate}</th>
              <th>${t.interestFrequency}</th>
              <th>${t.status}</th>
              <th>${t.dateLent}</th>
              <th>${t.interestReceived}</th>
            </tr>
          </thead>
          <tbody>
            ${filteredLoans.map(loan => `
              <tr>
                <td><strong>${loan.borrowerName}</strong></td>
                <td>${loan.borrowerPhone || '-'}</td>
                <td class="amount">${formatCurrency(loan.principalAmount)}</td>
                <td>${loan.interestRate}%</td>
                <td>${loan.interestFrequency}</td>
                <td><span class="status ${loan.status.toLowerCase()}">${loan.status}</span></td>
                <td>${formatDate(loan.lendDate)}</td>
                <td class="amount">${formatCurrency(loan.totalInterestReceived || 0)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          LendTracker - Smart Loan Management | ${filteredLoans.length} loans exported
        </div>
      </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 250)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-[#E8F8F5] text-[#1CC29F]'
      case 'CLOSED': return 'bg-gray-100 text-gray-600'
      case 'DEFAULTED': return 'bg-red-50 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getFrequencyLabel = (freq) => {
    const labels = { DAILY: t.daily, WEEKLY: t.weekly, BIWEEKLY: t.biweekly, MONTHLY: t.monthly, QUARTERLY: t.quarterly, YEARLY: t.yearly }
    return labels[freq] || freq
  }

  const handleViewHistory = async (loan) => {
    setHistoryLoan(loan)
    setHistoryLoading(true)
    try {
      const payments = await api.getPaymentHistory(loan.id)
      setHistoryPayments(payments)
    } catch (err) {
      console.error('Failed to fetch history:', err)
      setHistoryPayments([])
    } finally {
      setHistoryLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#1CC29F] transition-all text-sm"
          />
        </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-pointer focus:border-[#1CC29F] text-sm"
          >
            <option value="ALL">{t.allStatus}</option>
            <option value="ACTIVE">{t.active}</option>
            <option value="CLOSED">{t.closed}</option>
            <option value="DEFAULTED">{t.defaulted}</option>
          </select>
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-pointer focus:border-[#1CC29F] text-sm"
          >
            <option value="ALL">{t.interestFrequency}</option>
            <option value="DAILY">{t.daily}</option>
            <option value="WEEKLY">{t.weekly}</option>
            <option value="BIWEEKLY">{t.biweekly}</option>
            <option value="MONTHLY">{t.monthly}</option>
            <option value="QUARTERLY">{t.quarterly}</option>
            <option value="YEARLY">{t.yearly}</option>
          </select>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {/* Results count and Export buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">
              {filteredLoans.length === loans.length 
                ? `${loans.length} ${loans.length === 1 ? 'loan' : 'loans'}`
                : `${filteredLoans.length} of ${loans.length} loans`
              }
            </span>
            {hasActiveFilters && (
              <span className="text-[#1CC29F] text-xs px-2 py-0.5 bg-[#E8F8F5] rounded-full font-medium">
                Filtered
              </span>
            )}
          </div>
          
          {filteredLoans.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
                title={t.exportCSV}
              >
                <FileSpreadsheet size={15} />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F8F5] hover:bg-[#D0F0E8] text-[#1CC29F] rounded-lg text-sm font-medium transition-all"
                title={t.exportPDF}
              >
                <FileText size={15} />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredLoans.map((loan, index) => (
          <div key={loan.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F8F5] flex items-center justify-center text-[#1CC29F] font-semibold text-sm">
                  {loan.borrowerName.charAt(0).toUpperCase()}
                </div>
              <div>
                  <h3 className="font-semibold text-gray-900">{loan.borrowerName}</h3>
                <p className="text-sm text-gray-500">{loan.borrowerPhone || loan.borrowerEmail || t.noContactInfo}</p>
              </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                {loan.status === 'ACTIVE' ? t.active : loan.status === 'CLOSED' ? t.closed : t.defaulted}
              </span>
            </div>

            {/* Amount and Rate */}
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(loan.principalAmount)}</span>
                <span className="text-sm text-gray-500 ml-2">@ {loan.interestRate}%</span>
              </div>
              <span className="text-sm text-[#1CC29F] font-medium">{getFrequencyLabel(loan.interestFrequency)}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{t.principalReceivedBack}</span>
                <span className="text-gray-700 font-medium">{formatCurrency(loan.totalPrincipalReceived || 0)} / {formatCurrency(loan.principalAmount)}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1CC29F] rounded-full transition-all" style={{ width: `${Math.min(((loan.totalPrincipalReceived || 0) / loan.principalAmount) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
              <span>{t.interestReceived}: <span className="text-[#1CC29F] font-medium">{formatCurrency(loan.totalInterestReceived || 0)}</span></span>
              <span>{t.dateLent}: {formatDate(loan.lendDate)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {loan.status === 'ACTIVE' && (
                <>
                  <button onClick={() => { setSelectedLoan(loan); setPaymentType('interest') }} className="flex-1 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-sm font-medium transition-all">
                    + {t.interest}
                  </button>
                  <button onClick={() => { setSelectedLoan(loan); setPaymentType('principal') }} className="flex-1 px-3 py-2 bg-[#E8F8F5] hover:bg-[#D0F0E8] text-[#1CC29F] rounded-lg text-sm font-medium transition-all">
                    + {t.principal}
                  </button>
                </>
              )}
              <button onClick={() => handleViewHistory(loan)} className="p-2 hover:bg-gray-100 rounded-lg transition-all" title={t.viewHistory}>
                <History size={18} className="text-gray-400" />
              </button>
              <button onClick={() => onEdit(loan)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <Edit2 size={18} className="text-gray-400" />
              </button>
              <button onClick={() => onDelete(loan.id)} className="p-2 hover:bg-red-50 rounded-lg transition-all">
                <Trash2 size={18} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLoans.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <CreditCard className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">{t.noLoansFound}</p>
        </div>
      )}

      <PaymentModal isOpen={!!selectedLoan && !!paymentType} onClose={() => { setSelectedLoan(null); setPaymentType(null) }} loan={selectedLoan} type={paymentType} onPayment={onPayment} />
      <PaymentHistoryModal isOpen={!!historyLoan} onClose={() => setHistoryLoan(null)} payments={historyPayments} borrowerName={historyLoan?.borrowerName || ''} loading={historyLoading} />
    </div>
  )
}

// Interest Calculator
function InterestCalculatorPage({ api }) {
  const t = useTranslation()
  const [formData, setFormData] = useState({ principal: '', interestRate: '', frequency: 'MONTHLY', durationMonths: '12' })
  const [calculation, setCalculation] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    if (!formData.principal || !formData.interestRate) return
    setLoading(true)
    try {
      const days = parseInt(formData.durationMonths) * 30
      const result = await api.calculateInterest(parseFloat(formData.principal), parseFloat(formData.interestRate), formData.frequency, days)
      setCalculation(result)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500"

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl">
            <Calculator size={28} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t.interestCalculator}</h2>
            <p className="text-gray-400 text-sm">{t.enterDetails}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.principal} *</label>
            <input type="number" value={formData.principal} onChange={(e) => setFormData(prev => ({ ...prev, principal: e.target.value }))} className={inputClass} placeholder="100000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.interestRate} *</label>
            <input type="number" value={formData.interestRate} onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))} className={inputClass} placeholder="12" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.interestFrequency}</label>
            <select value={formData.frequency} onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))} className={inputClass}>
              <option value="DAILY">{t.daily}</option>
              <option value="WEEKLY">{t.weekly}</option>
              <option value="BIWEEKLY">{t.biweekly}</option>
              <option value="MONTHLY">{t.monthly}</option>
              <option value="QUARTERLY">{t.quarterly}</option>
              <option value="YEARLY">{t.yearly}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">{t.duration}</label>
            <input type="number" value={formData.durationMonths} onChange={(e) => setFormData(prev => ({ ...prev, durationMonths: e.target.value }))} className={inputClass} placeholder="12" />
          </div>
        </div>

        <button onClick={handleCalculate} disabled={loading || !formData.principal || !formData.interestRate} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 rounded-xl font-medium flex items-center justify-center gap-2">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Calculator size={20} />{t.calculateInterest}</>}
        </button>

        {calculation && (
          <div className="mt-8 p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl animate-fade-in-up">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-400" />
              {t.calculationResults}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">{t.perPayment}</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(calculation.perPaymentInterest)}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">{t.monthlyInterest}</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(calculation.monthlyInterest)}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">{t.yearlyInterest}</p>
                <p className="text-2xl font-bold text-amber-400">{formatCurrency(calculation.yearlyInterest)}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">{t.totalInterest}</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(calculation.totalInterest)}</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-emerald-500/20 rounded-xl">
              <p className="text-sm text-gray-300 mb-1">{t.totalReturn}</p>
              <p className="text-3xl font-bold text-emerald-400">{formatCurrency(calculation.totalAmount)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Payment History Page
function PaymentHistoryPage({ api }) {
  const t = useTranslation()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAllPaymentHistory().then(setPayments).catch(() => setPayments([])).finally(() => setLoading(false))
  }, [api])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-xl">
          <History size={28} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{t.allPayments}</h2>
          <p className="text-gray-400 text-sm">{t.recentPayments}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <History size={64} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500 text-lg">{t.noPaymentsYet}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div key={payment.id} className={`glass rounded-xl p-5 animate-fade-in-up border-l-4 ${payment.paymentType === 'INTEREST' ? 'border-l-amber-500' : 'border-l-emerald-500'}`} style={{ animationDelay: `${index * 30}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${payment.paymentType === 'INTEREST' ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
                    {payment.paymentType === 'INTEREST' ? <Percent size={20} className="text-amber-400" /> : <IndianRupee size={20} className="text-emerald-400" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{payment.borrowerName}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${payment.paymentType === 'INTEREST' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {payment.paymentType === 'INTEREST' ? t.interest : t.principal}
                      </span>
                      {payment.notes && <span>• {payment.notes}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{formatCurrency(payment.amount)}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                    <CalendarDays size={14} />
                    {formatDate(payment.paymentDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Default avatar - a simple user silhouette in SVG data URI
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%231CC29F'/%3E%3Ccircle cx='50' cy='35' r='18' fill='white'/%3E%3Cellipse cx='50' cy='75' rx='28' ry='20' fill='white'/%3E%3C/svg%3E"

// Profile Settings Page
function ProfileSettingsPage({ api }) {
  const t = useTranslation()
  const { user, updateUser, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  
  // Profile form
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const fileInputRef = React.useRef(null)

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 500000) { // 500KB limit
        setProfileMessage('Image too large. Please use an image under 500KB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setProfilePhoto('')
  }
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  
  // App settings
  const [defaultRate, setDefaultRate] = useState(localStorage.getItem('lendtracker_default_rate') || '12')
  const [defaultFreq, setDefaultFreq] = useState(localStorage.getItem('lendtracker_default_freq') || 'MONTHLY')
  const [settingsMessage, setSettingsMessage] = useState('')

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMessage('')
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lendtracker_token')}`
        },
        body: JSON.stringify({ name, phone, profilePhoto })
      })
      const data = await res.json()
      
      if (res.ok) {
        updateUser({ name: data.name, phone: data.phone, profilePhoto })
        setProfileMessage(t.profileUpdated)
      } else {
        setProfileMessage(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setProfileMessage('Error updating profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters')
      return
    }
    
    setPasswordLoading(true)
    setPasswordMessage('')
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lendtracker_token')}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      const data = await res.json()
      
      if (res.ok) {
        setPasswordMessage(t.passwordChanged)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMessage(data.error || 'Failed to change password')
      }
    } catch (err) {
      setPasswordMessage('Error changing password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleSaveSettings = () => {
    localStorage.setItem('lendtracker_default_rate', defaultRate)
    localStorage.setItem('lendtracker_default_freq', defaultFreq)
    setSettingsMessage('Settings saved!')
    setTimeout(() => setSettingsMessage(''), 3000)
  }

  const handleExportData = async () => {
    try {
      const loans = await api.getLoans()
      const payments = await api.getAllPaymentHistory()
      const data = {
        exportDate: new Date().toISOString(),
        user: { name: user?.name, email: user?.email },
        loans,
        payments
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lendtracker-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] transition-all text-gray-900"

  // Email verification state
  const [emailVerified, setEmailVerified] = useState(user?.emailVerified || false)
  const [verificationOtp, setVerificationOtp] = useState(['', '', '', '', '', ''])
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpMessage, setOtpMessage] = useState('')
  const otpRefs = Array(6).fill(0).map(() => React.createRef())

  const handleSendOtp = async () => {
    setOtpLoading(true)
    setOtpMessage('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/send-verification-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lendtracker_token')}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        setShowOtpInput(true)
        setOtpMessage(t.otpSent || 'OTP sent to your email!')
      } else {
        setOtpMessage(data.message || 'Failed to send OTP')
      }
    } catch (err) {
      setOtpMessage('Error sending OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    const otp = verificationOtp.join('')
    if (otp.length !== 6) {
      setOtpMessage('Please enter 6-digit OTP')
      return
    }
    setOtpLoading(true)
    setOtpMessage('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, otp })
      })
      const data = await res.json()
      if (data.token) {
        setEmailVerified(true)
        setShowOtpInput(false)
        setOtpMessage(t.emailVerified || 'Email verified successfully!')
        updateUser({ emailVerified: true })
      } else {
        setOtpMessage(data.message || 'Invalid OTP')
      }
    } catch (err) {
      setOtpMessage('Error verifying OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...verificationOtp]
    newOtp[index] = value
    setVerificationOtp(newOtp)
    if (value && index < 5) otpRefs[index + 1].current?.focus()
  }

  const sections = [
    { id: 'profile', label: t.profile, icon: User },
    { id: 'email', label: t.verifyEmail || 'Verify Email', icon: Mail },
    { id: 'password', label: t.changePassword, icon: Lock },
    { id: 'app', label: t.appSettings, icon: Settings },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
          <Settings size={24} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t.settings}</h2>
          <p className="text-gray-500 text-sm">{t.profileSettings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                  activeSection === id
                    ? 'bg-[#E8F8F5] text-[#1CC29F]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
          
          {/* User Info Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mt-4">
            <div className="flex items-center gap-3">
              <img 
                src={profilePhoto || user?.profilePhoto || DEFAULT_AVATAR} 
                alt={user?.name}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <User size={18} className="text-[#1CC29F]" />
                {t.updateProfile}
              </h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Profile Photo */}
                <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="relative">
                    <img 
                      src={profilePhoto || user?.profilePhoto || DEFAULT_AVATAR} 
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[#1CC29F] rounded-full flex items-center justify-center text-white hover:bg-[#16A085] transition-colors shadow-lg"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-[#1CC29F] hover:text-[#16A085] font-medium"
                    >
                      {t.changePhoto || 'Change Photo'}
                    </button>
                    {(profilePhoto || user?.profilePhoto) && (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="text-sm text-red-500 hover:text-red-600 font-medium"
                        >
                          {t.removePhoto || 'Remove'}
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">Max 500KB, JPG/PNG</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.name}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${inputClass} pl-11`}
                      placeholder="Your name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={user?.email || ''}
                      className={`${inputClass} pl-11 opacity-50 cursor-not-allowed bg-gray-100`}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.phone}</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`${inputClass} pl-11`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {profileMessage && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                    profileMessage.includes('success') || profileMessage === t.profileUpdated
                      ? 'bg-[#E8F8F5] border border-[#D0F0E8] text-[#1CC29F]'
                      : 'bg-red-50 border border-red-100 text-red-600'
                  }`}>
                    {profileMessage.includes('success') || profileMessage === t.profileUpdated
                      ? <CheckCircle size={16} />
                      : <AlertCircle size={16} />
                    }
                    {profileMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {profileLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      {t.save}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Email Verification Section */}
          {activeSection === 'email' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Mail size={18} className="text-blue-500" />
                {t.verifyEmail || 'Verify Email'}
              </h3>
              
              {emailVerified ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg">
                  <CheckCircle className="text-green-500" size={24} />
                  <div>
                    <p className="font-medium text-green-700">{t.emailVerified || 'Email Verified'}</p>
                    <p className="text-sm text-green-600">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <AlertCircle className="text-amber-500" size={24} />
                    <div>
                      <p className="font-medium text-amber-700">{t.emailNotVerified || 'Email Not Verified'}</p>
                      <p className="text-sm text-amber-600">{user?.email}</p>
                    </div>
                  </div>

                  {!showOtpInput ? (
                    <button
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="w-full py-3 bg-[#1CC29F] hover:bg-[#16A085] disabled:opacity-50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      {otpLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={18} />
                          {t.sendOtp || 'Send Verification OTP'}
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 text-center">{t.enterOtp || 'Enter the 6-digit OTP sent to your email'}</p>
                      <div className="flex justify-center gap-2">
                        {verificationOtp.map((digit, index) => (
                          <input
                            key={index}
                            ref={otpRefs[index]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                            className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-lg focus:border-[#1CC29F] focus:ring-2 focus:ring-[#1CC29F]/20 transition-all text-gray-900"
                          />
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setShowOtpInput(false); setVerificationOtp(['', '', '', '', '', '']); setOtpMessage('') }}
                          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                        >
                          {t.cancel || 'Cancel'}
                        </button>
                        <button
                          onClick={handleVerifyOtp}
                          disabled={otpLoading || verificationOtp.join('').length !== 6}
                          className="flex-1 py-3 bg-[#1CC29F] hover:bg-[#16A085] disabled:opacity-50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          {otpLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <CheckCircle size={18} />
                              {t.verify || 'Verify'}
                            </>
                          )}
                        </button>
                      </div>
                      <button
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="w-full text-sm text-[#1CC29F] hover:text-[#16A085] font-medium"
                      >
                        {t.resendOtp || 'Resend OTP'}
                      </button>
                    </div>
                  )}

                  {otpMessage && (
                    <div className={`p-3 rounded-lg text-sm ${otpMessage.includes('success') || otpMessage.includes('sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {otpMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Password Section */}
          {activeSection === 'password' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Lock size={18} className="text-orange-500" />
                {t.changePassword}
              </h3>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.currentPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`${inputClass} pl-11 pr-11`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.newPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`${inputClass} pl-11`}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.confirmNewPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${inputClass} pl-11`}
                      required
                    />
                  </div>
                </div>

                {passwordMessage && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                    passwordMessage.includes('success') || passwordMessage === t.passwordChanged
                      ? 'bg-[#E8F8F5] border border-[#D0F0E8] text-[#1CC29F]'
                      : 'bg-red-50 border border-red-100 text-red-600'
                  }`}>
                    {passwordMessage.includes('success') || passwordMessage === t.passwordChanged
                      ? <CheckCircle size={16} />
                      : <AlertCircle size={16} />
                    }
                    {passwordMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      {t.changePassword}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* App Settings Section */}
          {activeSection === 'app' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <Palette size={18} className="text-blue-600" />
                  {t.appSettings}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.defaultInterestRate} (%)</label>
                    <input
                      type="number"
                      value={defaultRate}
                      onChange={(e) => setDefaultRate(e.target.value)}
                      className={inputClass}
                      min="0"
                      max="100"
                      step="0.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.defaultFrequency}</label>
                    <select
                      value={defaultFreq}
                      onChange={(e) => setDefaultFreq(e.target.value)}
                      className={inputClass}
                    >
                      <option value="DAILY">{t.daily}</option>
                      <option value="WEEKLY">{t.weekly}</option>
                      <option value="BIWEEKLY">{t.biweekly}</option>
                      <option value="MONTHLY">{t.monthly}</option>
                      <option value="QUARTERLY">{t.quarterly}</option>
                      <option value="YEARLY">{t.yearly}</option>
                    </select>
                  </div>

                  {settingsMessage && (
                    <div className="p-3 bg-[#E8F8F5] border border-[#D0F0E8] rounded-lg text-[#1CC29F] text-sm flex items-center gap-2">
                      <CheckCircle size={16} />
                      {settingsMessage}
                    </div>
                  )}

                  <button
                    onClick={handleSaveSettings}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {t.save}
                  </button>
                </div>
              </div>

              {/* Export Data */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Download size={18} className="text-purple-600" />
                  {t.exportData}
                </h3>
                <p className="text-gray-500 text-sm mb-4">Export all your loans and payment history as a JSON file.</p>
                <button
                  onClick={handleExportData}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  {t.exportData}
                </button>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-xl border border-red-200 p-6">
                <h3 className="text-base font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <AlertCircle size={18} />
                  {t.dangerZone}
                </h3>
                <p className="text-gray-500 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button
                  onClick={logout}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  {t.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// ADMIN DASHBOARD
// ============================================
function AdminDashboard({ api }) {
  const t = useTranslation()
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, usersData, activityData] = await Promise.all([
        api.adminGetStats(),
        api.adminGetUsers(),
        api.adminGetActivity(20)
      ])
      setStats(statsData)
      setUsers(usersData)
      setActivity(activityData)
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
      setError('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (userId) => {
    if (!confirm('Are you sure you want to change this user\'s status?')) return
    try {
      await api.adminToggleUserStatus(userId)
      fetchAdminData()
    } catch (err) {
      console.error('Failed to toggle status:', err)
    }
  }

  const handleMakeAdmin = async (userId) => {
    if (!confirm('Are you sure you want to make this user an admin?')) return
    try {
      await api.adminMakeAdmin(userId)
      fetchAdminData()
    } catch (err) {
      console.error('Failed to make admin:', err)
    }
  }

  const handleRemoveAdmin = async (userId) => {
    if (!confirm('Are you sure you want to remove admin privileges?')) return
    try {
      await api.adminRemoveAdmin(userId)
      fetchAdminData()
    } catch (err) {
      console.error('Failed to remove admin:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#1CC29F] rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <ShieldCheck size={24} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Admin Console</h2>
          <p className="text-gray-500 text-sm">System management and analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                  activeSection === id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-5">
          {/* Overview Section */}
          {activeSection === 'overview' && stats && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                      <p className="text-xs text-gray-500">Total Users</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <UserCheck size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                      <p className="text-xs text-gray-500">Active Users</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E8F8F5] rounded-lg flex items-center justify-center">
                      <CreditCard size={20} className="text-[#1CC29F]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalLoans}</p>
                      <p className="text-xs text-gray-500">Total Loans</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Crown size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
                      <p className="text-xs text-gray-500">Admins</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Stats */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Financial Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Total Lent Out</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalLentOut || 0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Total Interest Received</p>
                    <p className="text-2xl font-bold text-[#1CC29F]">{formatCurrency(stats.totalInterestReceived || 0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Avg Interest Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageInterestRate || 0}%</p>
                  </div>
                </div>
              </div>

              {/* User Growth */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">New Users</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{stats.newUsersToday || 0}</p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{stats.newUsersThisWeek || 0}</p>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">{stats.newUsersThisMonth || 0}</p>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                </div>
              </div>

              {/* Loan Status Breakdown */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Loan Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#E8F8F5] rounded-lg">
                    <CheckCircle size={24} className="text-[#1CC29F]" />
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.activeLoans || 0}</p>
                      <p className="text-xs text-gray-600">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                    <Clock size={24} className="text-gray-600" />
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.closedLoans || 0}</p>
                      <p className="text-xs text-gray-600">Closed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle size={24} className="text-red-600" />
                    <div>
                      <p className="text-xl font-bold text-gray-900">{stats.defaultedLoans || 0}</p>
                      <p className="text-xs text-gray-600">Defaulted</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">All Users ({users.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loans</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Lent</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm ${u.role === 'ADMIN' ? 'bg-purple-500' : 'bg-[#1CC29F]'}`}>
                              {u.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.role === 'ADMIN' && <Crown size={12} />}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{u.loanCount || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(u.totalLent || 0)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {u.id !== user.id && (
                              <>
                                <button
                                  onClick={() => handleToggleStatus(u.id)}
                                  className={`p-1.5 rounded-lg text-xs ${u.active ? 'hover:bg-red-50 text-gray-500 hover:text-red-600' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'}`}
                                  title={u.active ? 'Deactivate' : 'Activate'}
                                >
                                  {u.active ? <UserX size={16} /> : <UserCheck size={16} />}
                                </button>
                                {u.role === 'USER' ? (
                                  <button
                                    onClick={() => handleMakeAdmin(u.id)}
                                    className="p-1.5 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-purple-600"
                                    title="Make Admin"
                                  >
                                    <Crown size={16} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleRemoveAdmin(u.id)}
                                    className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50"
                                    title="Remove Admin"
                                  >
                                    <Shield size={16} />
                                  </button>
                                )}
                              </>
                            )}
                            {u.id === user.id && (
                              <span className="text-xs text-gray-400 italic">You</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Section */}
          {activeSection === 'activity' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activity.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.type === 'USER_REGISTERED' ? 'bg-blue-100' : 'bg-[#E8F8F5]'
                    }`}>
                      {item.type === 'USER_REGISTERED' ? (
                        <User size={18} className="text-blue-600" />
                      ) : (
                        <CreditCard size={18} className="text-[#1CC29F]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.message}</p>
                      <p className="text-xs text-gray-500">
                        {item.type === 'USER_REGISTERED' ? item.email : `by ${item.user}`}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}
                    </div>
                  </div>
                ))}
                {activity.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No recent activity</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN DASHBOARD APP
// ============================================
function DashboardApp() {
  const { user, token, logout } = useAuth()
  const [loans, setLoans] = useState([])
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLoan, setEditingLoan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [language, setLanguage] = useState(localStorage.getItem(LANGUAGE_KEY) || 'en')

  const t = translations[language]
  const api = createApi(token)

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language)
  }, [language])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [loansData, dashboardData] = await Promise.all([api.getLoans(), api.getDashboard()])
      setLoans(loansData)
      setStats(dashboardData)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError(t.somethingWentWrong)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleCreateLoan = async (loanData) => {
    try {
      await api.createLoan(loanData)
      fetchData()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to create loan:', err)
    }
  }

  const handleUpdateLoan = async (loanData) => {
    try {
      await api.updateLoan(editingLoan.id, loanData)
      fetchData()
      setEditingLoan(null)
    } catch (err) {
      console.error('Failed to update loan:', err)
    }
  }

  const handleDeleteLoan = async (id) => {
    if (confirm(t.confirmDelete)) {
      try {
        await api.deleteLoan(id)
        fetchData()
      } catch (err) {
        console.error('Failed to delete loan:', err)
      }
    }
  }

  const handlePayment = async (id, amount, type, paymentDate, notes) => {
    try {
      if (type === 'interest') {
        await api.receiveInterest(id, amount, paymentDate, notes)
      } else {
        await api.receivePrincipal(id, amount, paymentDate, notes)
      }
      fetchData()
    } catch (err) {
      console.error('Failed to record payment:', err)
    }
  }

  const handleEdit = (loan) => {
    setEditingLoan({
      ...loan,
      lendDate: loan.lendDate?.split('T')[0] || '',
      dueDate: loan.dueDate?.split('T')[0] || ''
    })
  }

  const goToDashboard = () => setActiveTab('dashboard')

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-gray-50">
        {/* Clean Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <button onClick={goToDashboard} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 bg-[#1CC29F] rounded-lg flex items-center justify-center">
                  <IndianRupee className="text-white" size={20} />
        </div>
                <span className="text-xl font-bold text-gray-900">{t.appName}</span>
              </button>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {[
                  { key: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
                  { key: 'loans', icon: List, label: t.loans },
                  { key: 'calculator', icon: Calculator, label: t.calculator },
                  { key: 'history', icon: History, label: t.history },
                  ...(user?.role === 'ADMIN' ? [{ key: 'admin', icon: ShieldCheck, label: 'Admin' }] : [])
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key} 
                    onClick={() => setActiveTab(key)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === key 
                        ? key === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-[#E8F8F5] text-[#1CC29F]' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
                
              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Language Dropdown */}
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-8 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 focus:outline-none focus:border-[#1CC29F]"
                  >
                    <option value="en">🇺🇸 English</option>
                    <option value="te">🇮🇳 తెలుగు</option>
                    <option value="hi">🇮🇳 हिंदी</option>
                  </select>
                  <Globe size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`p-2 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-[#E8F8F5] text-[#1CC29F]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={() => setIsModalOpen(true)} 
                  className="flex items-center gap-2 px-4 py-2 bg-[#1CC29F] hover:bg-[#16A085] text-white rounded-lg text-sm font-medium transition-all"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">{t.addLoan}</span>
                </button>
                <button
                  onClick={logout} 
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all"
                  title={t.logout}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-100 px-4 py-2 flex gap-1 overflow-x-auto">
            {[
              { key: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
              { key: 'loans', icon: List, label: t.loans },
              { key: 'calculator', icon: Calculator, label: t.calculator },
              { key: 'history', icon: History, label: t.history },
              ...(user?.role === 'ADMIN' ? [{ key: 'admin', icon: ShieldCheck, label: 'Admin' }] : [])
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key} 
                onClick={() => setActiveTab(key)} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === key 
                    ? key === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-[#E8F8F5] text-[#1CC29F]' 
                    : 'text-gray-600'
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-3 border-gray-200 border-t-[#1CC29F] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">{error}</p>
              <button onClick={fetchData} className="px-5 py-2 bg-[#1CC29F] hover:bg-[#16A085] text-white rounded-lg text-sm font-medium">
                {t.retry}
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard stats={stats} />}
              {activeTab === 'loans' && <LoansList loans={loans} onEdit={handleEdit} onDelete={handleDeleteLoan} onPayment={handlePayment} api={api} />}
              {activeTab === 'admin' && user?.role === 'ADMIN' && <AdminDashboard api={api} />}
              {activeTab === 'calculator' && <InterestCalculatorPage api={api} />}
              {activeTab === 'history' && <PaymentHistoryPage api={api} />}
              {activeTab === 'settings' && <ProfileSettingsPage api={api} />}
            </>
          )}
        </main>

        <Modal isOpen={isModalOpen || !!editingLoan} onClose={() => { setIsModalOpen(false); setEditingLoan(null) }} title={editingLoan ? t.editLoan : t.addNewLoan}>
          <LoanForm loan={editingLoan} onSubmit={editingLoan ? handleUpdateLoan : handleCreateLoan} onCancel={() => { setIsModalOpen(false); setEditingLoan(null) }} />
        </Modal>
      </div>
    </LanguageContext.Provider>
  )
}

// ============================================
// MAIN APP WITH ROUTING
// ============================================
export default function App() {
  const [page, setPage] = useState('home')
  const [resetToken, setResetToken] = useState(null)
  const [language, setLanguage] = useState(localStorage.getItem(LANGUAGE_KEY) || 'en')

  // Check for reset-password token in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const path = window.location.pathname
    
    if (path === '/reset-password' && token) {
      setResetToken(token)
      setPage('reset-password')
    }
  }, [])

  return (
    <AuthProvider>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <ConnectionStatus />
        <AppContent page={page} setPage={setPage} resetToken={resetToken} setResetToken={setResetToken} />
      </LanguageContext.Provider>
    </AuthProvider>
  )
}

function AppContent({ page, setPage, resetToken, setResetToken }) {
  const { isAuthenticated, loading } = useAuth()

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-[#1CC29F] rounded-full animate-spin" />
      </div>
    )
  }

  // Handle reset password page (even when authenticated, allow access)
  if (page === 'reset-password' && resetToken) {
    return (
      <ResetPasswordPage 
        token={resetToken} 
        onBackToLogin={() => {
          setResetToken(null)
          setPage('login')
          window.history.pushState({}, '', '/')
        }}
        onSuccess={() => {
          setResetToken(null)
          setPage('login')
          window.history.pushState({}, '', '/')
        }}
      />
    )
  }

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <DashboardApp />
  }

  // Otherwise show public pages
  switch (page) {
    case 'login':
      return (
        <LoginPage 
          onSwitchToRegister={() => setPage('register')} 
          onLoginSuccess={() => setPage('dashboard')}
          onForgotPassword={() => setPage('forgot-password')}
        />
      )
    case 'register':
      return (
        <RegisterPage 
          onSwitchToLogin={() => setPage('login')} 
          onRegisterSuccess={() => setPage('dashboard')}
        />
      )
    case 'forgot-password':
      return <ForgotPasswordPage onBackToLogin={() => setPage('login')} />
    default:
      return <HomePage onGetStarted={() => setPage('login')} />
  }
}
