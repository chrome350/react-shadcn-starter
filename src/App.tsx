import { ArrowRight, Code2, Layers3, Rocket, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Layers3,
    title: "shadcn/ui подключён",
    description: "Компоненты лежат прямо в проекте — их легко менять под свой дизайн.",
  },
  {
    icon: Smartphone,
    title: "Удобно на телефоне",
    description: "Адаптивная сетка, крупные зоны нажатия и корректные safe-area отступы.",
  },
  {
    icon: Rocket,
    title: "Готово к публикации",
    description: "GitHub Actions автоматически собирает и выкладывает сайт в GitHub Pages.",
  },
]

export function App() {
  return (
    <div className="min-h-svh overflow-hidden bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <a className="flex items-center gap-2 font-semibold" href="#top" aria-label="На главную">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">R</span>
          React Starter
        </a>
        <Button variant="outline" size="sm" asChild>
          <a href="https://github.com/chrome350/react-shadcn-starter" target="_blank" rel="noreferrer">
            <Code2 /> GitHub
          </a>
        </Button>
      </header>

      <main id="top" className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
        <section className="relative text-center">
          <div className="hero-glow" aria-hidden="true" />
          <Badge className="mb-6 bg-background/70 backdrop-blur">React · TypeScript · shadcn/ui</Badge>
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Хорошая основа для следующего проекта
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Чистый старт без лишнего: современный стек, готовые UI-компоненты и автоматический деплой.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}>
              Посмотреть возможности <ArrowRight />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://ui.shadcn.com/docs" target="_blank" rel="noreferrer">Документация shadcn</a>
            </Button>
          </div>
        </section>

        <section id="features" className="mt-20 grid gap-4 sm:mt-28 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="bg-card/70 backdrop-blur transition-transform hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 grid size-11 place-items-center rounded-xl bg-secondary"><Icon className="size-5" /></div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent><CardDescription className="leading-6">{description}</CardDescription></CardContent>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t px-5 py-7 text-center text-sm text-muted-foreground">
        Собрано на React и shadcn/ui
      </footer>
    </div>
  )
}
