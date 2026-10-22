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
A published project whose publication scope is limited to the Projects index and has no publicly accessible detail page.
_Avoid_: Unclickable project, disabled project, unpublished project

**Publication scope**:
The extent of a project's content made publicly available: either its overview entry only or both its overview entry and detail page.
_Avoid_: Clickability, enabled state

**Public page availability**:
Whether a destination has a working public website page, independently of whether search engines may index it. An overview-only project has no public detail page, and an editor preview does not establish public availability.
_Avoid_: Indexability, publication scope

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

**Project sequence**:
The editor-controlled global order in which projects appear on the Projects index. It includes both full and overview-only projects.
_Avoid_: Publication date, realization status, grid order

**Service sequence**:
The editor-controlled global order in which services appear wherever the service collection is presented.
_Avoid_: Alphabetical order, publication date

**Capability**:
A named ability offered as part of a service. A service may present multiple capabilities.
_Avoid_: Project role, process

**Organization**:
A named external entity that can participate in one or more projects in different capacities.
_Avoid_: Client or partner as an intrinsic organization type

**Project role**:
An account of Terrapreta's responsibility or position within a specific project, such as acting as the main partner of a municipality for development of a restoration project. A project may record multiple roles.
_Avoid_: Capability, organization type

**Project team member**:
An organization that contributed to a project, recorded once per project together with a concise account of all its contributions.
_Avoid_: Repeating an organization once for each contribution

**Project client**:
An organization that commissioned or received a project's work. A project client may also be a project team member when it made an active contribution.
_Avoid_: Treating client and team member as mutually exclusive

**Project challenge**:
A concise, public-facing summary of the condition or problem a project addresses.
_Avoid_: Internal editorial note, full project narrative

**Applied nature-based solution**:
A named nature-based intervention used in a project. A project may apply multiple solutions, recorded in straightforward editorial language rather than as a browsing taxonomy.
_Avoid_: Capability, project challenge

**Journal entry**:
A dated editorial article published in the Journal and classified by a tag.
_Avoid_: Tag, journal page

**Journal tag**:
A taxonomy label that classifies journal entries and can narrow the Journal collection without defining website hierarchy.
_Avoid_: Breadcrumb, section

**Person**:
An individual who may be presented as a company team member, credited as a journal author, or both.
_Avoid_: Team as the name for an individual

**Company team member**:
A person selected for public presentation as part of Terrapreta's core team, with a public role and portrait. Their profile may include a description, short biography, and an email address whose public display is optional.
_Avoid_: Project team member, collaborator

**Journal author**:
A person credited with writing a journal entry. A journal entry may credit multiple authors, independently of company team membership.
_Avoid_: Responsible person, publisher

**Company collaborator**:
A named individual acknowledged separately from Terrapreta's core team, with an optional public role, short biography, and contact email.
_Avoid_: Company team member, project team member

**Fixed website page**:
One of Terrapreta's named website pages with a single editorial identity: Homepage, Contact, About, Projects index, Journal index, or Research index.
_Avoid_: Generic Page, collection entry

**Collection index**:
A fixed website page presenting the Projects, Journal, or Research collection. Its page metadata describes the collection as a whole, while each entry has its own content and metadata.
_Avoid_: Collection overview, detail page, collection entry

**Site SEO defaults**:
Terrapreta's shared search and social metadata defaults, used when a page has no more specific value. They are distinct from Homepage SEO.
_Avoid_: Homepage SEO, page override

**Page SEO**:
Search and social metadata describing one website page. Page-specific values take priority over shared defaults.
_Avoid_: Site SEO defaults, visible page content

**Site brand name**:
The name identifying Terrapreta in page title suffixes and social metadata. It is distinct from a page's SEO title and the administrative label of Site Settings.
_Avoid_: Homepage title, settings document name

**Homepage hero**:
The opening section of the Homepage, introducing Terrapreta with an image, a main heading, and supporting text. Its image has alternative text and no caption.
_Avoid_: Homepage SEO, page title when referring to the visible hero heading

**Hero link**:
An optional call to action in the Homepage hero, with its own label, that takes visitors to the next section on the Homepage or to a publicly available internal website page. Editors can hide a configured Hero link without removing its settings, and a link to another page disappears if that page becomes unavailable.
_Avoid_: Scroll cue, external link

**Scroll cue**:
The "Scroll to learn more" prompt and arrow in the Homepage hero, taking visitors to the next section when selected. It can be animated, static, or hidden, independently of the Hero link, and starts static.
_Avoid_: Hero link, Learn more button
