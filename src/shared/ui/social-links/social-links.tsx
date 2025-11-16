import { Pill } from '@/shared/ui/pill';

const socials = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter'];

export function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {socials.map((name, index) => (
        <Pill key={name}>
          {name}
          {index < socials.length - 1 && <span className="ml-2 pl-2 text-[16px]">•</span>}
        </Pill>
      ))}
    </div>
  );
}
