import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  position?: "center" | "left";
  children?: React.ReactNode;
};

export default function PageHeader({
  title,
  description,
  position = "center",
  children,
}: PageHeaderProps) {
  return (
    <hgroup
      className={cn(
        "container-site mx-auto mt-24 flex flex-col gap-2.5 pb-10 md:mt-34 md:mb-16",
        position === "center"
          ? "items-center justify-center"
          : "items-start justify-start"
      )}
    >
      <h1 className="font-light text-3xl tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h1>
      {!!description && (
        <p className="text-muted-foreground text-xl">{description}</p>
      )}
      {children}
    </hgroup>
  );
}
