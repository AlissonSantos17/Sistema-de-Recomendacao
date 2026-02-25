import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function Section({ title, action, children }: SectionProps) {
  return (
    <section className="section panel">
      <div className="section__header">
        <h2>{title}</h2>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
