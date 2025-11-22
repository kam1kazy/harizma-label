import { HeroSection } from '@/widgets/hero-section';
import { CurvedSlider } from '@/widgets/curved-slider/curved-slider';
import { slides } from '@/entities/carousel';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CurvedSlider
        images={slides}
        options={{
          speed: 30,
          gap: 10,
          curve: 12,
          direction: -1, // Или 1 для reverse
        }}
      />
    </main>
  );
}
