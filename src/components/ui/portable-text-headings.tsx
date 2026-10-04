type PortableTextHeadingProps = {
  children?: React.ReactNode;
};

export function PortableTextHeadingTwo({ children }: PortableTextHeadingProps) {
  if (!children) {
    return null;
  }

  return <h2 className="font-light text-2xl">{children}</h2>;
}

export function PortableTextHeadingThree({
  children,
}: PortableTextHeadingProps) {
  if (!children) {
    return null;
  }

  return <h3 className="font-light text-xl">{children}</h3>;
}

export function PortableTextHeadingFour({
  children,
}: PortableTextHeadingProps) {
  if (!children) {
    return null;
  }

  return <h4 className="font-light text-lg">{children}</h4>;
}
