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
    <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-reveal>
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-400">
          {eyebrow}
        </p>
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
        <p className="mt-4 text-lg leading-8 text-zinc-300">{description}</p>
      </div>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className="button-primary justify-center"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
