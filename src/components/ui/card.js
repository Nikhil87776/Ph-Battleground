<<<<<<< HEAD
export const Card = ({ children, className }) => <div className={`border rounded shadow ${className}`}>{children}</div>;
export const CardContent = ({ children, className }) => <div className={className}>{children}</div>;
=======

export const Card = ({ children, className }) => (
  <div className={`border rounded shadow p-2 ${className}`}>{children}</div>
);
export const CardContent = ({ children, className }) => (
  <div className={className}>{children}</div>
);
>>>>>>> 48547a6 (Intital commit)
