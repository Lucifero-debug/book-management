import { Suspense } from "react";
import Reset from "../components/Reset"; // Import the component

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reset />
    </Suspense>
  );
}
