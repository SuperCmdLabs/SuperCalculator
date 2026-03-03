/** City/region name → IANA timezone identifier */
export const TIMEZONE_MAP: Record<string, string> = {
  // ─── Americas ─────────────────────────────────────────
  'new york': 'America/New_York', nyc: 'America/New_York', 'new york city': 'America/New_York', manhattan: 'America/New_York',
  boston: 'America/New_York', philadelphia: 'America/New_York', miami: 'America/New_York', atlanta: 'America/New_York',
  washington: 'America/New_York', 'washington dc': 'America/New_York', dc: 'America/New_York', detroit: 'America/New_York',
  orlando: 'America/New_York', charlotte: 'America/New_York', pittsburgh: 'America/New_York', raleigh: 'America/New_York',
  chicago: 'America/Chicago', dallas: 'America/Chicago', houston: 'America/Chicago', austin: 'America/Chicago',
  'san antonio': 'America/Chicago', nashville: 'America/Chicago', memphis: 'America/Chicago', milwaukee: 'America/Chicago',
  minneapolis: 'America/Chicago', 'kansas city': 'America/Chicago', 'new orleans': 'America/Chicago', 'oklahoma city': 'America/Chicago',
  madison: 'America/Chicago', indianapolis: 'America/Indiana/Indianapolis',
  denver: 'America/Denver', phoenix: 'America/Phoenix', 'salt lake city': 'America/Denver', albuquerque: 'America/Denver',
  'las vegas': 'America/Los_Angeles', 'los angeles': 'America/Los_Angeles', la: 'America/Los_Angeles',
  'san francisco': 'America/Los_Angeles', sf: 'America/Los_Angeles', seattle: 'America/Los_Angeles',
  portland: 'America/Los_Angeles', 'san diego': 'America/Los_Angeles', 'san jose': 'America/Los_Angeles',
  sacramento: 'America/Los_Angeles', oakland: 'America/Los_Angeles',
  anchorage: 'America/Anchorage', alaska: 'America/Anchorage',
  honolulu: 'Pacific/Honolulu', hawaii: 'Pacific/Honolulu',
  toronto: 'America/Toronto', montreal: 'America/Toronto', ottawa: 'America/Toronto',
  vancouver: 'America/Vancouver', calgary: 'America/Edmonton', edmonton: 'America/Edmonton',
  winnipeg: 'America/Winnipeg', halifax: 'America/Halifax',
  'mexico city': 'America/Mexico_City', guadalajara: 'America/Mexico_City', monterrey: 'America/Monterrey',
  'sao paulo': 'America/Sao_Paulo', 'são paulo': 'America/Sao_Paulo', rio: 'America/Sao_Paulo', 'rio de janeiro': 'America/Sao_Paulo', brasilia: 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires', argentina: 'America/Argentina/Buenos_Aires',
  lima: 'America/Lima', bogota: 'America/Bogota', santiago: 'America/Santiago',
  caracas: 'America/Caracas', quito: 'America/Guayaquil',

  // ─── Europe ───────────────────────────────────────────
  london: 'Europe/London', uk: 'Europe/London', 'united kingdom': 'Europe/London', england: 'Europe/London', britain: 'Europe/London',
  edinburgh: 'Europe/London', manchester: 'Europe/London', birmingham: 'Europe/London', glasgow: 'Europe/London',
  paris: 'Europe/Paris', france: 'Europe/Paris', lyon: 'Europe/Paris', marseille: 'Europe/Paris',
  berlin: 'Europe/Berlin', germany: 'Europe/Berlin', munich: 'Europe/Berlin', frankfurt: 'Europe/Berlin', hamburg: 'Europe/Berlin',
  amsterdam: 'Europe/Amsterdam', netherlands: 'Europe/Amsterdam',
  brussels: 'Europe/Brussels', belgium: 'Europe/Brussels',
  madrid: 'Europe/Madrid', spain: 'Europe/Madrid', barcelona: 'Europe/Madrid',
  rome: 'Europe/Rome', italy: 'Europe/Rome', milan: 'Europe/Rome',
  vienna: 'Europe/Vienna', austria: 'Europe/Vienna',
  zurich: 'Europe/Zurich', geneva: 'Europe/Zurich', switzerland: 'Europe/Zurich',
  lisbon: 'Europe/Lisbon', portugal: 'Europe/Lisbon',
  dublin: 'Europe/Dublin', ireland: 'Europe/Dublin',
  copenhagen: 'Europe/Copenhagen', denmark: 'Europe/Copenhagen',
  stockholm: 'Europe/Stockholm', sweden: 'Europe/Stockholm',
  oslo: 'Europe/Oslo', norway: 'Europe/Oslo',
  helsinki: 'Europe/Helsinki', finland: 'Europe/Helsinki',
  warsaw: 'Europe/Warsaw', poland: 'Europe/Warsaw', krakow: 'Europe/Warsaw',
  prague: 'Europe/Prague', 'czech republic': 'Europe/Prague', czechia: 'Europe/Prague',
  budapest: 'Europe/Budapest', hungary: 'Europe/Budapest',
  bucharest: 'Europe/Bucharest', romania: 'Europe/Bucharest',
  athens: 'Europe/Athens', greece: 'Europe/Athens',
  istanbul: 'Europe/Istanbul', turkey: 'Europe/Istanbul', ankara: 'Europe/Istanbul',
  moscow: 'Europe/Moscow', russia: 'Europe/Moscow', 'st petersburg': 'Europe/Moscow', 'saint petersburg': 'Europe/Moscow',
  kyiv: 'Europe/Kyiv', kiev: 'Europe/Kyiv', ukraine: 'Europe/Kyiv',
  belgrade: 'Europe/Belgrade', serbia: 'Europe/Belgrade',
  sofia: 'Europe/Sofia', bulgaria: 'Europe/Sofia',
  zagreb: 'Europe/Zagreb', croatia: 'Europe/Zagreb',
  bratislava: 'Europe/Bratislava', slovakia: 'Europe/Bratislava',
  tallinn: 'Europe/Tallinn', estonia: 'Europe/Tallinn',
  riga: 'Europe/Riga', latvia: 'Europe/Riga',
  vilnius: 'Europe/Vilnius', lithuania: 'Europe/Vilnius',
  luxembourg: 'Europe/Luxembourg',

  // ─── Asia ─────────────────────────────────────────────
  tokyo: 'Asia/Tokyo', japan: 'Asia/Tokyo', osaka: 'Asia/Tokyo',
  seoul: 'Asia/Seoul', 'south korea': 'Asia/Seoul', korea: 'Asia/Seoul',
  beijing: 'Asia/Shanghai', shanghai: 'Asia/Shanghai', china: 'Asia/Shanghai', guangzhou: 'Asia/Shanghai', shenzhen: 'Asia/Shanghai',
  'hong kong': 'Asia/Hong_Kong', hongkong: 'Asia/Hong_Kong',
  taipei: 'Asia/Taipei', taiwan: 'Asia/Taipei',
  singapore: 'Asia/Singapore',
  bangkok: 'Asia/Bangkok', thailand: 'Asia/Bangkok',
  'kuala lumpur': 'Asia/Kuala_Lumpur', kl: 'Asia/Kuala_Lumpur', malaysia: 'Asia/Kuala_Lumpur',
  jakarta: 'Asia/Jakarta', indonesia: 'Asia/Jakarta',
  manila: 'Asia/Manila', philippines: 'Asia/Manila',
  hanoi: 'Asia/Ho_Chi_Minh', 'ho chi minh': 'Asia/Ho_Chi_Minh', vietnam: 'Asia/Ho_Chi_Minh', saigon: 'Asia/Ho_Chi_Minh',
  mumbai: 'Asia/Kolkata', delhi: 'Asia/Kolkata', 'new delhi': 'Asia/Kolkata', india: 'Asia/Kolkata',
  bangalore: 'Asia/Kolkata', bengaluru: 'Asia/Kolkata', hyderabad: 'Asia/Kolkata', chennai: 'Asia/Kolkata',
  kolkata: 'Asia/Kolkata', pune: 'Asia/Kolkata', ahmedabad: 'Asia/Kolkata',
  karachi: 'Asia/Karachi', lahore: 'Asia/Karachi', islamabad: 'Asia/Karachi', pakistan: 'Asia/Karachi',
  dhaka: 'Asia/Dhaka', bangladesh: 'Asia/Dhaka',
  colombo: 'Asia/Colombo', 'sri lanka': 'Asia/Colombo',
  kathmandu: 'Asia/Kathmandu', nepal: 'Asia/Kathmandu',
  dubai: 'Asia/Dubai', 'abu dhabi': 'Asia/Dubai', uae: 'Asia/Dubai',
  riyadh: 'Asia/Riyadh', 'saudi arabia': 'Asia/Riyadh', jeddah: 'Asia/Riyadh',
  doha: 'Asia/Qatar', qatar: 'Asia/Qatar',
  muscat: 'Asia/Muscat', oman: 'Asia/Muscat',
  kuwait: 'Asia/Kuwait',
  bahrain: 'Asia/Bahrain',
  tehran: 'Asia/Tehran', iran: 'Asia/Tehran',
  baghdad: 'Asia/Baghdad', iraq: 'Asia/Baghdad',
  jerusalem: 'Asia/Jerusalem', 'tel aviv': 'Asia/Jerusalem', israel: 'Asia/Jerusalem',
  amman: 'Asia/Amman', jordan: 'Asia/Amman',
  beirut: 'Asia/Beirut', lebanon: 'Asia/Beirut',
  kabul: 'Asia/Kabul', afghanistan: 'Asia/Kabul',
  tashkent: 'Asia/Tashkent', uzbekistan: 'Asia/Tashkent',
  almaty: 'Asia/Almaty', kazakhstan: 'Asia/Almaty',
  yangon: 'Asia/Yangon', myanmar: 'Asia/Yangon',
  phnom_penh: 'Asia/Phnom_Penh', cambodia: 'Asia/Phnom_Penh',

  // ─── Africa ───────────────────────────────────────────
  cairo: 'Africa/Cairo', egypt: 'Africa/Cairo',
  lagos: 'Africa/Lagos', nigeria: 'Africa/Lagos',
  nairobi: 'Africa/Nairobi', kenya: 'Africa/Nairobi',
  johannesburg: 'Africa/Johannesburg', 'south africa': 'Africa/Johannesburg', 'cape town': 'Africa/Johannesburg',
  accra: 'Africa/Accra', ghana: 'Africa/Accra',
  addis_ababa: 'Africa/Addis_Ababa', ethiopia: 'Africa/Addis_Ababa', 'addis ababa': 'Africa/Addis_Ababa',
  casablanca: 'Africa/Casablanca', morocco: 'Africa/Casablanca',
  tunis: 'Africa/Tunis', tunisia: 'Africa/Tunis',
  algiers: 'Africa/Algiers', algeria: 'Africa/Algiers',
  'dar es salaam': 'Africa/Dar_es_Salaam', tanzania: 'Africa/Dar_es_Salaam',
  kampala: 'Africa/Kampala', uganda: 'Africa/Kampala',
  kigali: 'Africa/Kigali', rwanda: 'Africa/Kigali',

  // ─── Oceania ──────────────────────────────────────────
  sydney: 'Australia/Sydney', australia: 'Australia/Sydney',
  melbourne: 'Australia/Melbourne', brisbane: 'Australia/Brisbane',
  perth: 'Australia/Perth', adelaide: 'Australia/Adelaide',
  auckland: 'Pacific/Auckland', 'new zealand': 'Pacific/Auckland', wellington: 'Pacific/Auckland',
  fiji: 'Pacific/Fiji', suva: 'Pacific/Fiji',
};

/** Common timezone abbreviations → IANA or UTC offset */
export const TZ_ABBREVIATIONS: Record<string, string> = {
  utc: 'UTC', gmt: 'UTC',
  est: 'America/New_York', edt: 'America/New_York', et: 'America/New_York',
  cst: 'America/Chicago', cdt: 'America/Chicago', ct: 'America/Chicago',
  mst: 'America/Denver', mdt: 'America/Denver', mt: 'America/Denver',
  pst: 'America/Los_Angeles', pdt: 'America/Los_Angeles', pt: 'America/Los_Angeles',
  akst: 'America/Anchorage', akdt: 'America/Anchorage',
  hst: 'Pacific/Honolulu',
  ist: 'Asia/Kolkata',       // Indian Standard Time (most common usage)
  cet: 'Europe/Paris', cest: 'Europe/Paris',
  eet: 'Europe/Athens', eest: 'Europe/Athens',
  wet: 'Europe/Lisbon', west: 'Europe/Lisbon',
  bst: 'Europe/London',     // British Summer Time
  gst: 'Asia/Dubai',        // Gulf Standard Time
  jst: 'Asia/Tokyo',
  kst: 'Asia/Seoul',
  cst_china: 'Asia/Shanghai', // Disambiguated
  hkt: 'Asia/Hong_Kong',
  sgt: 'Asia/Singapore',
  ict: 'Asia/Bangkok',
  wib: 'Asia/Jakarta',
  pht: 'Asia/Manila',
  nzst: 'Pacific/Auckland', nzdt: 'Pacific/Auckland',
  aest: 'Australia/Sydney', aedt: 'Australia/Sydney',
  acst: 'Australia/Adelaide', acdt: 'Australia/Adelaide',
  awst: 'Australia/Perth',
  ast: 'America/Halifax',   // Atlantic Standard Time
  nst: 'America/St_Johns',  // Newfoundland
  brt: 'America/Sao_Paulo',
  art: 'America/Argentina/Buenos_Aires',
  msk: 'Europe/Moscow',
  irst: 'Asia/Tehran',
  pkt: 'Asia/Karachi',
  npt: 'Asia/Kathmandu',
  bdt: 'Asia/Dhaka',
  mmt: 'Asia/Yangon',
  cat: 'Africa/Nairobi',    // Central Africa Time
  eat: 'Africa/Nairobi',    // East Africa Time
  wat: 'Africa/Lagos',      // West Africa Time
  sast: 'Africa/Johannesburg',
};

/** Country name/code → common timezone */
export const COUNTRY_TZ: Record<string, string> = {
  us: 'America/New_York', usa: 'America/New_York', 'united states': 'America/New_York', america: 'America/New_York',
  canada: 'America/Toronto',
  mexico: 'America/Mexico_City',
  brazil: 'America/Sao_Paulo',
  uk: 'Europe/London', 'united kingdom': 'Europe/London', britain: 'Europe/London', england: 'Europe/London',
  france: 'Europe/Paris', germany: 'Europe/Berlin', italy: 'Europe/Rome', spain: 'Europe/Madrid',
  netherlands: 'Europe/Amsterdam', belgium: 'Europe/Brussels', switzerland: 'Europe/Zurich',
  portugal: 'Europe/Lisbon', ireland: 'Europe/Dublin', austria: 'Europe/Vienna',
  sweden: 'Europe/Stockholm', norway: 'Europe/Oslo', denmark: 'Europe/Copenhagen', finland: 'Europe/Helsinki',
  poland: 'Europe/Warsaw', czechia: 'Europe/Prague', hungary: 'Europe/Budapest',
  romania: 'Europe/Bucharest', greece: 'Europe/Athens', turkey: 'Europe/Istanbul',
  russia: 'Europe/Moscow', ukraine: 'Europe/Kyiv',
  india: 'Asia/Kolkata', pakistan: 'Asia/Karachi', bangladesh: 'Asia/Dhaka',
  china: 'Asia/Shanghai', japan: 'Asia/Tokyo', 'south korea': 'Asia/Seoul', korea: 'Asia/Seoul',
  indonesia: 'Asia/Jakarta', malaysia: 'Asia/Kuala_Lumpur', singapore: 'Asia/Singapore',
  thailand: 'Asia/Bangkok', vietnam: 'Asia/Ho_Chi_Minh', philippines: 'Asia/Manila',
  uae: 'Asia/Dubai', 'saudi arabia': 'Asia/Riyadh', qatar: 'Asia/Qatar',
  israel: 'Asia/Jerusalem', iran: 'Asia/Tehran', iraq: 'Asia/Baghdad',
  australia: 'Australia/Sydney', 'new zealand': 'Pacific/Auckland',
  egypt: 'Africa/Cairo', nigeria: 'Africa/Lagos', kenya: 'Africa/Nairobi',
  'south africa': 'Africa/Johannesburg', ghana: 'Africa/Accra', ethiopia: 'Africa/Addis_Ababa',
};

export function resolveTimezone(name: string): string | null {
  const lower = name.toLowerCase().trim();

  // Direct IANA timezone (e.g. "America/New_York")
  if (lower.includes('/')) {
    // Capitalize properly for Intl check
    try {
      Intl.DateTimeFormat(undefined, { timeZone: name });
      return name;
    } catch { /* not valid */ }
  }

  // Check abbreviations first
  if (TZ_ABBREVIATIONS[lower]) return TZ_ABBREVIATIONS[lower];

  // Check city/region map
  if (TIMEZONE_MAP[lower]) return TIMEZONE_MAP[lower];

  // Check country map
  if (COUNTRY_TZ[lower]) return COUNTRY_TZ[lower];

  return null;
}
