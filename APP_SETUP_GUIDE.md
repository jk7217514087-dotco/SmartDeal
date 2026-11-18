# 📱 SmartDeal Mobile App Guide

SmartDeal वेबसाइट को अब एक **पूर्ण मोबाइल ऐप (PWA + Native Android App)** में बदल दिया गया है।

---

## 🚀 तरीका 1: 1-Click में Phone पर App Install करें (PWA - बिना किसी सॉफ्टवेयर के)

यह सबसे तेज़ और आसान तरीका है। किसी भी Android या iPhone पर बिना किसी प्ले स्टोर फीस के तुरंत काम करता है:

### 🤖 Android Phone पर:
1. अपने फ़ोन के **Google Chrome** या किसी भी ब्राउज़र में वेबसाइट खोलें।
2. नीचे स्क्रीन पर **"Install SmartDeal App"** का बैनर दिखेगा — **"Install"** बटन दबाएं।
3. या फिर ऊपर ब्राउज़र के **3 डॉट्स (⋮)** पर टैप करें और **"Install App"** या **"Add to Home screen"** चुनें।
4. ऐप आपके फ़ोन की होम स्क्रीन पर **SmartDeal** नाम से नेटिव ऐप की तरह आ जाएगा!
5. इसे खोलने पर कोई ब्राउज़र URL बार नहीं दिखेगा — यह 100% फुल-स्क्रीन नेटिव ऐप की तरह चलेगा।

### 🍎 iPhone / iPad (iOS) पर:
1. **Safari** ब्राउज़र में वेबसाइट खोलें।
2. नीचे दिए गए **Share बटन (📤)** पर टैप करें।
3. नीचे स्क्रॉल करके **"Add to Home Screen" (होम स्क्रीन में जोड़ें)** चुनें।
4. ऐप आपके iPhone की स्क्रीन पर **SmartDeal** नाम से इंस्टॉल हो जाएगा।

---

## 📦 तरीका 2: Native Android APK फाइल बनाना (Android Studio / Capacitor)

यदि आपको अपने फ़ोन के लिए अलग से `.apk` फाइल या Google Play Store के लिए `.aab` फाइल बनानी है:

### स्टेप्स:
1. प्रोजेक्ट डायरेक्टरी में कमांड रन करें:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap add android
   npm run build
   npx cap sync
   npx cap open android
   ```
2. Android Studio खुल जाएगा।
3. ऊपर मेन्यू में जाकर **Build -> Build Bundle(s) / APK(s) -> Build APK(s)** पर क्लिक करें।
4. आपका **SmartDeal.apk** तैयार हो जाएगा!

---

## ⚡ तरीका 3: PWABuilder द्वारा 1-Click APK डाउनलोड

1. वेबसाइट को ऑनलाइन डिप्लॉय करें (जैसे Vercel, Netlify, Railway आदि)।
2. [PWABuilder.com](https://www.pwabuilder.com) पर जाएं।
3. अपना URL डालें।
4. **"Package for Stores"** -> **Android** पर क्लिक करें।
5. यह सीधे आपको हस्ताक्षरित (Signed) APK फाइल डाउनलोड करके दे देगा!

---

## ✨ ऐप के मुख्य फीचर्स:
- **SmartDeal Brand Branding**: होम स्क्रीन पर स्पष्ट "SmartDeal" नाम और ऐप आइकन।
- **Offline Caching**: `sw.js` सर्विस वर्कर के साथ नेटवर्क न होने पर भी ऐप लोड होगा।
- **Native Look & Feel**: बिना ब्राउज़र बार के फुल स्क्रीन डिस्प्ले (`standalone`).
- **App Shortcuts**: होम स्क्रीन आइकन को देर तक दबाने पर सीधे Deals, Categories या Compare खुलेंगे।
- **Fast Speed**: 2x तेज़ लोडिंग और स्मूथ एनिमेशन।


