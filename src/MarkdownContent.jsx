import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const headingId = (text, index) => `section-${index}-${text.replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '').toLowerCase()}`
const childText = children => Array.isArray(children) ? children.join('') : String(children)
const resolveAsset = (src, base) => {
  if (!src || /^(https?:|data:|blob:)/i.test(src)) return src
  const clean = src.replace(/^\.\//, '').replace(/^\//, '')
  return `${base}${clean.split('/').map(encodeURIComponent).join('/')}`
}

export default function MarkdownContent({ source, assetBase = '' }) {
  let headingIndex = -1
  const makeHeading = Tag => ({ children }) => {
    headingIndex += 1
    const text = childText(children)
    return <Tag id={headingId(text, headingIndex)}>{children}</Tag>
  }

  return <div className="article-prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    h1: makeHeading('h2'),
    h2: makeHeading('h2'),
    h3: makeHeading('h3'),
    h4: makeHeading('h4'),
    img: ({ src, alt }) => <img src={resolveAsset(src, assetBase)} alt={alt || ''} loading="lazy" />,
    a: ({ href, children }) => <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noreferrer' : undefined}>{children}</a>,
  }}>{source}</ReactMarkdown></div>
}
