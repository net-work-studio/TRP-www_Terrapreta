type PortableTextHeadingProps = {
  children?: React.ReactNode;
};

export function PortableTextHeadingTwo({ children }: PortableTextHeadingProps) {
  if (!children) {
    return null;
  }

  return <h2 className="font-medium text-2xl">{children}</h2>;
}

export function PortableTextHeadingThree({
  children,
}: PortableTextHeadingProps) {
  if (!children) {
    return null;
  }

  return <h3 className="font-medium text-xl">{children}</h3>;
}

export function PortableTextHeadingFour({
  children,
}: PortableTextHeadingProps) {
  if (!children) {
    return null;
  }

  return <h4 className="font-medium text-lg">{children}</h4>;
}
