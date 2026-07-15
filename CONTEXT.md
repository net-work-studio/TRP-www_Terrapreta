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

**Realization status**:
The current delivery state of a project: either in progress or completed. It is independent of any competition result and may be omitted from public presentation when it adds no useful context.
_Avoid_: Competition status, project status

**Competition result**:
The known outcome of a project entered in a design competition: first prize, second prize, third prize, honourable mention, shortlisted, or participant. Competition entries are published only after judging, so the result is required.
_Avoid_: Realization status, competition status

**Competition name**:
The official name of the competition associated with a project. It is recorded only when it differs from the project title.
_Avoid_: Duplicate project title

**Competition entry**:
A project proposal submitted to one design competition. A project represents at most one competition entry and retains its competition result independently of its realization status.
_Avoid_: Competition collection, award

**Project year**:
The optional year an editor considers most relevant to presenting a project, typically its completion year or the year its competition result was announced.
_Avoid_: Mandatory start year
