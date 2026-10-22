import assert from "node:assert";
import { yamlToJson, jsonToYaml, formatJson, validateYaml } from "../yaml-parser.ts";

console.log("=== Testing YAML & JSON Parsers ===");

// 1. YAML to JSON
const yamlInput = `
service:
  name: api-service
  port: 8080
  tags:
    - web
    - production
`;
const jsonRes = yamlToJson(yamlInput, 2);
assert.strictEqual(jsonRes.success, true);
const parsedJson = JSON.parse(jsonRes.output);
assert.strictEqual(parsedJson.service.name, "api-service");
assert.strictEqual(parsedJson.service.port, 8080);
assert.deepStrictEqual(parsedJson.service.tags, ["web", "production"]);
console.log("✔ yamlToJson passed");

// 2. YAML syntax error with line/col
const badYaml = `
foo: bar
  bad_indent: 123
`;
const errRes = yamlToJson(badYaml);
assert.strictEqual(errRes.success, false);
assert.ok(errRes.error);
console.log("✔ YAML error detection passed:", errRes.error.split("\n")[0]);

// 3. JSON to YAML
const jsonInput = JSON.stringify({ app: "web", replicas: 3 });
const yamlRes = jsonToYaml(jsonInput, 2);
assert.strictEqual(yamlRes.success, true);
assert.ok(yamlRes.output.includes("app: web"));
assert.ok(yamlRes.output.includes("replicas: 3"));
console.log("✔ jsonToYaml passed");

// 4. JSON Minify & Beautify
const unformattedJson = '{"a": 1,   "b":   [2, 3]}';
const minified = formatJson(unformattedJson, "compact");
assert.strictEqual(minified.success, true);
assert.strictEqual(minified.output, '{"a":1,"b":[2,3]}');
console.log("✔ formatJson minification passed");

// 5. YAML Validator
const validDoc = validateYaml("key: value\nlist:\n  - item1");
assert.strictEqual(validDoc.valid, true);
assert.strictEqual(validDoc.docCount, 1);
console.log("✔ validateYaml passed");

console.log("\nAll YAML/JSON parser tests passed successfully! 🎉");

