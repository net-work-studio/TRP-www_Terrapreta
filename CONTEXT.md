# Terrapreta Website

This context describes the language used for content and presentation concepts on the Terrapreta website.

## Language

**CMS-backed image**:
An image whose content is stored in Sanity and fetched by a GROQ query before rendering on the website.
_Avoid_: Sanity image when referring to hardcoded asset references.

**LQIP**:
The Sanity-provided low-quality image placeholder stored on an image asset at `metadata.lqip`.
_Avoid_: Generated blur URL for CMS-backed images.

**SanityImage**:
The shared frontend component used to render CMS-backed images with LQIP blur placeholders.
_Avoid_: Direct `next/image` usage for CMS-backed images.

**Hardcoded image**:
An image referenced by a fixed Sanity CDN URL or asset ID in frontend code, not fetched through a GROQ query.
_Avoid_: CMS-backed image when the source is not query-driven.

**Overview-only project**:
A published project whose publication scope is limited to the projects overview and has no publicly accessible detail page.
_Avoid_: Unclickable project, disabled project, unpublished project

**Publication scope**:
The extent of a project's content made publicly available: either its overview entry only or both its overview entry and detail page.
_Avoid_: Clickability, enabled state
