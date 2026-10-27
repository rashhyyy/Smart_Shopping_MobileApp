/**
 * Voice Parser for Smart Shopping Mobile App
 * Converts natural spoken shopping commands into structured item properties:
 * - Product Name
 * - Unit Price (Rs)
 * - Quantity
 * - Discount (%)
 * - Category
 */

export interface ParsedVoiceItem {
  name: string;
  price: number | null;
  quantity: number;
  discount: number;
  category: string | null;
  rawText: string;
  isTotalCalculated?: boolean;
}

// Map spoken number words to numbers
const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
};

/**
 * Converts spoken number phrases in a string to digits.
 * E.g., "one hundred fifty" -> "150", "three" -> "3", "two" -> "2"
 */
export function convertWordNumbersToDigits(text: string): string {
  const words = text.toLowerCase().split(/\s+/);
  const result: string[] = [];
  let i = 0;

  while (i < words.length) {
    const word = words[i].replace(/[^a-z]/g, '');

    if (NUMBER_WORDS[word] !== undefined) {
      // Look ahead to accumulate compound numbers like "one hundred fifty" or "twenty five"
      let currentVal = 0;
      let temp = 0;
      let consumed = 0;

      while (i + consumed < words.length) {
        const nextWord = words[i + consumed].replace(/[^a-z]/g, '');
        const val = NUMBER_WORDS[nextWord];

        if (val === undefined) {
          break;
        }

        if (val === 100 || val === 1000) {
          if (temp === 0) temp = 1;
          temp *= val;
          currentVal += temp;
          temp = 0;
        } else if (val >= 20) {
          temp += val;
        } else {
          temp += val;
        }

        consumed++;
      }

      currentVal += temp;
      result.push(currentVal.toString());
      i += consumed;
    } else {
      result.push(words[i]);
      i++;
    }
  }

  return result.join(' ');
}

// Category keyword mappings
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  dairy: [
    'milk', 'fresh milk', 'cheese', 'butter', 'yogurt', 'curd',
    'paneer', 'cream', 'eggs', 'egg', 'dairy'
  ],
  beverage: [
    'coca cola', 'coke', 'pepsi', 'sprite', 'fanta', 'juice',
    'water', 'soda', 'tea', 'coffee', 'drink', 'beverage', 'beer'
  ],
  snacks: [
    'chocolate biscuits', 'biscuit', 'biscuits', 'chips', 'snack',
    'snacks', 'popcorn', 'cookies', 'cookie', 'chocolate', 'chocolates',
    'crackers', 'candy', 'wafers'
  ],
  grocery: [
    'rice', 'flour', 'oil', 'sugar', 'salt', 'wheat', 'dal', 'pulses',
    'grain', 'grains', 'cereal', 'oats', 'spices', 'grocery'
  ],
  produce: [
    'apple', 'apples', 'banana', 'bananas', 'orange', 'oranges',
    'potato', 'potatoes', 'onion', 'onions', 'tomato', 'tomatoes',
    'vegetable', 'vegetables', 'fruit', 'fruits', 'produce', 'carrot',
    'broccoli', 'spinach', 'mango', 'mangoes'
  ],
  bakery: [
    'bread', 'loaf', 'cake', 'bun', 'buns', 'pastry', 'pastries',
    'croissant', 'muffin', 'bakery', 'toast'
  ],
  meat: [
    'chicken', 'beef', 'fish', 'pork', 'mutton', 'lamb', 'meat',
    'seafood', 'prawns', 'shrimp'
  ],
  personal: [
    'soap', 'shampoo', 'toothpaste', 'toothbrush', 'lotion',
    'perfume', 'deodorant', 'personal'
  ],
  household: [
    'detergent', 'cleaner', 'dishwash', 'sponge', 'bleach',
    'tissue', 'tissues', 'household', 'wipe', 'wipes'
  ],
};

const PACKAGING_WORDS = [
  'packet', 'packets', 'pkt', 'pkts', 'pack', 'packs',
  'bottle', 'bottles', 'box', 'boxes', 'can', 'cans',
  'bag', 'bags', 'kg', 'kgs', 'kilogram', 'kilograms',
  'gram', 'grams', 'g', 'liter', 'liters', 'litre', 'litres',
  'l', 'piece', 'pieces', 'pcs', 'item', 'items'
];

/**
 * Parses spoken shopping text into structured shopping item fields.
 */
export function parseVoiceShoppingCommand(spokenText: string): ParsedVoiceItem {
  if (!spokenText || !spokenText.trim()) {
    return {
      name: '',
      price: null,
      quantity: 1,
      discount: 0,
      category: null,
      rawText: spokenText || '',
    };
  }

  // Normalize text: convert word numbers to digits
  let normalized = convertWordNumbersToDigits(spokenText.trim());

  // Replace common punctuation with spaces
  normalized = normalized.replace(/[,;:]+/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. EXTRACT DISCOUNT (%)
  let discount = 0;
  const discountMatch =
    normalized.match(/(\d+(?:\.\d+)?)\s*(?:%|percent(?:age)?)\s*(?:discount|off)?/i) ||
    normalized.match(/(?:discount|off)\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*(?:%|percent)?/i);

  if (discountMatch) {
    discount = parseFloat(discountMatch[1]);
    normalized = normalized.replace(discountMatch[0], ' ');
  }

  // 2. EXTRACT PRICE & TOTAL vs UNIT
  let price: number | null = null;
  let isTotal = false;

  // Patterns for price:
  // e.g. "for 150 rupees total", "150 rupees total", "50 rupees each", "100 rupees", "rs 100", "50 rs"
  const totalRegex = /(?:for\s+)?(\d+(?:\.\d+)?)\s*(?:rupees|rs\.?|lkr|₹)\s*total/i;
  const eachRegex = /(?:at\s+)?(\d+(?:\.\d+)?)\s*(?:rupees|rs\.?|lkr|₹)\s*(?:each|per\s+(?:item|packet|unit|piece|one))?/i;
  const prefixRsRegex = /(?:rs\.?|lkr|₹)\s*(\d+(?:\.\d+)?)/i;
  const standalonePriceRegex = /\b(?:for\s+)(\d+(?:\.\d+)?)\b/i;

  const totalMatch = normalized.match(totalRegex);
  const eachMatch = normalized.match(eachRegex);
  const prefixMatch = normalized.match(prefixRsRegex);
  const standaloneMatch = normalized.match(standalonePriceRegex);

  let priceMatchedText = '';

  if (totalMatch) {
    price = parseFloat(totalMatch[1]);
    isTotal = true;
    priceMatchedText = totalMatch[0];
  } else if (eachMatch) {
    price = parseFloat(eachMatch[1]);
    isTotal = false;
    priceMatchedText = eachMatch[0];
  } else if (prefixMatch) {
    price = parseFloat(prefixMatch[1]);
    isTotal = false;
    priceMatchedText = prefixMatch[0];
  } else if (standaloneMatch) {
    price = parseFloat(standaloneMatch[1]);
    isTotal = false;
    priceMatchedText = standaloneMatch[0];
  }

  if (priceMatchedText) {
    normalized = normalized.replace(priceMatchedText, ' ');
  }

  // 3. EXTRACT QUANTITY
  let quantity = 1;

  // Check for leading quantity pattern: e.g. "^(?:add\s+)?(\d+)\s+" or "(\d+)\s+(?:kg|packets|bottles|boxes)"
  const leadingQtyMatch = normalized.match(/^(?:add\s+)?(\d+)\s+/i);
  const unitQtyMatch = normalized.match(new RegExp(`(\\d+)\\s+(?:${PACKAGING_WORDS.join('|')})`, 'i'));
  const explicitQtyMatch = normalized.match(/(?:qty|quantity)\s*(?:is|of)?\s*(\d+)/i);

  if (explicitQtyMatch) {
    quantity = parseInt(explicitQtyMatch[1], 10);
    normalized = normalized.replace(explicitQtyMatch[0], ' ');
  } else if (leadingQtyMatch) {
    quantity = parseInt(leadingQtyMatch[1], 10);
    normalized = normalized.replace(leadingQtyMatch[0], ' ');
  } else if (unitQtyMatch) {
    quantity = parseInt(unitQtyMatch[1], 10);
    normalized = normalized.replace(unitQtyMatch[0], ' ');
  }

  if (quantity < 1 || isNaN(quantity)) {
    quantity = 1;
  }

  // Adjust unit price if total was specified
  let isTotalCalculated = false;
  if (isTotal && price !== null && quantity > 1) {
    price = Math.round((price / quantity) * 100) / 100;
    isTotalCalculated = true;
  }

  // 4. IDENTIFY CATEGORY
  let category: string | null = null;
  const lowerForCat = spokenText.toLowerCase();

  // Priority 1: Check if an exact category key or label appears in the speech
  for (const [catKey, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(lowerForCat)) {
        category = catKey;
        break;
      }
    }
    if (category) break;
  }

  // 5. EXTRACT & CLEAN PRODUCT NAME
  // Remove "add" from beginning if present
  let cleanName = normalized.replace(/^add\s+/i, '');

  // Remove explicit category words from name if they were appended like "dairy" or "snacks"
  for (const catKey of Object.keys(CATEGORY_KEYWORDS)) {
    const catRegex = new RegExp(`\\b${catKey}\\b`, 'gi');
    cleanName = cleanName.replace(catRegex, ' ');
  }

  // Remove filler words
  const fillers = [
    'rupees', 'rupee', 'rs', 'lkr', '₹', 'percent', 'percentage',
    'discount', 'off', 'each', 'total', 'please', 'for', 'at', 'with', 'and'
  ];
  for (const filler of fillers) {
    cleanName = cleanName.replace(new RegExp(`\\b${filler}\\b`, 'gi'), ' ');
  }

  // Remove packaging words if trailing/hanging
  for (const pack of PACKAGING_WORDS) {
    cleanName = cleanName.replace(new RegExp(`\\b${pack}\\b`, 'gi'), ' ');
  }

  // Remove any remaining standalone numbers from name
  cleanName = cleanName.replace(/\b\d+\b/g, ' ');

  // Clean extra spaces
  cleanName = cleanName.replace(/[^a-zA-Z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

  // Capitalize Title Case
  cleanName = cleanName
    .split(' ')
    .filter((w) => w.length > 0)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .trim();

  return {
    name: cleanName,
    price,
    quantity,
    discount,
    category,
    rawText: spokenText,
    isTotalCalculated,
  };
}
