import { ReactNode } from 'react';

const BackgroundIcon = ({ children, color = 'primary' }: { children: ReactNode; color?: 'primary' | 'white' }) => (
  <div className={`background-icon ${color}`}>{children}</div>
);

export default BackgroundIcon;
