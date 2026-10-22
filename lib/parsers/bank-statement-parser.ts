export interface StatementTransaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  type?: "debit" | "credit";
  balance?: string;
  rawText: string;
}

export interface BankStatementParseResult {
  pagesCount: number;
  transactions: StatementTransaction[];
  headers: string[];
  rawLines: string[];
  bankHint?: string;
}

// Regex patterns for matching common date formats in bank statements
const DATE_PATTERNS = [
  /^\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/, // 01/15/2024 or 15.01.2024
  /^\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\.\,]+\d{1,2}(?:st|nd|rd|th)?(?:[\s\.\,]+\d{2,4})?)\b/i, // Jan 15, 2024
  /^\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+\d{2,4})?)\b/i, // 15 Jan 2024
];

// Regex for currency amounts: $1,234.56, -123.45, 123.45 CR, 50.00-
const AMOUNT_REGEX = /[-+]?\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))(?:\s*(?:CR|DR|-|\+))?/gi;

export async function parseBankStatementPdf(file: File): Promise<BankStatementParseResult> {
  // Dynamically import pdfjs-dist in the browser
  const pdfjsLib = await import("pdfjs-dist");

  // Set worker source to CDN to avoid local webpack worker bundle configuration issues
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const rawLines: string[] = [];
  const transactions: StatementTransaction[] = [];
  let bankHint: string | undefined;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Group text items by Y position (line)
    const itemsByY = new Map<number, Array<{ x: number; text: string }>>();
    const Y_TOLERANCE = 3.5;

    for (const item of textContent.items as any[]) {
      if (!item.str || item.str.trim() === "") continue;
      const x = item.transform[4];
      const y = Math.round(item.transform[5]);

      // Check for prominent bank names on first page
      if (pageNum === 1 && !bankHint) {
        const lower = item.str.toLowerCase();
        if (lower.includes("chase")) bankHint = "JPMorgan Chase";
        else if (lower.includes("bank of america")) bankHint = "Bank of America";
        else if (lower.includes("wells fargo")) bankHint = "Wells Fargo";
        else if (lower.includes("citibank") || lower.includes("citi")) bankHint = "Citibank";
        else if (lower.includes("barclays")) bankHint = "Barclays";
        else if (lower.includes("revolut")) bankHint = "Revolut";
      }

      // Find if an existing line is within tolerance
      let matchedY: number | null = null;
      for (const existingY of itemsByY.keys()) {
        if (Math.abs(existingY - y) <= Y_TOLERANCE) {
          matchedY = existingY;
          break;
        }
      }

      if (matchedY !== null) {
        itemsByY.get(matchedY)!.push({ x, text: item.str });
      } else {
        itemsByY.set(y, [{ x, text: item.str }]);
      }
    }

    // Sort lines by Y descending (PDF coordinates origin is bottom-left)
    const sortedY = Array.from(itemsByY.keys()).sort((a, b) => b - a);

    for (const y of sortedY) {
      const lineItems = itemsByY.get(y)!;
      // Sort items within line by X ascending (left to right)
      lineItems.sort((a, b) => a.x - b.x);

      const lineText = lineItems.map((i) => i.text.trim()).filter(Boolean).join(" ");
      if (lineText.length < 3) continue;

      rawLines.push(lineText);

      // Attempt transaction heuristic extraction
      const tx = extractTransactionFromLine(lineText);
      if (tx) {
        transactions.push({
          ...tx,
          id: `tx-${transactions.length + 1}`,
        });
      }
    }
  }

  return {
    pagesCount: pdf.numPages,
    transactions,
    headers: ["Date", "Description", "Amount", "Balance"],
    rawLines,
    bankHint,
  };
}

function extractTransactionFromLine(line: string): Omit<StatementTransaction, "id"> | null {
  const trimmed = line.trim();

  // 1. Check if line begins with a date
  let matchedDate: string | null = null;
  let remainingAfterDate = trimmed;

  for (const pattern of DATE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      matchedDate = match[1];
      remainingAfterDate = trimmed.slice(match[0].length).trim();
      break;
    }
  }

  if (!matchedDate) return null;

  // 2. Look for amounts in the line
  const amountMatches = Array.from(remainingAfterDate.matchAll(AMOUNT_REGEX));
  if (amountMatches.length === 0) return null;

  // If there are multiple amounts, usually the last is Balance and second-to-last is Amount
  let amountStr = "";
  let balanceStr = "";

  if (amountMatches.length === 1) {
    amountStr = amountMatches[0][0];
  } else if (amountMatches.length >= 2) {
    amountStr = amountMatches[amountMatches.length - 2][0];
    balanceStr = amountMatches[amountMatches.length - 1][0];
  }

  // 3. Extract description between date and first amount
  const firstAmountIdx = remainingAfterDate.indexOf(amountMatches[0][0]);
  let description = firstAmountIdx > 0 ? remainingAfterDate.slice(0, firstAmountIdx).trim() : remainingAfterDate;

  // Clean description
  description = description.replace(/^[\s\-\:\.\,]+/, "").replace(/[\s\-\:\.\,]+$/, "");
  if (!description) {
    description = "Transaction";
  }

  // Determine debit vs credit
  const isNegative = amountStr.includes("-") || amountStr.toUpperCase().includes("DR");

  return {
    date: matchedDate,
    description,
    amount: amountStr.replace(/[^0-9\.\,\-]/g, ""),
    type: isNegative ? "debit" : "credit",
    balance: balanceStr ? balanceStr.replace(/[^0-9\.\,\-]/g, "") : undefined,
    rawText: line,
  };
}

export function exportTransactionsToCsv(
  transactions: StatementTransaction[],
  headers = ["Date", "Description", "Amount", "Balance"]
): string {
  const escapeCsv = (val: string) => {
    const clean = (val || "").toString().replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = [headers.map(escapeCsv).join(",")];

  for (const tx of transactions) {
    const row = [
      escapeCsv(tx.date),
      escapeCsv(tx.description),
      escapeCsv(tx.amount),
      escapeCsv(tx.balance || ""),
    ];
    rows.push(row.join(","));
  }

  return rows.join("\r\n");
}

export const SAMPLE_STATEMENT_TRANSACTIONS: StatementTransaction[] = [
  { id: "1", date: "10/01/2024", description: "AMAZON.COM*RETAIL WA", amount: "-42.50", type: "debit", balance: "4,957.50", rawText: "10/01/2024 AMAZON.COM*RETAIL WA -$42.50 $4,957.50" },
  { id: "2", date: "10/03/2024", description: "DIRECT DEP PAYROLL ACME CORP", amount: "3,250.00", type: "credit", balance: "8,207.50", rawText: "10/03/2024 DIRECT DEP PAYROLL ACME CORP $3,250.00 $8,207.50" },
  { id: "3", date: "10/05/2024", description: "WHOLE FOODS MARKET #104", amount: "-88.19", type: "debit", balance: "8,119.31", rawText: "10/05/2024 WHOLE FOODS MARKET #104 -$88.19 $8,119.31" },
  { id: "4", date: "10/08/2024", description: "STARBUCKS STORE #0482 Seattle", amount: "-6.45", type: "debit", balance: "8,112.86", rawText: "10/08/2024 STARBUCKS STORE #0482 Seattle -$6.45 $8,112.86" },
  { id: "5", date: "10/12/2024", description: "VERIZON WIRELESS PAYMENT", amount: "-115.00", type: "debit", balance: "7,997.86", rawText: "10/12/2024 VERIZON WIRELESS PAYMENT -$115.00 $7,997.86" },
  { id: "6", date: "10/15/2024", description: "DIVIDEND PAYMENT VANGUARD", amount: "78.20", type: "credit", balance: "8,076.06", rawText: "10/15/2024 DIVIDEND PAYMENT VANGUARD $78.20 $8,076.06" },
  { id: "7", date: "10/20/2024", description: "UTILITY ELECTRIC CO AUTO-PAY", amount: "-142.30", type: "debit", balance: "7,933.76", rawText: "10/20/2024 UTILITY ELECTRIC CO AUTO-PAY -$142.30 $7,933.76" },
];

