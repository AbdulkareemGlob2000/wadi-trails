type Props = { eyebrow: string; title: string; subtitle: string };

export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="muted">{subtitle}</p>
    </header>
  );
}
