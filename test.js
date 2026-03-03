import { calculate } from '@supercmd/calculator';

// ─────────────────────────────────────────────
// Exhaustive test suite for @supercmd/calculator
// ─────────────────────────────────────────────

const tests = [];

function t(input, expectedType, description, validate) {
  tests.push({ input, expectedType, description, validate });
}

// ═══════════════════════════════════════════════
// 1. MATH - Basic Arithmetic
// ═══════════════════════════════════════════════
t('3 + 4', 'math', 'simple addition');
t('10 - 3', 'math', 'simple subtraction');
t('6 * 7', 'math', 'simple multiplication');
t('20 / 4', 'math', 'simple division');
t('10 % 3', 'math', 'modulo');
t('3 + 43 + 23', 'math', 'multi-term addition');
t('100 - 50 + 25', 'math', 'mixed add/subtract');
t('2 * 3 + 4', 'math', 'operator precedence mul before add');
t('2 + 3 * 4', 'math', 'operator precedence mul before add v2');
t('10 / 2 - 1', 'math', 'div then subtract');
t('0 + 0', 'math', 'zero addition');
t('0 * 100', 'math', 'zero multiplication');
t('100 / 1', 'math', 'division by 1');
t('-5 + 3', 'math', 'negative number addition');
t('-5 * -3', 'math', 'negative times negative');
t('-10 / 2', 'math', 'negative division');
t('0.1 + 0.2', 'math', 'floating point addition');
t('1.5 * 2.5', 'math', 'floating point multiplication');
t('99999 + 1', 'math', 'large number addition');
t('999999999 * 999999999', 'math', 'very large multiplication');

// ═══════════════════════════════════════════════
// 2. MATH - Parentheses
// ═══════════════════════════════════════════════
t('(3 + 4) * 2', 'math', 'parentheses override precedence');
t('((2 + 3) * (4 - 1))', 'math', 'nested parentheses');
t('(10)', 'math', 'single value in parentheses');
t('(2 + 3) * (4 + 5)', 'math', 'two grouped expressions');
t('((1 + 2) + (3 + 4)) * 2', 'math', 'deeply nested parentheses');

// ═══════════════════════════════════════════════
// 3. MATH - Exponentiation
// ═══════════════════════════════════════════════
t('2^10', 'math', 'caret exponentiation');
t('2**10', 'math', 'double-star exponentiation');
t('3^3', 'math', 'cube with caret');
t('10^0', 'math', 'anything to power 0');
t('2^-1', 'math', 'negative exponent');
t('0^0', 'math', 'zero to zero edge case');
t('2^0.5', 'math', 'fractional exponent (sqrt)');

// ═══════════════════════════════════════════════
// 4. MATH - Functions
// ═══════════════════════════════════════════════
t('sqrt(144)', 'math', 'square root');
t('sqrt(2)', 'math', 'irrational square root');
t('sqrt(0)', 'math', 'sqrt of zero');
t('sqrt(1)', 'math', 'sqrt of one');
t('sqrt(6)', 'math', 'sqrt of 6');
t('cbrt(27)', 'math', 'cube root');
t('cbrt(8)', 'math', 'cube root of 8');
t('abs(-5)', 'math', 'absolute value negative');
t('abs(5)', 'math', 'absolute value positive');
t('abs(0)', 'math', 'absolute value zero');
t('ceil(4.2)', 'math', 'ceiling');
t('ceil(4.9)', 'math', 'ceiling close to next int');
t('ceil(-4.2)', 'math', 'ceiling negative');
t('floor(4.9)', 'math', 'floor');
t('floor(4.1)', 'math', 'floor close to int');
t('floor(-4.2)', 'math', 'floor negative');
t('round(4.5)', 'math', 'round half up');
t('round(4.4)', 'math', 'round down');
t('round(4.6)', 'math', 'round up');
t('log(100)', 'math', 'log base 10');
t('log2(8)', 'math', 'log base 2');
t('log10(1000)', 'math', 'log base 10 explicit');
t('ln(1)', 'math', 'natural log of 1');
t('ln(e)', 'math', 'natural log of e');
t('exp(1)', 'math', 'e^1');
t('exp(0)', 'math', 'e^0');
t('sin(0)', 'math', 'sin of 0');
t('cos(0)', 'math', 'cos of 0');
t('tan(0)', 'math', 'tan of 0');
t('sin(pi)', 'math', 'sin of pi');
t('cos(pi)', 'math', 'cos of pi');
t('asin(0)', 'math', 'arcsin of 0');
t('acos(1)', 'math', 'arccos of 1');
t('atan(0)', 'math', 'arctan of 0');
t('sinh(0)', 'math', 'hyperbolic sin');
t('cosh(0)', 'math', 'hyperbolic cos');
t('tanh(0)', 'math', 'hyperbolic tan');
t('pow(2, 10)', 'math', 'pow function');
t('pow(3, 3)', 'math', 'pow function cube');
t('max(1, 5, 3)', 'math', 'max of three numbers');
t('min(1, 5, 3)', 'math', 'min of three numbers');
t('max(10, 20)', 'math', 'max of two numbers');
t('min(-5, 5)', 'math', 'min with negative');

// ═══════════════════════════════════════════════
// 5. MATH - Constants
// ═══════════════════════════════════════════════
t('pi', 'math', 'pi constant');
t('e', 'math', 'euler number');
t('tau', 'math', 'tau constant');
t('phi', 'math', 'golden ratio');
t('pi * 2', 'math', 'pi times 2 = tau');
t('e^2', 'math', 'e squared');
t('2 * pi * 5', 'math', 'circumference formula');

// ═══════════════════════════════════════════════
// 6. MATH - Factorial
// ═══════════════════════════════════════════════
t('5!', 'math', 'factorial of 5');
t('0!', 'math', 'factorial of 0');
t('1!', 'math', 'factorial of 1');
t('10!', 'math', 'factorial of 10');
t('3! + 4!', 'math', 'sum of factorials');

// ═══════════════════════════════════════════════
// 7. MATH - Percentage
// ═══════════════════════════════════════════════
t('50%', 'math', 'percentage as decimal');
t('100%', 'math', '100 percent');
t('0%', 'math', '0 percent');
t('25% * 200', 'math', '25% of 200');
t('200 * 15%', 'math', '15% of 200');

// ═══════════════════════════════════════════════
// 8. MATH - Bitwise
// ═══════════════════════════════════════════════
t('5 & 3', 'math', 'bitwise AND');
t('5 | 3', 'math', 'bitwise OR');
t('~5', 'math', 'bitwise NOT');
t('1 << 3', 'math', 'left shift');
t('8 >> 2', 'math', 'right shift');

// ═══════════════════════════════════════════════
// 9. MATH - Base Literals
// ═══════════════════════════════════════════════
t('0xFF', 'math', 'hex literal uppercase');
t('0xff', 'math', 'hex literal lowercase');
t('0xA', 'math', 'hex single digit');
t('0b1010', 'math', 'binary literal');
t('0b11111111', 'math', 'binary 255');
t('0o77', 'math', 'octal literal');
t('0o10', 'math', 'octal 8');
t('0xFF + 1', 'math', 'hex in expression');
t('0b1010 + 0o10', 'math', 'mixed base expression');

// ═══════════════════════════════════════════════
// 10. MATH - Scientific Notation
// ═══════════════════════════════════════════════
t('1e10', 'math', 'scientific notation large');
t('2.5e-3', 'math', 'scientific notation small');
t('1e0', 'math', 'sci notation 10^0');
t('3e2 + 5e1', 'math', 'sci notation in expression');
t('1.23e4', 'math', 'sci notation with decimal');

// ═══════════════════════════════════════════════
// 11. MATH - Complex Expressions
// ═══════════════════════════════════════════════
t('sqrt(3^2 + 4^2)', 'math', 'pythagorean theorem');
t('(1 + sqrt(5)) / 2', 'math', 'golden ratio formula');
t('2 * pi * sqrt(10 / 9.8)', 'math', 'pendulum period');
t('log2(1024)', 'math', 'log2 of power of 2');
t('sin(pi/4)', 'math', 'sin 45 degrees');
t('cos(pi/3)', 'math', 'cos 60 degrees');
t('sin(pi/2)', 'math', 'sin 90 degrees');
t('floor(3.7) + ceil(2.1)', 'math', 'combined floor/ceil');

// ═══════════════════════════════════════════════
// 12. MATH - Edge Cases / Errors
// ═══════════════════════════════════════════════
t('1 / 0', 'error', 'division by zero');
t('', 'error', 'empty input');
t('   ', 'error', 'whitespace only');
t('hello world', 'error', 'random text');
t('abc + def', 'error', 'non-numeric text in math');
t('+++', 'error', 'invalid operators');
t('(()', 'error', 'unbalanced parentheses');
t('3 +', 'error', 'incomplete expression');
t('* 5', 'error', 'leading operator');
t('infinity', 'math', 'infinity constant');
t('infinity + 1', 'math', 'infinity arithmetic');
t('infinity - infinity', 'math', 'infinity minus infinity');
t('sqrt(-1)', 'math', 'sqrt of negative (NaN?)');

// ═══════════════════════════════════════════════
// 13. UNIT CONVERSIONS - Length
// ═══════════════════════════════════════════════
t('3 km to m', 'unit', 'km to meters');
t('1 m to cm', 'unit', 'meters to cm');
t('1 mi to km', 'unit', 'miles to km');
t('12 in to cm', 'unit', 'inches to cm');
t('6 ft to m', 'unit', 'feet to meters');
t('100 yd to m', 'unit', 'yards to meters');
t('1 nmi to km', 'unit', 'nautical miles to km');
t('1 light year to km', 'unit', 'light year to km');
t('1 au to km', 'unit', 'astronomical unit to km');
t('1000 mm to m', 'unit', 'mm to meters');
t('500 nm to mm', 'unit', 'nanometers to mm');
t('1 parsec to light year', 'unit', 'parsec to light year');
t('5280 ft to mi', 'unit', '5280 feet to miles');
t('1 km to ft', 'unit', 'km to feet');
t('1 cm to in', 'unit', 'cm to inches');
t('100 cm to m', 'unit', '100 cm to meters');
t('0.5 km to m', 'unit', 'half km to meters');
t('1000000 mm to km', 'unit', 'million mm to km');

// ═══════════════════════════════════════════════
// 14. UNIT CONVERSIONS - Mass
// ═══════════════════════════════════════════════
t('5 kg to lb', 'unit', 'kg to pounds');
t('1 lb to kg', 'unit', 'pounds to kg');
t('1000 g to kg', 'unit', 'grams to kg');
t('1 tonne to kg', 'unit', 'tonne to kg');
t('16 oz to lb', 'unit', 'ounces to pounds');
t('1 stone to kg', 'unit', 'stone to kg');
t('1 carat to g', 'unit', 'carat to grams');
t('1000 mg to g', 'unit', 'mg to grams');
t('1 grain to mg', 'unit', 'grain to mg');
t('100 lb to kg', 'unit', '100 pounds to kg');
t('2.5 kg to g', 'unit', '2.5 kg to grams');
t('1 kg to oz', 'unit', 'kg to ounces');

// ═══════════════════════════════════════════════
// 15. UNIT CONVERSIONS - Volume
// ═══════════════════════════════════════════════
t('1 l to ml', 'unit', 'liters to ml');
t('1 gallon to l', 'unit', 'gallon to liters');
t('1 cup to ml', 'unit', 'cup to ml');
t('1 pint to ml', 'unit', 'pint to ml');
t('1 quart to l', 'unit', 'quart to liters');
t('3 tsp to tbsp', 'unit', 'teaspoons to tablespoons');
t('1 fl oz to ml', 'unit', 'fluid ounce to ml');
t('1 barrel to gallon', 'unit', 'barrel to gallons');
t('500 ml to cup', 'unit', 'ml to cups');
t('2 l to pint', 'unit', 'liters to pints');
t('1 tbsp to tsp', 'unit', 'tablespoon to teaspoons');

// ═══════════════════════════════════════════════
// 16. UNIT CONVERSIONS - Area
// ═══════════════════════════════════════════════
t('1 km² to m²', 'unit', 'sq km to sq meters');
t('1 acre to m²', 'unit', 'acre to sq meters');
t('1 hectare to acre', 'unit', 'hectare to acres');
t('1 mi² to km²', 'unit', 'sq miles to sq km');
t('1 ft² to m²', 'unit', 'sq feet to sq meters');
t('144 in² to ft²', 'unit', 'sq inches to sq feet');
t('1 yd² to ft²', 'unit', 'sq yards to sq feet');
t('10000 m² to hectare', 'unit', 'sq meters to hectare');

// ═══════════════════════════════════════════════
// 17. UNIT CONVERSIONS - Temperature
// ═══════════════════════════════════════════════
t('100 fahrenheit to celsius', 'unit', '100F to C');
t('0 celsius to fahrenheit', 'unit', '0C to F');
t('32 fahrenheit to celsius', 'unit', 'freezing point F to C');
t('212 fahrenheit to celsius', 'unit', 'boiling point F to C');
t('100 celsius to fahrenheit', 'unit', '100C to F');
t('0 kelvin to celsius', 'unit', 'absolute zero to C');
t('273.15 kelvin to celsius', 'unit', '273.15K to C');
t('100 celsius to kelvin', 'unit', '100C to K');
t('-40 celsius to fahrenheit', 'unit', '-40C to F (same value)');
t('98.6 fahrenheit to celsius', 'unit', 'body temp F to C');
t('72 fahrenheit to celsius', 'unit', 'room temp F to C');
t('350 fahrenheit to celsius', 'unit', 'oven temp F to C');

// ═══════════════════════════════════════════════
// 18. UNIT CONVERSIONS - Speed
// ═══════════════════════════════════════════════
t('100 km/h to mph', 'unit', 'km/h to mph');
t('60 mph to km/h', 'unit', 'mph to km/h');
t('1 mach to km/h', 'unit', 'mach to km/h');
t('10 m/s to km/h', 'unit', 'm/s to km/h');
t('1 knots to km/h', 'unit', 'knots to km/h');
t('100 mph to m/s', 'unit', 'mph to m/s');
t('340 m/s to mach', 'unit', 'speed of sound to mach');

// ═══════════════════════════════════════════════
// 19. UNIT CONVERSIONS - Time
// ═══════════════════════════════════════════════
t('1 hr to min', 'unit', 'hour to minutes');
t('1 day to hr', 'unit', 'day to hours');
t('1 week to day', 'unit', 'week to days');
t('1 year to day', 'unit', 'year to days');
t('1 decade to year', 'unit', 'decade to years');
t('1 century to year', 'unit', 'century to years');
t('60 s to min', 'unit', 'seconds to minutes');
t('1000 ms to s', 'unit', 'milliseconds to seconds');
t('1000000 ns to ms', 'unit', 'nanoseconds to ms');
t('1 month to day', 'unit', 'month to days');
t('24 hr to day', 'unit', '24 hours to days');
t('365 day to year', 'unit', '365 days to years');

// ═══════════════════════════════════════════════
// 20. UNIT CONVERSIONS - Data
// ═══════════════════════════════════════════════
t('1 gb to mb', 'unit', 'GB to MB');
t('1 tb to gb', 'unit', 'TB to GB');
t('1 mb to kb', 'unit', 'MB to KB');
t('8 bit to byte', 'unit', 'bits to byte');
t('1 pb to tb', 'unit', 'PB to TB');
t('1 gib to mib', 'unit', 'GiB to MiB');
t('1 tib to gib', 'unit', 'TiB to GiB');
t('1 kib to byte', 'unit', 'KiB to bytes');
t('1024 mb to gb', 'unit', '1024 MB to GB');
t('1 gb to byte', 'unit', 'GB to bytes');

// ═══════════════════════════════════════════════
// 21. UNIT CONVERSIONS - Pressure
// ═══════════════════════════════════════════════
t('1 atm to psi', 'unit', 'atmosphere to psi');
t('1 bar to kPa', 'unit', 'bar to kilopascals');
t('760 mmHg to atm', 'unit', 'mmHg to atmosphere');
t('1 atm to torr', 'unit', 'atm to torr');
t('100 kPa to bar', 'unit', 'kPa to bar');
t('14.7 psi to atm', 'unit', 'psi to atm');
t('101325 Pa to atm', 'unit', 'pascals to atm');

// ═══════════════════════════════════════════════
// 22. UNIT CONVERSIONS - Energy
// ═══════════════════════════════════════════════
t('1 kWh to J', 'unit', 'kWh to joules');
t('1 cal to J', 'unit', 'calorie to joules');
t('1000 cal to kcal', 'unit', 'calories to kilocalories');
t('1 BTU to J', 'unit', 'BTU to joules');
t('1 eV to J', 'unit', 'electron volt to joules');
t('1 kJ to cal', 'unit', 'kJ to calories');
t('1 Wh to J', 'unit', 'watt-hour to joules');

// ═══════════════════════════════════════════════
// 23. UNIT CONVERSIONS - Power
// ═══════════════════════════════════════════════
t('1 kW to W', 'unit', 'kilowatt to watts');
t('1 hp to W', 'unit', 'horsepower to watts');
t('1 MW to kW', 'unit', 'megawatt to kilowatts');
t('1 GW to MW', 'unit', 'gigawatt to megawatts');
t('746 W to hp', 'unit', 'watts to horsepower');

// ═══════════════════════════════════════════════
// 24. UNIT CONVERSIONS - Angle
// ═══════════════════════════════════════════════
t('180 deg to rad', 'unit', 'degrees to radians');
t('1 rad to deg', 'unit', 'radians to degrees');
t('360 deg to revolution', 'unit', 'degrees to revolution');
t('1 revolution to deg', 'unit', 'revolution to degrees');
t('100 grad to deg', 'unit', 'gradians to degrees');
t('60 arcmin to deg', 'unit', 'arcminutes to degrees');
t('3600 arcsec to deg', 'unit', 'arcseconds to degrees');

// ═══════════════════════════════════════════════
// 25. UNIT CONVERSIONS - Frequency
// ═══════════════════════════════════════════════
t('1 GHz to MHz', 'unit', 'GHz to MHz');
t('1 MHz to kHz', 'unit', 'MHz to kHz');
t('1 kHz to Hz', 'unit', 'kHz to Hz');
t('1 THz to GHz', 'unit', 'THz to GHz');
t('60 RPM to Hz', 'unit', 'RPM to Hz');

// ═══════════════════════════════════════════════
// 26. UNIT CONVERSIONS - Electric Current
// ═══════════════════════════════════════════════
t('1 A to mA', 'unit', 'amperes to milliamps');
t('1 kA to A', 'unit', 'kiloamperes to amps');
t('1000 mA to A', 'unit', 'milliamps to amps');

// ═══════════════════════════════════════════════
// 27. UNIT CONVERSIONS - Voltage
// ═══════════════════════════════════════════════
t('1 kV to V', 'unit', 'kilovolts to volts');
t('1000 mV to V', 'unit', 'millivolts to volts');
t('1 V to mV', 'unit', 'volts to millivolts');

// ═══════════════════════════════════════════════
// 28. UNIT CONVERSIONS - Fuel Economy
// ═══════════════════════════════════════════════
t('30 mpg to km/l', 'unit', 'mpg to km/l');
t('10 km/l to mpg', 'unit', 'km/l to mpg');

// ═══════════════════════════════════════════════
// 29. UNIT CONVERSIONS - Natural Language Variations
// ═══════════════════════════════════════════════
t('convert 5 km to miles', 'unit', 'natural: convert X to Y');
t('10 kilometers to miles', 'unit', 'natural: full unit names');
t('100 centimeters to meters', 'unit', 'natural: centimeters full name');
t('5 kilograms to pounds', 'unit', 'natural: kilograms full name');
t('1 liter to milliliters', 'unit', 'natural: liter full name');
t('60 miles per hour to km/h', 'unit', 'natural: miles per hour');
t('1 meter to feet', 'unit', 'natural: meter to feet');
t('1 foot to meter', 'unit', 'natural: foot singular');
t('2 feet to meters', 'unit', 'natural: feet plural');
t('1 inch to centimeters', 'unit', 'natural: inch singular');
t('12 inches to feet', 'unit', 'natural: inches plural');
t('1 pound to kilograms', 'unit', 'natural: pound full');
t('1 ounce to grams', 'unit', 'natural: ounce full');
t('1 mile to kilometers', 'unit', 'natural: mile singular');
t('5 miles to km', 'unit', 'natural: miles plural');
t('1 yard to meters', 'unit', 'natural: yard full');
t('1 gallon to liters', 'unit', 'natural: gallon full');
t('2 gallons to liters', 'unit', 'natural: gallons plural');
t('1 teaspoon to tablespoon', 'unit', 'natural: teaspoon full');
t('1 tablespoon to teaspoon', 'unit', 'natural: tablespoon full');

// ═══════════════════════════════════════════════
// 30. TIME ZONES - City names
// ═══════════════════════════════════════════════
t('time in tokyo', 'time', 'time in tokyo');
t('time in new york', 'time', 'time in new york');
t('time in madison', 'time', 'time in madison');
t('time in london', 'time', 'time in london');
t('time in paris', 'time', 'time in paris');
t('time in berlin', 'time', 'time in berlin');
t('time in sydney', 'time', 'time in sydney');
t('time in mumbai', 'time', 'time in mumbai');
t('time in beijing', 'time', 'time in beijing');
t('time in dubai', 'time', 'time in dubai');
t('time in singapore', 'time', 'time in singapore');
t('time in hong kong', 'time', 'time in hong kong');
t('time in los angeles', 'time', 'time in los angeles');
t('time in chicago', 'time', 'time in chicago');
t('time in denver', 'time', 'time in denver');
t('time in toronto', 'time', 'time in toronto');
t('time in moscow', 'time', 'time in moscow');
t('time in seoul', 'time', 'time in seoul');
t('time in bangkok', 'time', 'time in bangkok');
t('time in cairo', 'time', 'time in cairo');
t('time in istanbul', 'time', 'time in istanbul');
t('time in san francisco', 'time', 'time in san francisco');
t('time in seattle', 'time', 'time in seattle');
t('time in boston', 'time', 'time in boston');
t('time in miami', 'time', 'time in miami');
t('time in dallas', 'time', 'time in dallas');
t('time in phoenix', 'time', 'time in phoenix');
t('time in honolulu', 'time', 'time in honolulu');
t('time in anchorage', 'time', 'time in anchorage');
t('time in amsterdam', 'time', 'time in amsterdam');
t('time in rome', 'time', 'time in rome');
t('time in madrid', 'time', 'time in madrid');
t('time in lisbon', 'time', 'time in lisbon');
t('time in zurich', 'time', 'time in zurich');
t('time in vienna', 'time', 'time in vienna');
t('time in stockholm', 'time', 'time in stockholm');
t('time in oslo', 'time', 'time in oslo');
t('time in helsinki', 'time', 'time in helsinki');
t('time in warsaw', 'time', 'time in warsaw');
t('time in prague', 'time', 'time in prague');
t('time in jakarta', 'time', 'time in jakarta');
t('time in manila', 'time', 'time in manila');
t('time in kuala lumpur', 'time', 'time in kuala lumpur');
t('time in delhi', 'time', 'time in delhi');
t('time in kolkata', 'time', 'time in kolkata');
t('time in bangalore', 'time', 'time in bangalore');
t('time in chennai', 'time', 'time in chennai');
t('time in hyderabad', 'time', 'time in hyderabad');
t('time in auckland', 'time', 'time in auckland');
t('time in melbourne', 'time', 'time in melbourne');
t('time in sao paulo', 'time', 'time in sao paulo');
t('time in buenos aires', 'time', 'time in buenos aires');
t('time in lagos', 'time', 'time in lagos');
t('time in nairobi', 'time', 'time in nairobi');
t('time in johannesburg', 'time', 'time in johannesburg');
t('time in riyadh', 'time', 'time in riyadh');
t('time in tehran', 'time', 'time in tehran');
t('time in kathmandu', 'time', 'time in kathmandu');

// ═══════════════════════════════════════════════
// 31. TIME ZONES - Country names
// ═══════════════════════════════════════════════
t('time in india', 'time', 'time in india');
t('time in germany', 'time', 'time in germany');
t('time in japan', 'time', 'time in japan');
t('time in australia', 'time', 'time in australia');
t('time in uk', 'time', 'time in uk');
t('time in usa', 'time', 'time in usa');
t('time in china', 'time', 'time in china');
t('time in brazil', 'time', 'time in brazil');
t('time in canada', 'time', 'time in canada');
t('time in france', 'time', 'time in france');
t('time in italy', 'time', 'time in italy');
t('time in spain', 'time', 'time in spain');
t('time in russia', 'time', 'time in russia');
t('time in south korea', 'time', 'time in south korea');
t('time in mexico', 'time', 'time in mexico');
t('time in indonesia', 'time', 'time in indonesia');
t('time in thailand', 'time', 'time in thailand');
t('time in malaysia', 'time', 'time in malaysia');
t('time in philippines', 'time', 'time in philippines');
t('time in new zealand', 'time', 'time in new zealand');
t('time in south africa', 'time', 'time in south africa');
t('time in egypt', 'time', 'time in egypt');
t('time in turkey', 'time', 'time in turkey');
t('time in saudi arabia', 'time', 'time in saudi arabia');
t('time in nepal', 'time', 'time in nepal');
t('time in pakistan', 'time', 'time in pakistan');
t('time in bangladesh', 'time', 'time in bangladesh');
t('time in sri lanka', 'time', 'time in sri lanka');
t('time in nigeria', 'time', 'time in nigeria');
t('time in kenya', 'time', 'time in kenya');
t('time in argentina', 'time', 'time in argentina');
t('time in colombia', 'time', 'time in colombia');
t('time in peru', 'time', 'time in peru');
t('time in chile', 'time', 'time in chile');
t('time in ireland', 'time', 'time in ireland');
t('time in portugal', 'time', 'time in portugal');
t('time in switzerland', 'time', 'time in switzerland');
t('time in sweden', 'time', 'time in sweden');
t('time in norway', 'time', 'time in norway');
t('time in finland', 'time', 'time in finland');
t('time in poland', 'time', 'time in poland');
t('time in ukraine', 'time', 'time in ukraine');
t('time in greece', 'time', 'time in greece');
t('time in vietnam', 'time', 'time in vietnam');
t('time in taiwan', 'time', 'time in taiwan');
t('time in uae', 'time', 'time in uae');
t('time in iran', 'time', 'time in iran');
t('time in iraq', 'time', 'time in iraq');
t('time in israel', 'time', 'time in israel');

// ═══════════════════════════════════════════════
// 32. TIME ZONES - Abbreviations
// ═══════════════════════════════════════════════
t('time in pst', 'time', 'time in PST');
t('time in est', 'time', 'time in EST');
t('time in cst', 'time', 'time in CST');
t('time in mst', 'time', 'time in MST');
t('time in ist', 'time', 'time in IST');
t('time in gmt', 'time', 'time in GMT');
t('time in utc', 'time', 'time in UTC');
t('time in jst', 'time', 'time in JST');
t('time in kst', 'time', 'time in KST');
t('time in cet', 'time', 'time in CET');
t('time in eet', 'time', 'time in EET');
t('time in aest', 'time', 'time in AEST');
t('time in hkt', 'time', 'time in HKT');
t('time in sgt', 'time', 'time in SGT');
t('time in bst', 'time', 'time in BST');
t('time in pdt', 'time', 'time in PDT');
t('time in edt', 'time', 'time in EDT');
t('time in cdt', 'time', 'time in CDT');
t('time in mdt', 'time', 'time in MDT');

// ═══════════════════════════════════════════════
// 33. TIME ZONES - Conversions
// ═══════════════════════════════════════════════
t('india to us time', 'time', 'india to us time');
t('utc to ist', 'time', 'utc to ist');
t('pst to est', 'time', 'pst to est');
t('ist to pst', 'time', 'ist to pst');
t('ist to madison time', 'time', 'ist to madison time');
t('12:30 ist to madison', 'time', 'specific time IST to madison');
t('3:00 pm est to pst', 'time', 'specific time EST to PST');
t('9:00 am pst to ist', 'time', 'morning PST to IST');
t('midnight utc to ist', 'time', 'midnight UTC to IST');
t('noon est to pst', 'time', 'noon EST to PST');
t('tokyo to new york time', 'time', 'city to city time');
t('london to tokyo time', 'time', 'london to tokyo');
t('est to jst', 'time', 'east coast to japan');
t('gmt to ist', 'time', 'gmt to india');
t('cet to pst', 'time', 'central europe to pacific');
t('india to japan time', 'time', 'country to country time');
t('us to india time', 'time', 'us to india');
t('uk to india time', 'time', 'uk to india');
t('australia to india time', 'time', 'australia to india');
t('5:30 pm ist to est', 'time', '5:30 pm IST to EST');
t('10:00 jst to cet', 'time', '10am Japan to Central Europe');
t('14:00 utc to pst', 'time', '2pm UTC to PST');
t('23:59 ist to utc', 'time', 'late night IST to UTC');
t('00:00 utc to ist', 'time', 'midnight UTC to IST');

// ═══════════════════════════════════════════════
// 34. TIME ZONES - Natural Language Variations
// ═══════════════════════════════════════════════
t('what time is it in tokyo', 'time', 'natural: what time in tokyo');
t('current time in london', 'time', 'natural: current time in london');
t('whats the time in paris', 'time', 'natural: whats the time');
t('what is the time in berlin', 'time', 'natural: what is the time');
t('time now in singapore', 'time', 'natural: time now in');
t('now in tokyo', 'time', 'natural: now in city');
t('tokyo time', 'time', 'natural: city time');
t('new york time', 'time', 'natural: new york time');
t('india time', 'time', 'natural: country time');
t('london time', 'time', 'natural: london time');
t('ist time', 'time', 'natural: abbrev time');
t('pst time', 'time', 'natural: pst time');

// ═══════════════════════════════════════════════
// 35. DATES - Relative
// ═══════════════════════════════════════════════
t('today', 'date', 'today');
t('tomorrow', 'date', 'tomorrow');
t('yesterday', 'date', 'yesterday');
t('day after tomorrow', 'date', 'day after tomorrow');
t('day before yesterday', 'date', 'day before yesterday');

// ═══════════════════════════════════════════════
// 36. DATES - Named Days
// ═══════════════════════════════════════════════
t('next monday', 'date', 'next monday');
t('next tuesday', 'date', 'next tuesday');
t('next wednesday', 'date', 'next wednesday');
t('next thursday', 'date', 'next thursday');
t('next friday', 'date', 'next friday');
t('next saturday', 'date', 'next saturday');
t('next sunday', 'date', 'next sunday');
t('last monday', 'date', 'last monday');
t('last friday', 'date', 'last friday');
t('last sunday', 'date', 'last sunday');
t('this monday', 'date', 'this monday');
t('this wednesday', 'date', 'this wednesday');
t('this friday', 'date', 'this friday');

// ═══════════════════════════════════════════════
// 37. DATES - Offsets
// ═══════════════════════════════════════════════
t('3 days from now', 'date', '3 days from now');
t('1 day from now', 'date', '1 day from now');
t('7 days from now', 'date', '7 days from now');
t('30 days from now', 'date', '30 days from now');
t('2 weeks from now', 'date', '2 weeks from now');
t('1 week from now', 'date', '1 week from now');
t('2 weeks ago', 'date', '2 weeks ago');
t('1 week ago', 'date', '1 week ago');
t('3 days ago', 'date', '3 days ago');
t('1 day ago', 'date', '1 day ago');
t('in 5 months', 'date', 'in 5 months');
t('in 1 month', 'date', 'in 1 month');
t('in 2 weeks', 'date', 'in 2 weeks');
t('in 3 days', 'date', 'in 3 days');
t('in 1 year', 'date', 'in 1 year');
t('in 6 months', 'date', 'in 6 months');
t('1 month ago', 'date', '1 month ago');
t('6 months ago', 'date', '6 months ago');
t('1 year ago', 'date', '1 year ago');
t('2 years ago', 'date', '2 years ago');
t('5 hours from now', 'date', '5 hours from now');
t('10 minutes from now', 'date', '10 minutes from now');
t('1 hour ago', 'date', '1 hour ago');
t('30 minutes ago', 'date', '30 minutes ago');

// ═══════════════════════════════════════════════
// 38. DATES - Unix Timestamps
// ═══════════════════════════════════════════════
t('1741000000', 'date', 'unix timestamp 2025');
t('0', 'date', 'unix epoch');
t('1000000000', 'date', 'unix 1 billion');
t('1700000000', 'date', 'unix 2023 approx');
t('1609459200', 'date', 'unix 2021-01-01');
t('2000000000', 'date', 'unix 2033 approx');

// ═══════════════════════════════════════════════
// 39. DATES - ISO Parsing
// ═══════════════════════════════════════════════
t('2025-03-03', 'date', 'ISO date');
t('2025-01-01', 'date', 'ISO date new year');
t('2025-12-31', 'date', 'ISO date new years eve');
t('2024-02-29', 'date', 'ISO date leap day');
t('2000-01-01', 'date', 'ISO date Y2K');

// ═══════════════════════════════════════════════
// 40. DATES - To Unix / Timestamp
// ═══════════════════════════════════════════════
t('now to unix', 'date', 'now to unix timestamp');
t('today to timestamp', 'date', 'today to timestamp');
t('today to unix', 'date', 'today to unix');
t('tomorrow to unix', 'date', 'tomorrow to unix');

// ═══════════════════════════════════════════════
// 41. DATES - Date Diff
// ═══════════════════════════════════════════════
t('from 2025-01-01 to 2025-12-31', 'date', 'date diff full year');
t('from 2025-01-01 to 2025-03-01', 'date', 'date diff 2 months');
t('from 2020-01-01 to 2025-01-01', 'date', 'date diff 5 years');
t('from 2025-03-01 to 2025-03-15', 'date', 'date diff 2 weeks');

// ═══════════════════════════════════════════════
// 42. DATES - Natural Language Variations
// ═══════════════════════════════════════════════
t('whats today', 'date', 'natural: whats today');
t("what's today's date", 'date', "natural: what's today's date");
t('what day is it', 'date', 'natural: what day is it');
t('what date is tomorrow', 'date', 'natural: what date is tomorrow');
t('what is the date today', 'date', 'natural: what is the date today');
t('todays date', 'date', 'natural: todays date');
t('date today', 'date', 'natural: date today');
t('current date', 'date', 'natural: current date');
t('what day is next monday', 'date', 'natural: what day is next monday');
t('when is next friday', 'date', 'natural: when is next friday');

// ═══════════════════════════════════════════════
// 43. CURRENCY - Major Pairs
// ═══════════════════════════════════════════════
t('usd to inr', 'currency', 'USD to INR rate');
t('100 usd to inr', 'currency', '100 USD to INR');
t('1 usd to inr', 'currency', '1 USD to INR');
t('50 usd to inr', 'currency', '50 USD to INR');
t('1000 usd to inr', 'currency', '1000 USD to INR');
t('usd to eur', 'currency', 'USD to EUR');
t('100 usd to eur', 'currency', '100 USD to EUR');
t('usd to gbp', 'currency', 'USD to GBP');
t('100 usd to gbp', 'currency', '100 USD to GBP');
t('500 jpy to usd', 'currency', '500 JPY to USD');
t('1000 jpy to usd', 'currency', '1000 JPY to USD');
t('eur to usd', 'currency', 'EUR to USD');
t('100 eur to usd', 'currency', '100 EUR to USD');
t('gbp to usd', 'currency', 'GBP to USD');
t('100 gbp to usd', 'currency', '100 GBP to USD');
t('eur to gbp', 'currency', 'EUR to GBP');
t('gbp to eur', 'currency', 'GBP to EUR');
t('inr to usd', 'currency', 'INR to USD');
t('1000 inr to usd', 'currency', '1000 INR to USD');
t('10000 inr to usd', 'currency', '10000 INR to USD');
t('cny to usd', 'currency', 'CNY to USD');
t('100 cny to usd', 'currency', '100 CNY to USD');
t('aud to usd', 'currency', 'AUD to USD');
t('cad to usd', 'currency', 'CAD to USD');
t('chf to usd', 'currency', 'CHF to USD');
t('krw to usd', 'currency', 'KRW to USD');
t('sgd to usd', 'currency', 'SGD to USD');
t('hkd to usd', 'currency', 'HKD to USD');
t('nzd to usd', 'currency', 'NZD to USD');
t('sek to usd', 'currency', 'SEK to USD');
t('nok to usd', 'currency', 'NOK to USD');
t('dkk to usd', 'currency', 'DKK to USD');
t('mxn to usd', 'currency', 'MXN to USD');
t('brl to usd', 'currency', 'BRL to USD');
t('thb to usd', 'currency', 'THB to USD');
t('php to usd', 'currency', 'PHP to USD');
t('idr to usd', 'currency', 'IDR to USD');
t('myr to usd', 'currency', 'MYR to USD');
t('zar to usd', 'currency', 'ZAR to USD');
t('aed to usd', 'currency', 'AED to USD');
t('sar to usd', 'currency', 'SAR to USD');
t('try to usd', 'currency', 'TRY to USD');
t('pln to usd', 'currency', 'PLN to USD');
t('czk to usd', 'currency', 'CZK to USD');
t('rub to usd', 'currency', 'RUB to USD');

// ═══════════════════════════════════════════════
// 44. CURRENCY - Common Names
// ═══════════════════════════════════════════════
t('dollar to rupee', 'currency', 'natural: dollar to rupee');
t('100 dollars to rupees', 'currency', 'natural: dollars to rupees');
t('dollar to euro', 'currency', 'natural: dollar to euro');
t('100 dollars to euros', 'currency', 'natural: dollars to euros');
t('pound to dollar', 'currency', 'natural: pound to dollar');
t('100 pounds to dollars', 'currency', 'natural: pounds to dollars');
t('euro to dollar', 'currency', 'natural: euro to dollar');
t('yen to dollar', 'currency', 'natural: yen to dollar');
t('yuan to dollar', 'currency', 'natural: yuan to dollar');
t('rupee to dollar', 'currency', 'natural: rupee to dollar');
t('100 rupees to dollars', 'currency', 'natural: rupees to dollars');
t('dollar to pound', 'currency', 'natural: dollar to pound');
t('dollar to yen', 'currency', 'natural: dollar to yen');
t('euro to pound', 'currency', 'natural: euro to pound');
t('euro to rupee', 'currency', 'natural: euro to rupee');
t('pound to rupee', 'currency', 'natural: pound to rupee');

// ═══════════════════════════════════════════════
// 45. CURRENCY - Various Amounts
// ═══════════════════════════════════════════════
t('0.5 usd to inr', 'currency', 'fractional amount');
t('0.01 usd to inr', 'currency', 'one cent to INR');
t('10000 usd to inr', 'currency', 'large amount');
t('1000000 usd to inr', 'currency', 'million USD to INR');
t('89 usd to inr', 'currency', '89 USD to INR');
t('1.50 usd to eur', 'currency', 'decimal amount');
t('99.99 usd to gbp', 'currency', 'decimal amount GBP');
t('250 eur to jpy', 'currency', 'EUR to JPY');
t('5000 gbp to inr', 'currency', 'GBP to INR');

// ═══════════════════════════════════════════════
// 46. CURRENCY - Natural Language Variations
// ═══════════════════════════════════════════════
t('convert 100 usd to inr', 'currency', 'natural: convert X to Y');
t('how much is 100 usd in inr', 'currency', 'natural: how much is X in Y');
t('100 usd in inr', 'currency', 'natural: X in Y');
t('100 usd in rupees', 'currency', 'natural: X in rupees');
t('whats 50 usd in euros', 'currency', 'natural: whats X in Y');
t('$100 to inr', 'currency', 'natural: $ symbol');
t('$50 to euros', 'currency', 'natural: $ to euros');

// ═══════════════════════════════════════════════
// 47. CRYPTO - Major Coins
// ═══════════════════════════════════════════════
t('btc to usd', 'crypto', 'BTC to USD rate');
t('1 btc to usd', 'crypto', '1 BTC to USD');
t('0.5 btc to usd', 'crypto', '0.5 BTC to USD');
t('0.01 btc to usd', 'crypto', '0.01 BTC to USD');
t('eth to usd', 'crypto', 'ETH to USD rate');
t('1 eth to usd', 'crypto', '1 ETH to USD');
t('1.5 eth to usd', 'crypto', '1.5 ETH to USD');
t('sol to usd', 'crypto', 'SOL to USD');
t('1 sol to usd', 'crypto', '1 SOL to USD');
t('xrp to usd', 'crypto', 'XRP to USD');
t('100 xrp to usd', 'crypto', '100 XRP to USD');
t('doge to usd', 'crypto', 'DOGE to USD');
t('1000 doge to usd', 'crypto', '1000 DOGE to USD');
t('ada to usd', 'crypto', 'ADA to USD');
t('matic to usd', 'crypto', 'MATIC to USD');
t('dot to usd', 'crypto', 'DOT to USD');
t('ltc to usd', 'crypto', 'LTC to USD');
t('avax to usd', 'crypto', 'AVAX to USD');
t('link to usd', 'crypto', 'LINK to USD');
t('uni to usd', 'crypto', 'UNI to USD');
t('atom to usd', 'crypto', 'ATOM to USD');
t('xlm to usd', 'crypto', 'XLM to USD');
t('ton to usd', 'crypto', 'TON to USD');
t('shib to usd', 'crypto', 'SHIB to USD');
t('bnb to usd', 'crypto', 'BNB to USD');
t('usdt to usd', 'crypto', 'USDT to USD');
t('usdc to usd', 'crypto', 'USDC to USD');

// ═══════════════════════════════════════════════
// 48. CRYPTO - USD to Crypto (reverse)
// ═══════════════════════════════════════════════
t('100 usd to btc', 'crypto', '100 USD to BTC');
t('1000 usd to btc', 'crypto', '1000 USD to BTC');
t('100 usd to eth', 'crypto', '100 USD to ETH');
t('50 usd to sol', 'crypto', '50 USD to SOL');
t('100 usd to xrp', 'crypto', '100 USD to XRP');
t('10 usd to doge', 'crypto', '10 USD to DOGE');

// ═══════════════════════════════════════════════
// 49. CRYPTO - To Non-USD Fiat
// ═══════════════════════════════════════════════
t('1 btc to inr', 'crypto', 'BTC to INR');
t('1 eth to inr', 'crypto', 'ETH to INR');
t('1.5 eth to inr', 'crypto', '1.5 ETH to INR');
t('doge to inr', 'crypto', 'DOGE to INR');
t('1 btc to eur', 'crypto', 'BTC to EUR');
t('1 btc to gbp', 'crypto', 'BTC to GBP');
t('1 eth to jpy', 'crypto', 'ETH to JPY');
t('sol to inr', 'crypto', 'SOL to INR');
t('xrp to inr', 'crypto', 'XRP to INR');

// ═══════════════════════════════════════════════
// 50. CRYPTO - Full Names
// ═══════════════════════════════════════════════
t('bitcoin to usd', 'crypto', 'natural: bitcoin to usd');
t('1 bitcoin to usd', 'crypto', 'natural: 1 bitcoin to usd');
t('ethereum to usd', 'crypto', 'natural: ethereum to usd');
t('1 ethereum to usd', 'crypto', 'natural: 1 ethereum to usd');
t('solana to usd', 'crypto', 'natural: solana to usd');
t('dogecoin to usd', 'crypto', 'natural: dogecoin to usd');
t('litecoin to usd', 'crypto', 'natural: litecoin to usd');
t('bitcoin to inr', 'crypto', 'natural: bitcoin to inr');
t('ethereum to inr', 'crypto', 'natural: ethereum to inr');
t('bitcoin to rupee', 'crypto', 'natural: bitcoin to rupee');
t('100 usd to bitcoin', 'crypto', 'natural: usd to bitcoin');
t('ethereum to rupees', 'crypto', 'natural: ethereum to rupees');

// ═══════════════════════════════════════════════
// 51. CRYPTO - Crypto to Crypto
// ═══════════════════════════════════════════════
t('1 btc to eth', 'crypto', 'BTC to ETH');
t('10 eth to btc', 'crypto', 'ETH to BTC');
t('1 btc to sol', 'crypto', 'BTC to SOL');
t('100 sol to eth', 'crypto', 'SOL to ETH');
t('1000 doge to btc', 'crypto', 'DOGE to BTC');

// ═══════════════════════════════════════════════
// 52. MIXED / AMBIGUITY TESTS
// ═══════════════════════════════════════════════
t('1 m to ft', 'unit', 'ambiguous m = meter not minute');
t('1 min to s', 'unit', 'min = minute');
t('100 c to f', 'unit', 'c = celsius shorthand');
t('pi + e', 'math', 'constants in expression');
t('2pi', 'math', 'implicit multiplication with constant');
t('time', null, 'bare word "time"');
t('date', null, 'bare word "date"');
t('now', null, 'bare word "now"');

// ═══════════════════════════════════════════════
// 53. CASING & WHITESPACE VARIATIONS
// ═══════════════════════════════════════════════
t('USD TO INR', 'currency', 'uppercase currency');
t('Usd To Inr', 'currency', 'title case currency');
t('usd  to  inr', 'currency', 'extra spaces');
t(' usd to inr ', 'currency', 'leading/trailing spaces');
t('TIME IN TOKYO', 'time', 'uppercase time query');
t('Time In Tokyo', 'time', 'title case time query');
t('SQRT(144)', 'math', 'uppercase function');
t('Sqrt(144)', 'math', 'title case function');
t('TOMORROW', 'date', 'uppercase date');
t('Tomorrow', 'date', 'title case date');
t('BTC TO USD', 'crypto', 'uppercase crypto');
t('Bitcoin to USD', 'crypto', 'mixed case crypto');
t('3 KM TO M', 'unit', 'uppercase units');

// ═══════════════════════════════════════════════
// 54. UNIT CONVERSION - Edge Cases
// ═══════════════════════════════════════════════
t('0 km to m', 'unit', 'zero value conversion');
t('0 celsius to fahrenheit', 'unit', 'zero celsius to F');
t('-273.15 celsius to kelvin', 'unit', 'absolute zero C to K');
t('1000000 bytes to mb', 'unit', 'bytes to MB');
t('0.001 km to m', 'unit', 'tiny km to m');
t('999999 m to km', 'unit', 'large meters to km');

// ═══════════════════════════════════════════════
// 55. MATH - Human Natural Language
// ═══════════════════════════════════════════════
t('square root of 144', 'math', 'natural: square root of');
t('square root of 6', 'math', 'natural: square root of 6');
t('cube root of 27', 'math', 'natural: cube root of');
t('what is 5 + 3', 'math', 'natural: what is X + Y');
t('whats 10 * 5', 'math', 'natural: whats X * Y');
t('calculate 100 / 4', 'math', 'natural: calculate X / Y');
t('what is the square root of 16', 'math', 'natural: what is the sqrt');
t('2 to the power of 10', 'math', 'natural: X to the power of Y');
t('5 squared', 'math', 'natural: X squared');
t('3 cubed', 'math', 'natural: X cubed');
t('10 percent of 200', 'math', 'natural: X percent of Y');
t('20% of 500', 'math', 'natural: X% of Y');
t('half of 100', 'math', 'natural: half of X');
t('double 50', 'math', 'natural: double X');
t('triple 33', 'math', 'natural: triple X');
t('one third of 99', 'math', 'natural: one third of X');
t('one quarter of 100', 'math', 'natural: one quarter of X');
t('log of 100', 'math', 'natural: log of X');
t('sine of 0', 'math', 'natural: sine of X');
t('cosine of 0', 'math', 'natural: cosine of X');
t('tangent of 0', 'math', 'natural: tangent of X');
t('absolute value of -5', 'math', 'natural: absolute value of');
t('factorial of 5', 'math', 'natural: factorial of');
t('2 plus 3', 'math', 'natural: word operators plus');
t('10 minus 3', 'math', 'natural: word operators minus');
t('6 times 7', 'math', 'natural: word operators times');
t('20 divided by 4', 'math', 'natural: word operators divided by');
t('2 raised to 10', 'math', 'natural: raised to');
t('remainder of 10 divided by 3', 'math', 'natural: remainder');

// ═══════════════════════════════════════════════
// RUN ALL TESTS
// ═══════════════════════════════════════════════

const results = { passed: [], failed: [], errors: [] };
let completed = 0;

console.log(`Running ${tests.length} tests...\n`);

for (const test of tests) {
  completed++;
  const pct = Math.round((completed / tests.length) * 100);
  if (completed % 50 === 0) {
    process.stdout.write(`  Progress: ${completed}/${tests.length} (${pct}%)\n`);
  }

  try {
    const result = await calculate(test.input);
    const passed =
      test.expectedType === null
        ? result.type !== 'error' // null = we just expect it not to error
        : result.type === test.expectedType;

    if (passed) {
      results.passed.push({
        input: test.input,
        description: test.description,
        type: result.type,
        formatted: result.formatted,
      });
    } else {
      results.failed.push({
        input: test.input,
        description: test.description,
        expectedType: test.expectedType,
        actualType: result.type,
        result: result.formatted || result.error || JSON.stringify(result),
      });
    }
  } catch (err) {
    results.errors.push({
      input: test.input,
      description: test.description,
      error: err.message,
    });
  }
}

// ═══════════════════════════════════════════════
// GENERATE REPORT
// ═══════════════════════════════════════════════

const report = [];
report.push('═══════════════════════════════════════════════════════════════');
report.push('  @supercmd/calculator — EXHAUSTIVE TEST REPORT');
report.push('═══════════════════════════════════════════════════════════════');
report.push('');
report.push(`Total tests:    ${tests.length}`);
report.push(`Passed:         ${results.passed.length}`);
report.push(`Failed:         ${results.failed.length}`);
report.push(`Thrown errors:  ${results.errors.length}`);
report.push(`Pass rate:      ${((results.passed.length / tests.length) * 100).toFixed(1)}%`);
report.push('');

if (results.failed.length > 0) {
  report.push('───────────────────────────────────────────────────────────────');
  report.push('  FAILED TESTS (wrong type returned)');
  report.push('───────────────────────────────────────────────────────────────');
  report.push('');

  // Group failures by category
  const categories = {};
  for (const f of results.failed) {
    const cat = f.description.split(':')[0] || 'misc';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(f);
  }

  for (const [cat, items] of Object.entries(categories)) {
    report.push(`  [${cat}]`);
    for (const f of items) {
      report.push(`    Input:    "${f.input}"`);
      report.push(`    Desc:     ${f.description}`);
      report.push(`    Expected: ${f.expectedType}`);
      report.push(`    Actual:   ${f.actualType}`);
      report.push(`    Output:   ${f.result}`);
      report.push('');
    }
  }
}

if (results.errors.length > 0) {
  report.push('───────────────────────────────────────────────────────────────');
  report.push('  THROWN ERRORS (unhandled exceptions)');
  report.push('───────────────────────────────────────────────────────────────');
  report.push('');

  for (const e of results.errors) {
    report.push(`    Input:    "${e.input}"`);
    report.push(`    Desc:     ${e.description}`);
    report.push(`    Error:    ${e.error}`);
    report.push('');
  }
}

report.push('───────────────────────────────────────────────────────────────');
report.push('  ALL PASSED TESTS');
report.push('───────────────────────────────────────────────────────────────');
report.push('');

for (const p of results.passed) {
  report.push(`  ✓ "${p.input}" → [${p.type}] ${p.formatted}`);
}

report.push('');
report.push('═══════════════════════════════════════════════════════════════');
report.push('  END OF REPORT');
report.push('═══════════════════════════════════════════════════════════════');

const reportText = report.join('\n');
console.log(reportText);

// Write report to file
import { writeFileSync } from 'fs';
writeFileSync('test-report.txt', reportText, 'utf-8');
console.log('\nReport saved to test-report.txt');

// Write failures as JSON for AI consumption
const aiReport = {
  summary: {
    total: tests.length,
    passed: results.passed.length,
    failed: results.failed.length,
    errors: results.errors.length,
    passRate: `${((results.passed.length / tests.length) * 100).toFixed(1)}%`,
  },
  failures: results.failed,
  thrownErrors: results.errors,
};
writeFileSync('test-failures.json', JSON.stringify(aiReport, null, 2), 'utf-8');
console.log('Failures JSON saved to test-failures.json');
