type PortableTextHeadingProps = {
  children?: React.ReactNode;
};

export function PortableTextHeadingTwo({
  children,
}: PortableTextHeadingProps) {
  return <h2 className="text-2xl font-medium">{children}</h2>;
}

export function PortableTextHeadingThree({
  children,
}: PortableTextHeadingProps) {
  return <h3 className="text-xl font-medium">{children}</h3>;
}
