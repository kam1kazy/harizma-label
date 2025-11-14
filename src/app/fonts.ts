import localFont from 'next/font/local';

export const ntSomic = localFont({
  src: [
    {
      path: '../../public/fonts/nt_somic/Webfonts/NTSomic-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/nt_somic/Webfonts/NTSomic-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/nt_somic/Webfonts/NTSomic-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-nt-somic',
});

export const ntSomicVariable = localFont({
  src: '../../public/fonts/nt_somic/Variable/NTSomic-VF.ttf',
  variable: '--font-nt-somic-variable',
});

export const inspiration = localFont({
  src: [
    {
      path: '../../public/fonts/inspiration/Inspiration.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-inspiration-variable',
});

export const gunnyRewritten = localFont({
  src: [
    {
      path: '../../public/fonts/gunny-rewritten/gunny-rewritten.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-gunny-rewritten-variable',
});

export const marckScript = localFont({
  src: [
    {
      path: '../../public/fonts/marck-script/marck-script.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-marck-script-variable',
});
