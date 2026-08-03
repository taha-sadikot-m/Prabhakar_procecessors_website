import { Closing } from '../components/Closing'
import { Ecosystem } from '../components/Ecosystem'
import { Future } from '../components/Future'
import { Hero } from '../components/Hero'
import { Journey } from '../components/Journey'
import { Partnerships } from '../components/Partnerships'
import { People } from '../components/People'
import { Quality } from '../components/Quality'
import { Serve } from '../components/Serve'
import { Transformation } from '../components/Transformation'

export function HomePage() {
  return (
    <main>
      <Hero />
      <Journey />
      <Transformation />
      <Quality />
      <Ecosystem />
      <Serve />
      <Partnerships />
      <Future />
      <People />
      <Closing />
    </main>
  )
}
