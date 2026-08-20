import RevealOnScroll from './RevealOnScroll';
import './section-heading.css';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', className = '' }) {
  return (
    <RevealOnScroll className={`section-heading section-heading--${align} ${className}`.trim()}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
    </RevealOnScroll>
  );
}
