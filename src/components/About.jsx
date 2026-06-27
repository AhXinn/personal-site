import useScrollReveal from '../useScrollReveal'

// TODO: 后续添加技能标签，格式参考：
// const SKILLS = ['AI 影像生成', '视频剪辑', '...']

export default function About() {
  const sectionRef = useScrollReveal()

  return (
    <section id="about" className="py-24 px-6">
      <div ref={sectionRef} className="max-w-3xl mx-auto opacity-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-primary">
            关于
          </h2>
          <p className="text-text-muted">be myself.</p>
        </div>

        <div className="text-center py-12">
          <p className="text-text-muted text-lg">
            更多内容即将更新...
          </p>
        </div>
      </div>
    </section>
  )
}
