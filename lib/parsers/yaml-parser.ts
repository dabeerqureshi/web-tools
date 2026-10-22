import YAML from "yaml";

export interface ParseResult {
  success: boolean;
  output: string;
  error?: string;
  line?: number;
  col?: number;
}

export function yamlToJson(input: string, indent: number | "compact" = 2): ParseResult {
  if (!input.trim()) {
    return { success: true, output: "" };
  }
  try {
    const parsed = YAML.parse(input);
    const space = indent === "compact" ? undefined : indent;
    const output = JSON.stringify(parsed, null, space);
    return { success: true, output };
  } catch (err: any) {
    let line: number | undefined;
    let col: number | undefined;
    if (err.linePos && Array.isArray(err.linePos)) {
      line = err.linePos[0]?.line;
      col = err.linePos[0]?.col;
    }
    return {
      success: false,
      output: "",
      error: err.message || "Invalid YAML syntax",
      line,
      col,
    };
  }
}

export function jsonToYaml(input: string, indent = 2): ParseResult {
  if (!input.trim()) {
    return { success: true, output: "" };
  }
  try {
    const parsed = JSON.parse(input);
    const output = YAML.stringify(parsed, { indent });
    return { success: true, output };
  } catch (err: any) {
    // Extract line/column from JSON error if possible
    let line: number | undefined;
    let col: number | undefined;
    const match = err.message.match(/at position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      const lines = input.slice(0, pos).split("\n");
      line = lines.length;
      col = lines[lines.length - 1].length + 1;
    }
    return {
      success: false,
      output: "",
      error: err.message || "Invalid JSON syntax",
      line,
      col,
    };
  }
}

export function formatJson(input: string, indent: number | "compact" = 2): ParseResult {
  if (!input.trim()) {
    return { success: true, output: "" };
  }
  try {
    const parsed = JSON.parse(input);
    const space = indent === "compact" ? undefined : indent;
    const output = JSON.stringify(parsed, null, space);
    return { success: true, output };
  } catch (err: any) {
    let line: number | undefined;
    let col: number | undefined;
    const match = err.message.match(/at position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      const lines = input.slice(0, pos).split("\n");
      line = lines.length;
      col = lines[lines.length - 1].length + 1;
    }
    return {
      success: false,
      output: "",
      error: err.message || "Invalid JSON syntax",
      line,
      col,
    };
  }
}

export function validateYaml(input: string): { valid: boolean; error?: string; line?: number; col?: number; docCount: number } {
  if (!input.trim()) {
    return { valid: true, docCount: 0 };
  }
  try {
    const docs = YAML.parseAllDocuments(input);
    const errors: string[] = [];
    let firstLine: number | undefined;
    let firstCol: number | undefined;

    for (const doc of docs) {
      if (doc.errors && doc.errors.length > 0) {
        for (const err of doc.errors) {
          errors.push(err.message);
          if (!firstLine && err.linePos) {
            firstLine = err.linePos[0]?.line;
            firstCol = err.linePos[0]?.col;
          }
        }
      }
    }

    if (errors.length > 0) {
      return {
        valid: false,
        error: errors.join("\n"),
        line: firstLine,
        col: firstCol,
        docCount: docs.length,
      };
    }

    return { valid: true, docCount: docs.length };
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || "YAML Validation Failed",
      docCount: 0,
    };
  }
}

export const SAMPLE_PRESETS = {
  k8s: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25.3
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: "500m"
            memory: "128Mi"
`,
  dockerCompose: `version: '3.8'
services:
  web:
    image: node:20-alpine
    working_dir: /app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./:/app
    restart: unless-stopped

  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secret_password
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
`,
  jsonSample: `{
  "name": "developer-toolbox",
  "version": "1.0.0",
  "private": true,
  "description": "High performance developer tools portal",
  "keywords": ["developer", "tools", "converter", "utilities"],
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "yaml": "^2.7.0"
  }
}`,
};

