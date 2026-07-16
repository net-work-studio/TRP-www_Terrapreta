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
        "container-site mx-auto mt-24 flex starting:translate-y-2 translate-y-0 flex-col gap-2.5 pb-10 opacity-100 starting:opacity-0 transition-all duration-300 md:mt-34 md:mb-16",
        position === "center"
          ? "items-center justify-center"
          : "items-start justify-start"
      )}
    >
      <h1 className="font-light tracking-tight text-3xl md:text-4xl lg:text-5xl">{title}</h1>
      {description && (
        <p className="text-xl text-muted-foreground">{description}</p>
      )}
      {children}
    </hgroup>
  );
}
