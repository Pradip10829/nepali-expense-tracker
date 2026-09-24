import React from 'react';
import {
  Coffee,
  ShoppingBag,
  Home,
  Car,
  Smartphone,
  HeartPulse,
  HandCoins,
  Tag,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';

export default function CategoryIcon({ iconName, className = "w-5 h-5" }) {
  switch (iconName) {
    case 'Coffee':
      return <Coffee className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'HandCoins':
      return <HandCoins className={className} />;
    case 'Tag':
      return <Tag className={className} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} />;
    default:
      return <MoreHorizontal className={className} />;
  }
}
