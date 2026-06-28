export default function Contact() {
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-primary">
        联系我
      </h2>
      <p className="text-text-muted mb-12">
        在抖音上找到我
      </p>

      <a
        href="https://www.douyin.com/user/MS4wLjABAAAA9XNFY_YhmaWCN0lp7zJkXuK383f6AKMxUWXmahEIC3s?from_tab_name=main"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-surface-raised text-text-secondary border border-surface-border hover:border-accent/30 hover:text-accent transition-all duration-200 hover:scale-105"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
        <span className="font-medium">@AhXinn</span>
      </a>
    </div>
  )
}
