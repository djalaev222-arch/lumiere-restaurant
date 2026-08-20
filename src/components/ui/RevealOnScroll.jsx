import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function RevealOnScroll({
  children,
  as = motion.div,
  delay = 0,
  y = 28,
  className,
  once = true,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Component = useMemo(() => (typeof as === 'string' ? motion.create(as) : as), [as]);

  if (reduced) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
