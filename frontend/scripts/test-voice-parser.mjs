// Unit tests for voiceParser
import { parseVoiceShoppingCommand } from '../src/utils/voiceParser.ts';

const testCases = [
  {
    input: "Two fresh milk, 100 rupees",
    expected: {
      name: "Fresh Milk",
      price: 100,
      quantity: 2,
      discount: 0,
      category: "dairy",
    },
  },
  {
    input: "Three apples, 50 rupees each, 10 percent discount",
    expected: {
      name: "Apples",
      price: 50,
      quantity: 3,
      discount: 10,
      category: "produce",
    },
  },
  {
    input: "One Coca Cola, 250 rupees",
    expected: {
      name: "Coca Cola",
      price: 250,
      quantity: 1,
      discount: 0,
      category: "beverage",
    },
  },
  {
    input: "Two chocolate biscuits, 150 rupees, 5 percent discount",
    expected: {
      name: "Chocolate Biscuits",
      price: 150,
      quantity: 2,
      discount: 5,
      category: "snacks",
    },
  },
  {
    input: "Rice, 200 rupees",
    expected: {
      name: "Rice",
      price: 200,
      quantity: 1,
      discount: 0,
      category: "grocery",
    },
  },
  {
    input: "Three apples for 150 rupees total",
    expected: {
      name: "Apples",
      price: 50,
      quantity: 3,
      discount: 0,
      category: "produce",
    },
  },
  {
    input: "Two milk packets, 200 rupees",
    expected: {
      name: "Milk",
      price: 200,
      quantity: 2,
      discount: 0,
      category: "dairy",
    },
  },
  {
    input: "Add three apples at 50 rupees each",
    expected: {
      name: "Apples",
      price: 50,
      quantity: 3,
      discount: 0,
      category: "produce",
    },
  },
  {
    input: "One bread, 120 rupees",
    expected: {
      name: "Bread",
      price: 120,
      quantity: 1,
      discount: 0,
      category: "bakery",
    },
  },
  {
    input: "Five chocolates, 100 rupees each",
    expected: {
      name: "Chocolates",
      price: 100,
      quantity: 5,
      discount: 0,
      category: "snacks",
    },
  },
  {
    input: "Two rice packets, 250 rupees, 10 percent off",
    expected: {
      name: "Rice",
      price: 250,
      quantity: 2,
      discount: 10,
      category: "grocery",
    },
  },
];

let failed = 0;
console.log("Running Voice Parser Tests...\n");

for (const tc of testCases) {
  const result = parseVoiceShoppingCommand(tc.input);
  let ok = true;
  for (const [key, val] of Object.entries(tc.expected)) {
    if (result[key] !== val) {
      ok = false;
      console.error(`FAILED: "${tc.input}"`);
      console.error(`  Field '${key}': Expected ${val}, got ${result[key]}`);
      console.error(`  Full result:`, result);
      failed++;
      break;
    }
  }
  if (ok) {
    console.log(`PASSED: "${tc.input}" -> [${result.quantity}x] ${result.name} @ Rs ${result.price} (Discount: ${result.discount}%, Cat: ${result.category})`);
  }
}

if (failed === 0) {
  console.log(`\nALL ${testCases.length} TESTS PASSED SUCCESSFULLY!`);
  process.exit(0);
} else {
  console.error(`\n${failed} TESTS FAILED.`);
  process.exit(1);
}
