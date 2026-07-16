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
          <BreadcrumbLink render={<Link href="/journal" />}>
            Journal
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
