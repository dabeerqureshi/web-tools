import assert from "node:assert";
import { exportTransactionsToCsv, SAMPLE_STATEMENT_TRANSACTIONS } from "../bank-statement-parser.ts";

console.log("=== Testing Bank Statement CSV Generator ===");

// 1. Export sample transactions to CSV
const csv = exportTransactionsToCsv(SAMPLE_STATEMENT_TRANSACTIONS);
assert.ok(csv.includes('"Date","Description","Amount","Balance"'));
assert.ok(csv.includes('"10/01/2024","AMAZON.COM*RETAIL WA","-42.50","4,957.50"'));
assert.ok(csv.includes('"10/03/2024","DIRECT DEP PAYROLL ACME CORP","3,250.00","8,207.50"'));

// 2. Verify row count
const lines = csv.split("\r\n");
assert.strictEqual(lines.length, SAMPLE_STATEMENT_TRANSACTIONS.length + 1); // headers + rows
console.log("✔ exportTransactionsToCsv formatted RFC 4180 CSV correctly with", lines.length - 1, "transactions");

console.log("\nAll Bank Statement parser tests passed successfully! 🎉");

