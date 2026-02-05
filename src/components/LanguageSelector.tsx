import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { languages, Language, getLanguageByCode, getDefaultLanguage } from '@/data/languages';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'compact';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(getDefaultLanguage());

  useEffect(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = getLanguageByCode(savedLanguage);
      if (language) {
        setSelectedLanguage(language);
      }
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      const detectedLanguage = getLanguageByCode(browserLang);
      if (detectedLanguage) {
        setSelectedLanguage(detectedLanguage);
        localStorage.setItem('selectedLanguage', detectedLanguage.code);
      }
    }
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    const language = getLanguageByCode(languageCode);
    if (language) {
      setSelectedLanguage(language);
      localStorage.setItem('selectedLanguage', language.code);
      
      // Here you would typically trigger a language change in your app
      // For now, we'll just log it
      console.log('Language changed to:', language.name);
      
      // You can add your i18n logic here
      // Example: i18n.changeLanguage(language.code);
    }
  };

  if (variant === 'compact') {
    return (
      <Select value={selectedLanguage.code} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-auto min-w-[120px] ${className}`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{selectedLanguage.flag}</span>
            <span className="text-sm font-medium">{selectedLanguage.code.toUpperCase()}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{language.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={selectedLanguage.code} onValueChange={handleLanguageChange}>
      <SelectTrigger className={`w-auto min-w-[180px] ${className}`}>
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span className="text-lg">{selectedLanguage.flag}</span>
          <span className="font-medium">{selectedLanguage.nativeName}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center space-x-3">
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">{language.name}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector; 