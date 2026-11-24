import SpecularButton, { type SpecularButtonProps } from './reactbits/SpecularButton';

type Variant = 'primary' | 'secondary' | 'resume';

type VisualProp =
  | 'size'
  | 'radius'
  | 'tint'
  | 'tintOpacity'
  | 'textColor'
  | 'lineColor'
  | 'baseColor'
  | 'intensity'
  | 'idleIntensity'
  | 'followMouse'
  | 'autoAnimate';

type PortfolioActionButtonProps = Omit<SpecularButtonProps, VisualProp> & {
  variant: Variant;
  reducedMotion?: boolean;
};

const variants = {
  primary: {
    tint: '#111111',
    tintOpacity: 1,
    textColor: '#ffffff',
    lineColor: '#ffffff',
    baseColor: '#444444',
    intensity: 1,
    idleIntensity: 0.2,
  },
  secondary: {
    tint: '#ffffff',
    tintOpacity: 1,
    textColor: '#111111',
    lineColor: '#111111',
    baseColor: '#555555',
    intensity: 0.75,
    idleIntensity: 0.15,
  },
  resume: {
    tint: '#ffffff',
    tintOpacity: 0,
    textColor: '#111111',
    lineColor: '#8a8a8a',
    baseColor: '#777777',
    intensity: 0.75,
    idleIntensity: 0.12,
  },
} satisfies Record<Variant, Partial<SpecularButtonProps>>;

export default function PortfolioActionButton({ variant, reducedMotion = false, className = '', ...props }: PortfolioActionButtonProps) {
  return (
    <SpecularButton
      {...variants[variant]}
      size="md"
      radius={variant === 'resume' ? 20 : 12}
      followMouse={!reducedMotion}
      idleIntensity={reducedMotion ? 0 : variants[variant].idleIntensity}
      autoAnimate={false}
      className={`action-button action-${variant}${className ? ` ${className}` : ''}`}
      {...props}
    />
  );
}
