export function compileUnifiedGraph(input: { url: string; title: string; faq: { q: string; a: string }[]; author: string; reviewer: string; }) {
  const base = `${input.url}#`;
  return { "@context": "https://schema.org", "@graph": [
    { "@id": `${base}page`, "@type": "MedicalWebPage", name: input.title, url: input.url, author: { "@id": `${base}author` }, reviewedBy: { "@id": `${base}reviewer` }, mainEntity: { "@id": `${base}faq` } },
    { "@id": `${base}author`, "@type": "Person", name: input.author },
    { "@id": `${base}reviewer`, "@type": "Person", name: input.reviewer },
    { "@id": `${base}faq`, "@type": "FAQPage", mainEntity: input.faq.map((f, i) => ({ "@type": "Question", "@id": `${base}q${i+1}`, name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
  ]};
}
