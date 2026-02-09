import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, size = 24, className = "" }) => {
  const LucideIcon = Icons[name];
  
  if (!LucideIcon) {
      console.warn(`Icon "${name}" not found in lucide-react`);
      return <Icons.HelpCircle size={size} className={className} />;
  }

  return <LucideIcon size={size} className={className} />;
};

export default DynamicIcon;
