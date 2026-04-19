import Link from 'next/link';

type SectionShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function SectionShell({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
}: SectionShellProps) {
  return (
    <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">
          {eyebrow}
        </p>
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-300">{description}</p>
      </div>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
