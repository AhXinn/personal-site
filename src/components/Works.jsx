import { useState } from 'react'
import useScrollReveal from '../useScrollReveal'

// TODO: 后续添加自己的 AI 影片作品
// 格式示例：
// {
//   id: 1,
//   title: '作品名称',
//   category: 'AI 短片',
//   description: '简短描述',
//   cover: '封面图URL',
//   videoUrl: 'B站/YouTube 嵌入链接',
// }

const WORKS = []

const ALL_CATEGORIES = ['全部', ...new Set(WORKS.map(w => w.category))]

export default function Works() {
  const [filter, setFilter] = useState('全部')
  const [modal, setModal] = useState(null)
  const sectionRef = useScrollReveal()

  const filtered = filter === '全部'
    ? WORKS
    : WORKS.filter(w => w.category === filter)

  return (
    <section id="works" className="py-24 px-6 max-w-6xl mx-auto">
      <div ref={sectionRef} className="opacity-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-primary">
            作品
          </h2>
          <p className="text-text-muted">AI 影像创作精选</p>
        </div>

        {WORKS.length === 0 ? (
          /* 空状态：作品即将上线 */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-raised border border-surface-border mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <p className="text-text-muted text-lg mb-2">作品即将上线</p>
            <p className="text-text-muted/60 text-sm">AI 影片创作中，敬请期待</p>
          </div>
        ) : (
          <>
            {/* 分类筛选按钮 */}
            {ALL_CATEGORIES.length > 2 && (
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {ALL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filter === cat
                        ? 'bg-accent text-white'
                        : 'bg-surface-raised text-text-secondary hover:text-text-primary hover:bg-surface-overlay border border-surface-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* 卡片网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(work => (
                <div
                  key={work.id}
                  onClick={() => setModal(work)}
                  className="group cursor-pointer bg-surface-raised rounded-2xl overflow-hidden border border-surface-border hover:border-accent/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/5"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={work.cover}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-accent font-medium uppercase tracking-wider">
                      {work.category}
                    </span>
                    <h3 className="text-lg font-semibold mt-2 mb-1 text-text-primary group-hover:text-accent transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {work.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 弹窗播放 */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-surface-overlay rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
            <iframe
              src={modal.videoUrl}
              title={modal.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}
