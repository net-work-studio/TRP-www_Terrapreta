import type { SchemaTypeDefinition, Template } from "sanity";
import { aboutPageDoc } from "./documents/aboutPageDoc";
import { capabilityDoc } from "./documents/capabilityDoc";
import { contactPageDoc } from "./documents/contactPageDoc";
import { customerDoc } from "./documents/customerDoc";
/* Documents */
import { glossaryDoc } from "./documents/glossaryDoc";
import { homePageDoc } from "./documents/homePageDoc";
import { journalDoc } from "./documents/journalDoc";
import { journalIndexPageDoc } from "./documents/journalIndexPageDoc";
import { navigationDoc } from "./documents/navigationDoc";
import { organizationDoc } from "./documents/organizationDoc";
import { pageDoc } from "./documents/pageDoc";
import { personDoc } from "./documents/personDoc";
import { pressDoc } from "./documents/pressDoc";
import { processDoc } from "./documents/processDoc";
import { projectDoc } from "./documents/projectDoc";
import { projectsIndexPageDoc } from "./documents/projectsIndexPageDoc";
import { redirectDoc } from "./documents/redirectDoc";
import { researchDoc } from "./documents/researchDoc";
import { researchIndexPageDoc } from "./documents/researchIndexPageDoc";
import { serviceDoc } from "./documents/serviceDoc";
import { siteDoc } from "./documents/siteDoc";
import { tagDoc } from "./documents/tagDoc";
import { unGoalDoc } from "./documents/unGoalDoc";

/* Fragments */
import modules from "./fragments/modules";
/* Modules */
import { heroSplitModule } from "./modules/hero-split";
import { companyCollaboratorObject } from "./objects/companyCollaboratorObject";
import { competitionObject } from "./objects/competitionObject";
/* Objects */
import { customSchemaObject } from "./objects/customSchemaObject";
import { editorialImageType } from "./objects/editorialImageType";
import { fundingProgrammeObject } from "./objects/fundingProgrammeObject";
import { gridDimensionObject } from "./objects/gridDimensionObject";
import { heroHeadingType } from "./objects/heroHeadingType";
import { heroImageType } from "./objects/heroImageType";
import { homeHeroObject } from "./objects/homeHeroObject";
import { internalCallToActionObject } from "./objects/internalCallToActionObject";
import { linkObject } from "./objects/linkObject";
import { projectTeamMemberObject } from "./objects/projectTeamMemberObject";
import { richTextContentType } from "./objects/richTextContentType";
import { seoObject } from "./objects/seoObject";
import { titleSlugObject } from "./objects/titleSlugObject";

export const schema = {
  types: [
    /* Documents */
    journalDoc,
    projectDoc,
    researchDoc,
    serviceDoc,
    tagDoc,
    glossaryDoc,
    pageDoc,
    siteDoc,
    pressDoc,
    homePageDoc,
    contactPageDoc,
    aboutPageDoc,
    personDoc,
    projectsIndexPageDoc,
    journalIndexPageDoc,
    researchIndexPageDoc,
    capabilityDoc,
    processDoc,
    navigationDoc,
    organizationDoc,
    unGoalDoc,
    customerDoc,
    redirectDoc,

    /* Objects */
    competitionObject,
    companyCollaboratorObject,
    customSchemaObject,
    titleSlugObject,
    editorialImageType,
    fundingProgrammeObject,
    richTextContentType,
    gridDimensionObject,
    heroHeadingType,
    heroImageType,
    homeHeroObject,
    internalCallToActionObject,
    linkObject,
    projectTeamMemberObject,
    seoObject,

    /* Fragments */
    modules,

    /* Modules */
    heroSplitModule,
  ] satisfies SchemaTypeDefinition[],
  templates: (templates: Template[]) =>
    templates.filter((template) => template.schemaType !== "navigation"),
};
