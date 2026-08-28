// lib/fuzzySearch.ts
// -----------------------------------------------------------------------
// Fuzzy search: weighted subsequence matching (mirip algoritma yang dipakai
// VS Code Command Palette / Sublime Text Goto Anything).
//
// Query dianggap "match" kalau seluruh karakternya bisa ditemukan sebagai
// subsequence di target (nggak harus berurutan rapat), lalu dicari
// alignment dengan skor TERTINGGI pakai dynamic programming, dengan bonus:
//   - match di awal kata / setelah separator (word boundary)
//   - match tepat di karakter pertama string
//   - match yang berurutan (consecutive characters)
//
// Kompleksitas: O(len(query) * len(target)) waktu & memori.
// -----------------------------------------------------------------------

export interface FuzzyMatchResult {
  /** Semakin tinggi = semakin relevan */
  score: number;
  /** Index karakter di `target` yang match dengan query, untuk highlighting */
  matches: number[];
}

const SCORE_MATCH = 16;
const SCORE_WORD_BOUNDARY = 10;
const SCORE_FIRST_CHAR = 12;
const SCORE_CONSECUTIVE = 8;

function isWordBoundary(target: string, index: number): boolean {
  if (index === 0) return true;
  const prev = target[index - 1];
  const curr = target[index];
  if (/[\s\-_/.,]/.test(prev)) return true;
  if (/[a-z]/.test(prev) && /[A-Z]/.test(curr)) return true; // camelCase
  return false;
}

type Parent = "match" | "skip" | null;

/**
 * Mencocokkan `query` sebagai fuzzy subsequence dari `target`.
 * Return `null` kalau query BUKAN subsequence dari target sama sekali.
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatchResult | null {
  const q = query.trim().toLowerCase();
  const t = target.toLowerCase();

  if (q.length === 0) return { score: 0, matches: [] };
  if (q.length > t.length) return null;

  const qLen = q.length;
  const tLen = t.length;
  const NEG_INF = -Infinity;

  // dp[i][j] = skor terbaik mencocokkan q[0..i) di dalam t[0..j)
  const dp: number[][] = Array.from({ length: qLen + 1 }, () =>
    new Array(tLen + 1).fill(NEG_INF)
  );
  const parent: Parent[][] = Array.from({ length: qLen + 1 }, () =>
    new Array(tLen + 1).fill(null)
  );

  for (let j = 0; j <= tLen; j++) dp[0][j] = 0;

  for (let i = 1; i <= qLen; i++) {
    for (let j = i; j <= tLen; j++) {
      let best = NEG_INF;
      let choice: Parent = null;

      // Opsi 1: lewati karakter target[j-1] (tidak dipakai untuk match)
      if (dp[i][j - 1] > best) {
        best = dp[i][j - 1];
        choice = "skip";
      }

      // Opsi 2: cocokkan q[i-1] dengan t[j-1]
      if (q[i - 1] === t[j - 1] && dp[i - 1][j - 1] !== NEG_INF) {
        let gained = SCORE_MATCH;
        if (isWordBoundary(t, j - 1)) gained += SCORE_WORD_BOUNDARY;
        if (j - 1 === 0) gained += SCORE_FIRST_CHAR;
        // bonus konsekutif: apakah q[i-2] match tepat di t[j-2]?
        if (parent[i - 1][j - 1] === "match") gained += SCORE_CONSECUTIVE;

        const candidate = dp[i - 1][j - 1] + gained;
        if (candidate > best) {
          best = candidate;
          choice = "match";
        }
      }

      dp[i][j] = best;
      parent[i][j] = choice;
    }
  }

  const finalScore = dp[qLen][tLen];
  if (finalScore === NEG_INF) return null; // query bukan subsequence dari target

  // Backtrace untuk dapetin index karakter yang match (buat highlight)
  const matches: number[] = [];
  let i = qLen;
  let j = tLen;
  while (i > 0 && j > 0) {
    if (parent[i][j] === "match") {
      matches.push(j - 1);
      i -= 1;
      j -= 1;
    } else {
      j -= 1;
    }
  }
  matches.reverse();

  return { score: finalScore, matches };
}

// -----------------------------------------------------------------------
// Multi-field fuzzy search untuk list of items (dipakai Navbar, nanti bisa
// dipakai lagi untuk search Projects/Achievements dsb).
// -----------------------------------------------------------------------

export interface SearchableItem {
  /** Teks utama yang ditampilkan & di-highlight */
  title: string;
  /** Alias/sinonim yang ikut dicari tapi tidak ditampilkan (EN/ID, dsb) */
  keywords?: string[];
}

export interface SearchResult<T> {
  item: T;
  score: number;
  /** Index karakter di `title` yang match, untuk highlighting */
  titleMatches: number[];
}

/**
 * Fuzzy search di beberapa field sekaligus. Skor akhir tiap item = skor
 * TERBAIK dari semua field (title + keywords), tapi highlight cuma
 * dihitung dari field `title` karena itu yang ditampilkan ke user.
 */
export function fuzzySearchList<T extends SearchableItem>(
  items: T[],
  query: string
): SearchResult<T>[] {
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return items.map((item) => ({ item, score: 0, titleMatches: [] }));
  }

  const results: SearchResult<T>[] = [];

  for (const item of items) {
    const titleResult = fuzzyMatch(trimmed, item.title);
    let bestScore = titleResult ? titleResult.score : -Infinity;

    for (const keyword of item.keywords ?? []) {
      const keywordResult = fuzzyMatch(trimmed, keyword);
      if (keywordResult && keywordResult.score > bestScore) {
        bestScore = keywordResult.score;
      }
    }

    if (bestScore === -Infinity) continue; // tidak match di field manapun

    results.push({
      item,
      score: bestScore,
      titleMatches: titleResult?.matches ?? [],
    });
  }

  // Urutkan dari yang paling relevan
  results.sort((a, b) => b.score - a.score);

  return results;
}