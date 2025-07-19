// Country code to flag emoji mapping
export const countryFlags: Record<string, string> = {
  'US': '🇺🇸',
  'United States': '🇺🇸',
  'USA': '🇺🇸',
  'IN': '🇮🇳',
  'India': '🇮🇳',
  'PK': '🇵🇰',
  'Pakistan': '🇵🇰',
  'GB': '🇬🇧',
  'United Kingdom': '🇬🇧',
  'UK': '🇬🇧',
  'CA': '🇨🇦',
  'Canada': '🇨🇦',
  'AU': '🇦🇺',
  'Australia': '🇦🇺',
  'DE': '🇩🇪',
  'Germany': '🇩🇪',
  'FR': '🇫🇷',
  'France': '🇫🇷',
  'JP': '🇯🇵',
  'Japan': '🇯🇵',
  'BR': '🇧🇷',
  'Brazil': '🇧🇷',
  'MX': '🇲🇽',
  'Mexico': '🇲🇽',
  'KR': '🇰🇷',
  'South Korea': '🇰🇷',
  'TR': '🇹🇷',
  'Turkey': '🇹🇷',
  'IT': '🇮🇹',
  'Italy': '🇮🇹',
  'ES': '🇪🇸',
  'Spain': '🇪🇸',
  'NL': '🇳🇱',
  'Netherlands': '🇳🇱',
  'RU': '🇷🇺',
  'Russia': '🇷🇺',
  'CN': '🇨🇳',
  'China': '🇨🇳',
  'ID': '🇮🇩',
  'Indonesia': '🇮🇩',
  'TH': '🇹🇭',
  'Thailand': '🇹🇭',
  'VN': '🇻🇳',
  'Vietnam': '🇻🇳',
  'PH': '🇵🇭',
  'Philippines': '🇵🇭',
  'MY': '🇲🇾',
  'Malaysia': '🇲🇾',
  'SG': '🇸🇬',
  'Singapore': '🇸🇬',
  'AE': '🇦🇪',
  'UAE': '🇦🇪',
  'United Arab Emirates': '🇦🇪',
  'SA': '🇸🇦',
  'Saudi Arabia': '🇸🇦',
  'EG': '🇪🇬',
  'Egypt': '🇪🇬',
  'ZA': '🇿🇦',
  'South Africa': '🇿🇦',
  'NG': '🇳🇬',
  'Nigeria': '🇳🇬',
  'KE': '🇰🇪',
  'Kenya': '🇰🇪',
  'AR': '🇦🇷',
  'Argentina': '🇦🇷',
  'CL': '🇨🇱',
  'Chile': '🇨🇱',
  'CO': '🇨🇴',
  'Colombia': '🇨🇴',
  'PE': '🇵🇪',
  'Peru': '🇵🇪',
  'BD': '🇧🇩',
  'Bangladesh': '🇧🇩',
  'LK': '🇱🇰',
  'Sri Lanka': '🇱🇰',
  'NP': '🇳🇵',
  'Nepal': '🇳🇵',
  'AF': '🇦🇫',
  'Afghanistan': '🇦🇫',
  'EU': '🇪🇺',
  'European Union': '🇪🇺',
};

export function getCountryFlag(countryName: string): string {
  // Try exact match first
  if (countryFlags[countryName]) {
    return countryFlags[countryName];
  }
  
  // Try to find a partial match
  const lowerCountry = countryName.toLowerCase();
  for (const [key, flag] of Object.entries(countryFlags)) {
    if (key.toLowerCase().includes(lowerCountry) || lowerCountry.includes(key.toLowerCase())) {
      return flag;
    }
  }
  
  // Return a generic globe emoji if no match found
  return '🌍';
}

export function getCountryWithFlag(countryName: string): string {
  const flag = getCountryFlag(countryName);
  return `${flag} ${countryName}`;
}