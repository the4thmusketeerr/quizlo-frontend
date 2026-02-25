import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Footer } from '@/components/landing/footer'

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  )
}
