import { HeroSection } from '@/widgets/hero-section';
import { CurvedSlider } from '@/widgets/curved-slider/curved-slider';
import { AudioPlayer } from '@/widgets/audio-player';
import { slides } from '@/entities/carousel';
import { tracks } from '@/entities/audio';

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
      <AudioPlayer tracks={tracks} />
    </main>
  );
}
