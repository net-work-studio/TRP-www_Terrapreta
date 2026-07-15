type ObjectValue = Record<string, unknown>;

function isObjectValue(value: unknown): value is ObjectValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function toCanonicalEditorialImage(value: unknown): unknown {
  if (!(isObjectValue(value) && value._type === "imageObject")) {
    return value;
  }

  const { image, _type: _legacyType, ...imageMetadata } = value;
  if (!isObjectValue(image)) {
    return value;
  }

  const { _type: _imageType, ...imageFields } = image;

  return {
    ...imageFields,
    ...imageMetadata,
    _type: "editorialImage",
  };
}

export function toCanonicalPortableText(value: unknown): unknown {
  if (
    isObjectValue(value) &&
    value._type === "contentObject" &&
    Array.isArray(value.content)
  ) {
    return value.content;
  }

  return value;
}
