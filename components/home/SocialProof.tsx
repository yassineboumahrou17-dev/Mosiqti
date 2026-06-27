import { useTranslations } from "next-intl";

export function SocialProof() {
  const t = useTranslations('SocialProof');

  const badges = [
    { icon: "⚡", text: t('b1') },
    { icon: "📧", text: t('b2') },
    { icon: "💍", text: t('b3') },
    { icon: "✨", text: t('b4') },
  ];

  return (
    <section className="border-y border-border/60 bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {badges.map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 text-sm font-semibold text-muted"
            >
              <span className="text-base">{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
