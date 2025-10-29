// client/src/app/layout.js

import 'bootstrap/dist/css/bootstrap.min.css'; // Global Bootstrap CSS

export const metadata = {
  title: 'Recipe Finder Dashboard',
  description: 'Full-Stack Recipe Manager with Authentication.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container mt-5">
            {children}
        </div>
      </body>
    </html>
  );
}