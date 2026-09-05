import RevealOnScroll from './RevealOnScroll';
import './section-heading.css';

export default function SectionHeading({
  eyebrow,
  title,
  titleId,
  subtitle,
  align = 'left',
  wide = false,
  className = '',
}) {
  return (
    <RevealOnScroll
      className={`section-heading section-heading--${align} ${wide ? 'section-heading--wide' : ''} ${className}`.trim()}
    >
      {eyebrow && (
        <span className={`eyebrow ${align === 'center' ? 'eyebrow--center' : ''}`.trim()}>{eyebrow}</span>
      )}
      <h2 className="section-heading__title" id={titleId}>
        {title}
      </h2>
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
    </RevealOnScroll>
  );
}
