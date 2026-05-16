import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          home: "Home",
          report_issue: "Report Issue",
          my_reports: "My Reports",
          leaderboard: "Leaderboard",
          submit: "Submit",
          cancel: "Cancel",
          status: "Status",
          assigned: "Assigned",
          pending: "Pending",
          done: "Done",
          logout: "Logout",
          upload_image: "Upload Image",
          upload_video: "Upload Video",
          record_audio: "Record Audio",
          speak_description: "Speak Description",
          ai_verified: "AI Verified",
          bid_submitted: "Bid Submitted",
          place_bid: "Place Bid",
          accept_bid: "Accept Bid",
          reject_bid: "Reject Bid",
          severity_low: "Low",
          severity_medium: "Medium",
          severity_high: "High",
          duplicate_detected: "Duplicate Detected",
          specializations: "Specializations",
          add_custom_tag: "Add Tag",
          login: "Login",
          register: "Register"
        }
      },
      kn: {
        translation: {
          home: "ಮನೆ",
          report_issue: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
          my_reports: "ನನ್ನ ವರದಿಗಳು",
          leaderboard: "ಶ್ರೇಯಾಂಕ ಪಟ್ಟಿ",
          submit: "ಸಲ್ಲಿಸಿ",
          cancel: "ರದ್ದುಮಾಡಿ",
          status: "ಸ್ಥಿತಿ",
          assigned: "ನಿಯೋಜಿಸಲಾಗಿದೆ",
          pending: "ಬಾಕಿ ಇದೆ",
          done: "ಪೂರ್ಣಗೊಂಡಿದೆ",
          logout: "ನಿರ್ಗಮನ",
          upload_image: "ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
          upload_video: "ವೀಡಿಯೊ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
          record_audio: "ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಮಾಡಿ",
          speak_description: "ವಿವರಣೆಯನ್ನು ಮಾತನಾಡಿ",
          ai_verified: "AI ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ",
          bid_submitted: "ಬಿಡ್ ಸಲ್ಲಿಸಲಾಗಿದೆ",
          place_bid: "ಬಿಡ್ ಮಾಡಿ",
          accept_bid: "ಬಿಡ್ ಸ್ವೀಕರಿಸಿ",
          reject_bid: "ಬಿಡ್ ತಿರಸ್ಕರಿಸಿ",
          severity_low: "ಕಡಿಮೆ",
          severity_medium: "ಮಧ್ಯಮ",
          severity_high: "ಹೆಚ್ಚು",
          duplicate_detected: "ನಕಲಿ ಪತ್ತೆಯಾಗಿದೆ",
          specializations: "ವಿಶೇಷತೆಗಳು",
          add_custom_tag: "ಟ್ಯಾಗ್ ಸೇರಿಸಿ",
          login: "ಲಾಗಿನ್",
          register: "ನೋಂದಣಿ"
        }
      },
      hi: {
        translation: {
          home: "होम",
          report_issue: "समस्या की रिपोर्ट करें",
          my_reports: "मेरी रिपोर्ट",
          leaderboard: "लीडरबोर्ड",
          submit: "जमा करें",
          cancel: "रद्द करें",
          status: "स्थिति",
          assigned: "सॉपा गया",
          pending: "लंबित",
          done: "हो गया",
          logout: "लॉगआउट",
          upload_image: "छवि अपलोड करें",
          upload_video: "वीडियो अपलोड करें",
          record_audio: "ऑडियो रिकॉर्ड करें",
          speak_description: "विवरण बोलें",
          ai_verified: "AI सत्यापित",
          bid_submitted: "बोली जमा की गई",
          place_bid: "बोली लगाएं",
          accept_bid: "बोली स्वीकार करें",
          reject_bid: "बोली अस्वीकार करें",
          severity_low: "कम",
          severity_medium: "मध्यम",
          severity_high: "उच्च",
          duplicate_detected: "डुप्लिकेट मिला",
          specializations: "विशेषज्ञता",
          add_custom_tag: "टैग जोड़ें",
          login: "लॉगिन",
          register: "पंजीकरण"
        }
      }
    }
  });

export default i18n;
