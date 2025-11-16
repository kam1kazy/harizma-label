export type AnchorItem = {
  href: string;
  label: string;
};

export type PageAnchorsProps = {
  items: AnchorItem[];
  className?: string;
};
