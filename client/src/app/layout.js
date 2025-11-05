// client/src/app/layout.js

import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from '../context/AuthContext'; // <-- NEW IMPORT

export const metadata = {
  title: 'Recipe Finder Dashboard',
  description: 'Full-Stack Recipe Manager with Authentication.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the children with the AuthProvider */}
        <AuthProvider> 
          <div className="container mt-5">
              {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}