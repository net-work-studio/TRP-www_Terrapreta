type PortableTextHeadingProps = {
  children?: React.ReactNode;
};

export function PortableTextHeadingTwo({
  children,
}: PortableTextHeadingProps) {
  if (!children) {
    return null;
  }

  return <h2 className="text-2xl font-medium">{children}</h2>;
}

export function PortableTextHeadingThree({
  children,
}: PortableTextHeadingProps) {
  if (!children) {
    return null;
  }

  return <h3 className="text-xl font-medium">{children}</h3>;
}

export function PortableTextHeadingFour({
  children,
}: PortableTextHeadingProps) {
  if (!children) {
    return null;
  }

  return <h4 className="text-lg font-medium">{children}</h4>;
}
