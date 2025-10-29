// client/src/app/page.js

// Mark as client component since we will use state/hooks later
"use client"; 

import { Button } from 'react-bootstrap';

export default function Home() {
  return (
    <div className="text-center">
      <h1>Recipe Finder Dashboard Client</h1>
      <p>Bootstrap is working!</p>
      <Button variant="primary">Test Button</Button>
    </div>
  );
}