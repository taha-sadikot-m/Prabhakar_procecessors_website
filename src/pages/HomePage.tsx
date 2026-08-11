import { Closing } from '../components/Closing'
import { Ecosystem } from '../components/Ecosystem'
import { Future } from '../components/Future'
import { Hero } from '../components/Hero'
import { Journey } from '../components/Journey'
import { People } from '../components/People'
import { Quality } from '../components/Quality'
import { Serve } from '../components/Serve'
import { Transformation } from '../components/Transformation'
import { SeoHead } from '../components/SeoHead'

export function HomePage() {
  return (
    <main>
      <SeoHead
        title="Prabhakar Processors"
        description="The Mill that dyes, prints and delivers quality."
        path="/"
      />
      <Hero />
      <Journey />
      <Transformation />
      <Quality />
      <Ecosystem />
      <Serve />
      <Future />
      <People />
      <Closing />
    </main>
  )
}
