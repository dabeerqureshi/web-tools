"use client";

import React, { useState, useId } from "react";
import {
  parseBankStatementPdf,
  exportTransactionsToCsv,
  StatementTransaction,
  SAMPLE_STATEMENT_TRANSACTIONS,
} from "@/lib/parsers/bank-statement-parser";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import {
  Upload,
  Download,
  FileSpreadsheet,
  Copy,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  Plus,
} from "lucide-react";

export function BankStatementTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<StatementTransaction[]>([]);
  const [pagesCount, setPagesCount] = useState<number>(0);
  const [bankHint, setBankHint] = useState<string | undefined>();
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputId = useId();

  const handleFileChange = async (selectedFile?: File) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF document (.pdf).");
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);
    setError(null);
    setTransactions([]);

    try {
      const result = await parseBankStatementPdf(selectedFile);
      setPagesCount(result.pagesCount);
      setBankHint(result.bankHint);
      setTransactions(result.transactions);

      if (result.transactions.length === 0) {
        setError(
          "No tabular transactions detected. This statement might be a scanned image (requires OCR) or use an unsupported multi-column table format."
        );
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Failed to parse PDF statement. Ensure the document is not password-protected and contains digital text."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setFile(new File(["sample"], "sample_bank_statement.pdf", { type: "application/pdf" }));
    setPagesCount(2);
    setBankHint("JPMorgan Chase (Sample)");
    setTransactions(SAMPLE_STATEMENT_TRANSACTIONS);
    setError(null);
  };

  const handleExportCsv = () => {
    if (transactions.length === 0) return;
    const csv = exportTransactionsToCsv(transactions);
    const baseName = file ? file.name.replace(/\.[^/.]+$/, "") : "statement";
    downloadFile(csv, `${baseName}-transactions.csv`, "text/csv;charset=utf-8;");
  };

  const handleExportJson = () => {
    if (transactions.length === 0) return;
    const json = JSON.stringify(transactions, null, 2);
    const baseName = file ? file.name.replace(/\.[^/.]+$/, "") : "statement";
    downloadFile(json, `${baseName}-transactions.json`, "application/json");
  };

  const handleCopyCsv = async () => {
    if (transactions.length === 0) return;
    const csv = exportTransactionsToCsv(transactions);
    const ok = await copyToClipboard(csv);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteRow = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof StatementTransaction, val: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Zone */}
      {transactions.length === 0 && !isLoading && (
        <div className="rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 sm:p-12 text-center transition-all hover:border-indigo-500">
          <input
            id={fileInputId}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
            Upload Your Bank Statement PDF
          </h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
            Extracts Date, Description, Amount, and Balance into a clean Excel-ready CSV.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <label
              htmlFor={fileInputId}
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Select Statement PDF</span>
            </label>

            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Try with Sample PDF</span>
            </button>
          </div>

          {/* Privacy Trust Banner */}
          <div className="mt-8 max-w-lg mx-auto rounded-xl p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-left">
              <strong>100% Client-Side Privacy:</strong> Your statement is parsed in your browser memory. Account numbers and balances are NEVER uploaded to any server.
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h4 className="font-semibold text-zinc-900 dark:text-white">Parsing PDF Statements &amp; Tables...</h4>
          <p className="text-xs text-zinc-500">Detecting dates, descriptions, balances, and transaction amounts locally.</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-950/60 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Transactions Grid View */}
      {transactions.length > 0 && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                <span>{file?.name || "statement.pdf"}</span>
                {bankHint && (
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {bankHint}
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {transactions.length} transactions extracted &bull; {pagesCount} pages processed
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy CSV"}</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV (Excel)</span>
              </button>

              <button
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
              >
                <span>JSON</span>
              </button>

              <button
                onClick={() => {
                  setTransactions([]);
                  setFile(null);
                }}
                className="px-3 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Upload Another
              </button>
            </div>
          </div>

          {/* Interactive Table Grid */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase font-bold tracking-wider text-zinc-500 z-10">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">#</th>
                    <th className="px-4 py-3 w-32">Date</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 w-32 text-right">Amount</th>
                    <th className="px-4 py-3 w-32 text-right">Balance</th>
                    <th className="px-4 py-3 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {transactions.map((tx, idx) => (
                    <tr key={tx.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50">
                      <td className="px-4 py-2.5 text-center text-zinc-400 font-mono text-[10px]">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="text"
                          value={tx.date}
                          onChange={(e) => handleUpdateRow(tx.id, "date", e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-indigo-500 focus:outline-hidden py-0.5"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="text"
                          value={tx.description}
                          onChange={(e) => handleUpdateRow(tx.id, "description", e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-indigo-500 focus:outline-hidden py-0.5"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-medium">
                        <input
                          type="text"
                          value={tx.amount}
                          onChange={(e) => handleUpdateRow(tx.id, "amount", e.target.value)}
                          className={`w-full bg-transparent text-right border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-indigo-500 focus:outline-hidden py-0.5 ${
                            tx.type === "debit"
                              ? "text-red-600 dark:text-red-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-zinc-500">
                        <input
                          type="text"
                          value={tx.balance || ""}
                          placeholder="—"
                          onChange={(e) => handleUpdateRow(tx.id, "balance", e.target.value)}
                          className="w-full bg-transparent text-right border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-indigo-500 focus:outline-hidden py-0.5 text-zinc-600 dark:text-zinc-400"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => handleDeleteRow(tx.id)}
                          className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-500">
              <span>Tip: Click any cell to edit dates, descriptions or amounts before export.</span>
              <button
                onClick={handleExportCsv}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Export {transactions.length} rows to CSV &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

