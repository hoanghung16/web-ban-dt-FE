import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
  // items: [{ label: 'Home', path: '/' }, { label: 'Products' }]
  
  return (
    <nav className="flex items-center gap-2 mb-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.path ? (
            <Link 
              to={item.path}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm text-blue-500 font-bold">{item.label}</span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight size={16} className="text-zinc-600" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
