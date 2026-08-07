import { cn } from "@/lib/utils";

type ArticleContentProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ArticleContent({
  children,
  className,
}: ArticleContentProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[52ch] space-y-7.5 text-lg",
        className
      )}
    >
      {children}
    </section>
  );
}
