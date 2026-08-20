import { Link } from 'react-router-dom';
import './button.css';

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  children,
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
        {icon}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
        {icon}
      </a>
    );
  }

  const Tag = as || 'button';
  return (
    <Tag className={classes} {...rest}>
      {children}
      {icon}
    </Tag>
  );
}
