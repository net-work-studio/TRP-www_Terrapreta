import type {
  Divider,
  ListItem,
  ListItemBuilder,
  StructureBuilder,
} from "sanity/structure";

export const group = (
  S: StructureBuilder,
  title: string,
  items: (ListItemBuilder | ListItem | Divider)[]
): ListItemBuilder =>
  S.listItem().title(title).child(S.list().title(title).items(items));

export const directory = (
  S: StructureBuilder,
  path: string,
  { maxLevel }: { maxLevel?: number } = {}
) =>
  S.listItem()
    .title(`/${path}`)
    .schemaType("page")
    .child(
      S.documentList()
        .id(`page.${path.replaceAll("/", "-")}`)
        .filter(
          `
						string::startsWith(metadata.slug.current, $path)
						${maxLevel === undefined ? "" : `&& count(string::split(metadata.slug.current, '/')) <= ${maxLevel + 1}`}
					`
        )
        .params({ path: `${path}/` })
    );
