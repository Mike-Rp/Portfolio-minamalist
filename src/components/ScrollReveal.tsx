import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import AnimatedContent from './reactbits/AnimatedContent';

// Shared entrance for public content sections. Keep controls and components with
// their own entrance effects outside this wrapper.
export default function ScrollReveal({ children, className = 'scroll-reveal', stagger = 0, delay = 0, ...props }: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
} & HTMLAttributes<HTMLDivElement>) {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return <AnimatedContent
    {...props}
    className={className}
    distance={mobile ? 18 : 28}
    direction="vertical"
    duration={0.65}
    ease="power3.out"
    initialOpacity={0}
    animateOpacity
    scale={1}
    blur={0}
    rotate={0}
    tilt={0}
    wipe="none"
    threshold={0.12}
    once
    scrub={false}
    stagger={stagger}
    delay={delay}
  >{children}</AnimatedContent>;
}
