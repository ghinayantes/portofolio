import { useEffect, useState } from 'react'

/** Types and deletes a list of words in a loop. Shows the first word statically for reduced-motion users. */
export function useTypewriter(words: string[], { type = 85, del = 45, hold = 1500 } = {}) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [reduce, setReduce] = useState(false)
  useEffect(() => { setReduce(matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])

  useEffect(() => {
    if (reduce) return
    const word = words[i % words.length]
    const full = !deleting && n >= word.length
    const empty = deleting && n <= 0
    const id = setTimeout(() => {
      if (full) setDeleting(true)
      else if (empty) { setDeleting(false); setI((x) => (x + 1) % words.length) }
      else setN((x) => x + (deleting ? -1 : 1))
    }, full ? hold : deleting ? del : type)
    return () => clearTimeout(id)
  }, [i, n, deleting, words, reduce, type, del, hold])

  return reduce ? words[0] : words[i % words.length].slice(0, n)
}
