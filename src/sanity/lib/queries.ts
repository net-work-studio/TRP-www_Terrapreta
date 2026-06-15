import { defineQuery } from "next-sanity";

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
      "slug": reference->slug.current,
      "type": reference->_type
    }
  },
  children[]{
    _key,
    _type,
    text,
    marks
  },
  _type == "imageObject" => {
    altContent,
    caption,
    image{
      _type,
      hotspot,
      crop,
      asset->{
        _id,
        url,
        metadata{
          lqip,
          dimensions{
            width,
            height,
            aspectRatio
          }
        }
      }
    }
  }
`;

export const SITE_SETTINGS_QUERY =
  defineQuery(`*[_type == "site" && _id == "site"][0]{
  name,
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      asset->{
        _id,
        url
      }
    },
    canonicalUrl,
    robotsIndex,
    robotsFollow,
    ogTitle,
    ogDescription,
    twitterCard
  }
}`);

export const PROJECTS_QUERY =
  defineQuery(`*[_type == "project" && defined(slug.current)] {
  _id,
  name,
  slug,
  shortDescription,
  gridDimension{
    "prominence": select(
      prominence == "featured" => "featured",
      isBig == true => "featured",
      "standard"
    )
  },
  mainImage{
    _type,
    image{
      _type,
      asset->{
        _id,
        url
      }
    }
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
    "prominence": select(
      prominence == "featured" => "featured",
      isBig == true => "featured",
      "standard"
    )
  },
  mainImage{
    _type,
    image{
      _type,
      asset->{
        _id,
        url
      }
    }
  },
  publishingDate,
  tag->{
    _id,
    name
  }
}`);

export const JOURNAL_ITEM_QUERY =
  defineQuery(`*[_type == "journal" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  mainImage{
    _type,
    image{
      _type,
      asset->{
        _id,
        url
      }
    }
  },
  location,
  publishingDate,
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
      asset->{
        _id,
        url
      }
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

export const SERVICES_QUERY =
  defineQuery(`*[_type == "service" && defined(slug.current)] | order(name asc){
  _id,
  name,
  slug,
  shortDescription,
  mainImage{
    _type,
    image{
      _type,
      asset->{
        _id,
        url
      }
    }
  }
}`);

export const SERVICE_QUERY =
  defineQuery(`*[_type == "service" && slug.current == $slug][0]{
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
      asset->{
        _id,
        _type,
        url
      }
    }
  },
  mainImage{
    image{
      asset->{
        url
      }
    }
  },
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      asset->{
        _id,
        url
      }
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

export const PROJECT_ITEM_QUERY =
  defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  mainImage{
    _type,
    image{
      _type,
      asset->{
        _id,
        url
      }
    }
  },
  status,
  location,
  areaRestored,
  interventionType,
  shortDescription,
  pageContent{
    content[]{
      ${PORTABLE_TEXT_CONTENT_PROJECTION}
    }
  },
  relatedService->{
    _id,
    name,
    slug
  },
  relatedResearch->{
    _id,
    name
  },
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      asset->{
        _id,
        url
      }
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
    _type,
    asset->{
      _id,
      url
    }
  },
  logoPositive{
    _type,
    asset->{
      _id,
      url
    }
  }
}`);

export const CUSTOMERS_QUERY =
  defineQuery(`*[_type == "customer"] | order(name asc){
  _id,
  name,
  shortDescription,
  mainImage{
    hotspot,
    crop,
    asset->{
      _id,
      url
    }
  }
}`);

export const ORGANIZATIONS_QUERY = defineQuery(`*[_type == "organization"]{
  _id,
  name,
  type,
  logoDark{
    _type,
    asset->{
      _id,
      url,
    }
  },
}`);

export const PROJECT_SLUGS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
);

export const JOURNAL_SLUGS_QUERY = defineQuery(
  `*[_type == "journal" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
);

export const SERVICE_SLUGS_QUERY = defineQuery(
  `*[_type == "service" && defined(slug.current)] | order(_updatedAt desc) [0...100]{"slug": slug.current}`
);

export const PROJECTS_SITEMAP_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current) && seo.robotsIndex != "noindex"] {
    "slug": slug.current,
    _updatedAt
  }`
);

export const JOURNAL_SITEMAP_QUERY = defineQuery(
  `*[_type == "journal" && defined(slug.current) && seo.robotsIndex != "noindex"] {
    "slug": slug.current,
    _updatedAt
  }`
);

export const SERVICES_SITEMAP_QUERY = defineQuery(
  `*[_type == "service" && defined(slug.current) && seo.robotsIndex != "noindex"] {
    "slug": slug.current,
    _updatedAt
  }`
);

export const REDIRECTS_QUERY = defineQuery(`*[
  _type == "redirect"
  && isActive == "active"
]{
  source,
  destination,
  permanent
}`);
