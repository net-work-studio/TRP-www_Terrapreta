import { describe, expect, test } from "bun:test";
import { evaluate, parse } from "groq-js";
import { ABOUT_PAGE_QUERY } from "./queries";

const COMPANY_COLLABORATOR = {
  _key: "company-collaborator",
  _type: "companyCollaborator",
  name: "Anna Verdi",
  role: "Landscape architect",
  email: "anna@example.com",
  bio: "Works on ecological restoration.",
};

describe("About page query", () => {
  test.each([
    { collaborators: [COMPANY_COLLABORATOR, "Legacy collaborator"] },
    { collaborators: ["Legacy collaborator", COMPANY_COLLABORATOR] },
    { collaborators: ["Legacy collaborator"] },
  ])(
    "preserves collaborator details and legacy names in order: %j",
    async ({ collaborators }) => {
      const result = await evaluate(parse(ABOUT_PAGE_QUERY), {
        dataset: [{ _id: "aboutPage", _type: "aboutPage", collaborators }],
      });

      expect((await result.get()).collaborators).toEqual(collaborators);
    }
  );
});
