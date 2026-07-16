import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbCustomProps = {
  tag?: string | null;
};

export default function BreadcrumbCustom({ tag }: BreadcrumbCustomProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/journal">Journal</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {tag ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>{tag}</span>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
