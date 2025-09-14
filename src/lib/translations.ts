export const translations = {
    english: {
        // General
        dashboard: 'Dashboard',
        buyers: 'Buyers',
        analytics: 'Analytics',
        settings: 'Settings',
        profile: 'Your Profile',
        signOut: 'Sign out',

        // Form labels
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        city: 'City',
        propertyType: 'Property Type',

        // Status
        new: 'New',
        contacted: 'Contacted',
        qualified: 'Qualified',
        visited: 'Visited',
        negotiation: 'Negotiation',
        converted: 'Converted',
        dropped: 'Dropped',

        // Settings
        general: 'General',
        language: 'Language',
        theme: 'Theme',
        timezone: 'Timezone',
        dateFormat: 'Date Format',
        notifications: 'Notifications',
        privacy: 'Privacy',
        security: 'Security',

        // Messages
        saveSuccess: 'Settings saved successfully!',
        updateSuccess: 'Profile updated successfully!'
    },

    hindi: {
        // General
        dashboard: 'डैशबोर्ड',
        buyers: 'खरीदार',
        analytics: 'विश्लेषण',
        settings: 'सेटिंग्स',
        profile: 'आपकी प्रोफ़ाइल',
        signOut: 'साइन आउट',

        // Form labels
        fullName: 'पूरा नाम',
        email: 'ईमेल पता',
        phone: 'फ़ोन नंबर',
        city: 'शहर',
        propertyType: 'संपत्ति का प्रकार',

        // Status
        new: 'नया',
        contacted: 'संपर्क किया गया',
        qualified: 'योग्य',
        visited: 'देखा गया',
        negotiation: 'बातचीत',
        converted: 'परिवर्तित',
        dropped: 'छोड़ा गया',

        // Settings
        general: 'सामान्य',
        language: 'भाषा',
        theme: 'थीम',
        timezone: 'समय क्षेत्र',
        dateFormat: 'दिनांक प्रारूप',
        notifications: 'सूचनाएं',
        privacy: 'गोपनीयता',
        security: 'सुरक्षा',

        // Messages
        saveSuccess: 'सेटिंग्स सफलतापूर्वक सहेजी गईं!',
        updateSuccess: 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!'
    },

    punjabi: {
        // General
        dashboard: 'ਡੈਸ਼ਬੋਰਡ',
        buyers: 'ਖਰੀਦਦਾਰ',
        analytics: 'ਵਿਸ਼ਲੇਸ਼ਣ',
        settings: 'ਸੈਟਿੰਗਾਂ',
        profile: 'ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ',
        signOut: 'ਸਾਈਨ ਆਉਟ',

        // Form labels
        fullName: 'ਪੂਰਾ ਨਾਮ',
        email: 'ਈਮੇਲ ਪਤਾ',
        phone: 'ਫ਼ੋਨ ਨੰਬਰ',
        city: 'ਸ਼ਹਿਰ',
        propertyType: 'ਜਾਇਦਾਦ ਦੀ ਕਿਸਮ',

        // Status
        new: 'ਨਵਾਂ',
        contacted: 'ਸੰਪਰਕ ਕੀਤਾ',
        qualified: 'ਯੋਗ',
        visited: 'ਦੇਖਿਆ',
        negotiation: 'ਗੱਲਬਾਤ',
        converted: 'ਤਬਦੀਲ',
        dropped: 'ਛੱਡਿਆ',

        // Settings
        general: 'ਆਮ',
        language: 'ਭਾਸ਼ਾ',
        theme: 'ਥੀਮ',
        timezone: 'ਸਮਾਂ ਖੇਤਰ',
        dateFormat: 'ਮਿਤੀ ਫਾਰਮੈਟ',
        notifications: 'ਸੂਚਨਾਵਾਂ',
        privacy: 'ਗੁਪਤਤਾ',
        security: 'ਸੁਰੱਖਿਆ',

        // Messages
        saveSuccess: 'ਸੈਟਿੰਗਾਂ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਕੀਤੀਆਂ ਗਈਆਂ!',
        updateSuccess: 'ਪ੍ਰੋਫਾਈਲ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਕੀਤੀ ਗਈ!'
    }
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.english