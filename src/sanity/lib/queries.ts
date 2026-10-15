import { defineQuery } from "next-sanity";

const IMAGE_ASSET_PROJECTION = /* groq */ `
        _id,
        url,
        metadata{
          lqip,
          dimensions{
            width,
            height,
            aspectRatio
          }
        }`;

const IMAGE_FIELD_PROJECTION = /* groq */ `
      _type,
      hotspot,
      crop,
      asset->{
${IMAGE_ASSET_PROJECTION}
      }`;

const EDITORIAL_IMAGE_PROJECTION = /* groq */ `
    _type,
    altContent,
    caption,
    hotspot,
    crop,
    asset->{
${IMAGE_ASSET_PROJECTION}
    }`;

const PROMINENCE_PROJECTION = /* groq */ `
    "prominence": select(
      prominence == "featured" => "featured",
      isBig == true => "featured",
      "standard"
    )`;

const PORTABLE_TEXT_CONTENT_PROJECTION = /* groq */ `
  _key,
  _type,
  style,
  listItem,
  level,
  markDefs[]{
    _key,
    _type,
    href,
    blank,
    _type == "internalLink" => {
      "slug": select(
        reference->_type == "project"
          && coalesce(reference->publicationScope, "full") != "full" => null,
        reference->slug.current
      ),
      "type": reference->_type
    }
  },
  children[]{
    _key,
    _type,
    text,
    marks
  },
  _type == "editorialImage" => {
${EDITORIAL_IMAGE_PROJECTION}
  }
`;

const SEO_METADATA_PROJECTION = /* groq */ `
    metaTitle,
    metaDescription,
    ogImage{
      alt,
${IMAGE_FIELD_PROJECTION}
    },
    canonicalUrl,
    robotsIndex,
    robotsFollow,
    ogTitle,
    ogDescription,
    twitterCard`;

export const SITE_SETTINGS_QUERY = defineQuery(`*[
  _type == "site"
  && _id == "site"
][0]{
  name,
  brandName,
  seo{
${SEO_METADATA_PROJECTION}
  }
}`);

export const WEBSITE_PAGE_SEO_QUERY = defineQuery(`*[
  _id == $id
  && _type == $id
][0]{
  _id,
  seo{
${SEO_METADATA_PROJECTION}
  }
}`);

export const ABOUT_PAGE_QUERY = defineQuery(`*[
  _type == "aboutPage"
  && _id == "aboutPage"
][0]{
  _id,
  name,
  introduction[]{
    ${PORTABLE_TEXT_CONTENT_PROJECTION}
  },
  team[]->{
    _id,
    name,
    role,
    portrait{
${EDITORIAL_IMAGE_PROJECTION}
    }
  },
  "collaborators": select(
    collaborators[0]._type == "companyCollaborator" => collaborators[]{
      _key,
      name,
      role
    },
    collaborators
  )
}`);

export const WEBSITE_PAGES_SITEMAP_QUERY = defineQuery(`*[
  _id in $ids
  && _type == _id
]{
  _id,
  _updatedAt,
  seo{
    robotsIndex,
    canonicalUrl
  }
}`);

export const PROJECTS_QUERY = defineQuery(`*[
  _type == "project"
  && defined(slug.current)
] | order(orderRank asc) {
  _id,
  name,
  slug,
  "publicationScope": coalesce(publicationScope, "full"),
  shortDescription,
  gridDimension{
${PROMINENCE_PROJECTION}
  },
  mainImage{
${EDITORIAL_IMAGE_PROJECTION}
  },
  tag->{
    _id,
    name
  }
}`);

export const JOURNAL_QUERY =
  defineQuery(`*[_type == "journal" && defined(slug.current)] | order(publishingDate desc){
  _id,
  name,
  slug,
  shortDescription,
  gridDimension{
${PROMINENCE_PROJECTION}
  },
  mainImage{
${EDITORIAL_IMAGE_PROJECTION}
  },
  publishingDate,
  tag->{
    _id,
    name
  }
}`);

export const JOURNAL_ITEM_QUERY = defineQuery(`*[
  _type == "journal"
  && slug.current == $slug
][0]{
  _id,
  _updatedAt,
  name,
  slug,
  mainImage{
${EDITORIAL_IMAGE_PROJECTION}
  },
  location,
  publishingDate,
  authors[]->{
    _id,
    name
  },
  shortDescription,
  contentObject[]{
    ${PORTABLE_TEXT_CONTENT_PROJECTION}
  },
  tag->{
    _id,
    name
  },
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      alt,
${IMAGE_FIELD_PROJECTION}
    },
    canonicalUrl,
    robotsIndex,
    robotsFollow,
    schemaType,
    customSchema{
      knowsAbout,
      hasOfferCatalog
    },
    ogTitle,
    ogDescription,
    twitterCard
  }
}`);

export const TAGS_QUERY = defineQuery(`*[_type == "tag"] | order(name asc){
  _id,
  name,
  slug
}`);

export const SERVICES_QUERY = defineQuery(`*[
  _type == "service"
  && defined(slug.current)
] | order(orderRank asc){
  _id,
  name,
  slug,
  shortDescription,
  mainImage{
${EDITORIAL_IMAGE_PROJECTION}
  }
}`);

export const SERVICE_QUERY = defineQuery(`*[
  _type == "service"
  && slug.current == $slug
][0]{
  _id,
  name,
  slug,
  shortDescription,

  content[]{
    ${PORTABLE_TEXT_CONTENT_PROJECTION}
  },
  capabilities[]->{
    _id,
    name
  },
  clients[]->{
    _id,
    name,
    logoDark{
${IMAGE_FIELD_PROJECTION}
    }
  },
  mainImage{
${EDITORIAL_IMAGE_PROJECTION}
  },
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      alt,
${IMAGE_FIELD_PROJECTION}
    },
    canonicalUrl,
    robotsIndex,
    robotsFollow,
    schemaType,
    customSchema{
      knowsAbout,
      hasOfferCatalog
    },
    ogTitle,
    ogDescription,
    twitterCard
  }
}`);

export const PROJECT_ITEM_QUERY = defineQuery(`*[
  _type == "project"
  && slug.current == $slug
][0]{
  _id,
  name,
  slug,
  "publicationScope": coalesce(publicationScope, "full"),
  mainImage{
${EDITORIAL_IMAGE_PROJECTION}
  },
  status,
  location,
  areaRestored,
  interventionType,
  challenge,
  clients[]->{
    _id,
    name,
    logoDark{
${IMAGE_FIELD_PROJECTION}
    }
  },
  roles,
  team[]{
    _key,
    contribution,
    organization->{
      _id,
      name,
      logoDark{
${IMAGE_FIELD_PROJECTION}
      }
    }
  },
  nbsApplied,
  fundingProgrammes[]{
    _key,
    name,
    amount,
    url
  },
  shortDescription,
  pageContent[]{
    ${PORTABLE_TEXT_CONTENT_PROJECTION}
  },
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      alt,
${IMAGE_FIELD_PROJECTION}
    },
    canonicalUrl,
    robotsIndex,
    robotsFollow,
    schemaType,
    customSchema{
      knowsAbout,
      hasOfferCatalog
    },
    ogTitle,
    ogDescription,
    twitterCard
  }
}`);

export const UN_GOALS_QUERY =
  defineQuery(`*[_type == "unGoal"] | order(name asc){
  _id,
  name,
  logoNegative{
${IMAGE_FIELD_PROJECTION}
  },
  logoPositive{
${IMAGE_FIELD_PROJECTION}
  }
}`);

export const CUSTOMERS_QUERY =
  defineQuery(`*[_type == "customer"] | order(name asc){
  _id,
  name,
  shortDescription,
  mainImage{
${IMAGE_FIELD_PROJECTION}
  }
}`);

export const ORGANIZATIONS_QUERY = defineQuery(`*[_type == "organization"]{
  _id,
  name,
  logoDark{
${IMAGE_FIELD_PROJECTION}
  },
}`);

export const PROJECT_SLUGS_QUERY = defineQuery(
  `*[
    _type == "project"
    && defined(slug.current)
    && coalesce(publicationScope, "full") == "full"
  ] | order(_updatedAt desc) [0...100]{
    "slug": slug.current
  }`
);

export const JOURNAL_SLUGS_QUERY = defineQuery(
  `*[_type == "journal" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
);

export const SERVICE_SLUGS_QUERY = defineQuery(
  `*[_type == "service" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
);

export const PROJECTS_SITEMAP_QUERY = defineQuery(`*[
    _type == "project"
    && defined(slug.current)
    && coalesce(publicationScope, "full") == "full"
    && defined(mainImage.asset)
]{
  "slug": slug.current,
  _updatedAt,
  seo{
    robotsIndex,
    canonicalUrl
  }
}`);

export const JOURNAL_SITEMAP_QUERY = defineQuery(`*[
    _type == "journal"
    && defined(slug.current)
    && defined(mainImage.asset)
]{
  "slug": slug.current,
  _updatedAt,
  seo{
    robotsIndex,
    canonicalUrl
  }
}`);

export const SERVICES_SITEMAP_QUERY = defineQuery(`*[
    _type == "service"
    && defined(slug.current)
]{
  "slug": slug.current,
  _updatedAt,
  seo{
    robotsIndex,
    canonicalUrl
  }
}`);

export const REDIRECTS_QUERY = defineQuery(`*[
  _type == "redirect"
  && isActive == "active"
]{
  source,
  destination,
  permanent
}`);
