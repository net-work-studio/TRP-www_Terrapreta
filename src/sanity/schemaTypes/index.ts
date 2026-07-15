import type { SchemaTypeDefinition } from "sanity";
import { aboutDoc } from "./documents/aboutDoc";
import { capabilityDoc } from "./documents/capabilityDoc";
import { customerDoc } from "./documents/customerDoc";
/* Documents */
import { glossaryDoc } from "./documents/glossaryDoc";
import { journalDoc } from "./documents/journalDoc";
import { navigationDoc } from "./documents/navigationDoc";
import { organizationDoc } from "./documents/organizationDoc";
import { pageDoc } from "./documents/pageDoc";
import { pressDoc } from "./documents/pressDoc";
import { processDoc } from "./documents/processDoc";
import { projectDoc } from "./documents/projectDoc";
import { redirectDoc } from "./documents/redirectDoc";
import { researchDoc } from "./documents/researchDoc";
import { serviceDoc } from "./documents/serviceDoc";
import { siteDoc } from "./documents/siteDoc";
import { tagDoc } from "./documents/tagDoc";
import { unGoalDoc } from "./documents/unGoalDoc";

/* Fragments */
import modules from "./fragments/modules";
/* Modules */
import { heroSplitModule } from "./modules/hero-split";
/* Objects */
import { competitionObject } from "./objects/competitionObject";
import { editorialImageType } from "./objects/editorialImageType";
import { gridDimensionObject } from "./objects/gridDimensionObject";
import { linkObject } from "./objects/linkObject";
import { richTextContentType } from "./objects/richTextContentType";
import { seoObject } from "./objects/seoObject";
import { titleSlugObject } from "./objects/titleSlugObject";

export const schema: { types: SchemaTypeDefinition[] } = {
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
    aboutDoc,
    capabilityDoc,
    processDoc,
    navigationDoc,
    organizationDoc,
    unGoalDoc,
    customerDoc,
    redirectDoc,

    /* Objects */
    competitionObject,
    titleSlugObject,
    editorialImageType,
    richTextContentType,
    gridDimensionObject,
    linkObject,
    seoObject,

    /* Fragments */
    modules,

    /* Modules */
    heroSplitModule,
  ],
};
