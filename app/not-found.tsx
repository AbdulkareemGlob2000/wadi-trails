import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="Not found" title="No trail here" subtitle="The page you asked for does not exist." />
      <p>
        <Link href="/">Go back to the regions</Link>
      </p>
    </>
  );
}
