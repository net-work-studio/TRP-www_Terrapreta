import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { HOME_HERO_QUERY_RESULT } from "@/sanity/types";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "wj2okvbq";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { HomeHeroContent } = await import("./home-hero-content");

type Hero = NonNullable<HOME_HERO_QUERY_RESULT>["hero"];

const heroButton: NonNullable<Hero["button"]> = {
  visibility: "shown",
  label: "Explore our projects",
  destinationType: "page",
  page: {
    _id: "projectsIndexPage",
    _type: "projectsIndexPage",
    slug: null,
    publicationScope: "full",
    hasImage: false,
  },
};

function createHero(overrides: Partial<Hero> = {}): Hero {
  return {
    heading: [
      {
        _type: "block",
        _key: "heading",
        style: "normal",
        markDefs: null,
        children: [
          { _type: "span", _key: "intro", text: "Our ", marks: [] },
          {
            _type: "span",
            _key: "emphasis",
            text: "living soil",
            marks: ["em"],
          },
        ],
      },
    ],
    description: "Restoring ecosystems together",
    image: {
      _type: "heroImage",
      altContent: "A researcher examining woodland soil",
      crop: null,
      hotspot: null,
      asset: {
        _id: "image-eecceff4dc7444ca6289425e2b06dc94610ea58e-2400x1602-webp",
        url: "https://cdn.sanity.io/images/wj2okvbq/production/eecceff4dc7444ca6289425e2b06dc94610ea58e-2400x1602.webp",
        metadata: {
          lqip: "data:image/jpeg;base64,placeholder",
          dimensions: { width: 2400, height: 1602, aspectRatio: 2400 / 1602 },
        },
      },
    },
    button: heroButton,
    scrollCue: "static",
    ...overrides,
  };
}

function renderHero(hero: Hero | null) {
  return renderToStaticMarkup(<HomeHeroContent hero={hero} />);
}

describe("Homepage hero content", () => {
  test("renders an italic heading, supporting text and image alt without a caption", () => {
    const html = renderHero(createHero());
    expect(html).toContain(">Our <em>living soil</em></h1>");
    expect(html).toContain("Restoring ecosystems together");
    expect(html).toContain('alt="A researcher examining woodland soil"');
    expect(html).toContain("data:image/jpeg;base64,placeholder");
    expect(html).not.toContain("figcaption");
  });

  test("renders an independently labelled internal button", () => {
    const html = renderHero(createHero());
    expect(html).toContain('href="/projects"');
    expect(html).toContain("Explore our projects");
  });

  test("Learn more scrolls to the next section without needing an internal page or scroll cue", () => {
    const html = renderHero(
      createHero({
        button: {
          ...heroButton,
          label: "Learn more",
          destinationType: "section",
          page: null,
        },
        scrollCue: "hidden",
      })
    );
    expect(html).toContain('href="#learn-more">Learn more</a>');
    expect(html).not.toContain('href="/projects"');
    expect(html).not.toContain("Scroll to learn more");
  });

  test("switching to the next section keeps a stored page from changing the link", () => {
    const html = renderHero(
      createHero({
        button: { ...heroButton, destinationType: "section" },
        scrollCue: "hidden",
      })
    );
    expect(html).toContain('href="#learn-more">Explore our projects</a>');
    expect(html).not.toContain('href="/projects"');
  });

  test("hides a configured button without losing the scroll cue", () => {
    const hero = createHero();
    const html = renderHero({
      ...hero,
      button: { ...heroButton, visibility: "hidden" },
    });
    expect(html).not.toContain("Explore our projects");
    expect(html).not.toContain('href="/projects"');
    expect(html).toContain("Scroll to learn more");
  });

  test.each([null, "", "   "])(
    "hides a shown button with empty text %j",
    (label) => {
      const hero = createHero();
      const html = renderHero({ ...hero, button: { ...heroButton, label } });
      expect(html).not.toContain('href="/projects"');
    }
  );

  test("hides a button after its destination is unpublished", () => {
    const hero = createHero();
    const html = renderHero({
      ...hero,
      button: { ...heroButton, page: null },
    });
    expect(html).not.toContain("Explore our projects");
  });

  test("hides a button when its project becomes overview-only", () => {
    const hero = createHero();
    const html = renderHero({
      ...hero,
      button: {
        ...heroButton,
        page: {
          _id: "project-example",
          _type: "project",
          slug: "example",
          publicationScope: "overview",
          hasImage: true,
        },
      },
    });
    expect(html).not.toContain("Explore our projects");
    expect(html).not.toContain('href="/projects/example"');
  });

  test("allows the button to be absent", () => {
    const html = renderHero(createHero({ button: null }));
    expect(html).not.toContain("Explore our projects");
    expect(html).toContain("Restoring ecosystems together");
  });

  test("static cue links to the next section without bouncing", () => {
    const html = renderHero(createHero());
    expect(html).toContain('href="#learn-more"');
    expect(html).toContain("Scroll to learn more");
    expect(html).not.toContain("animate-bounce");
  });

  test("animated cue only bounces when motion preferences allow it", () => {
    const html = renderHero(createHero({ scrollCue: "animated" }));
    expect(html).toContain("motion-safe:animate-bounce");
    expect(html).toContain('href="#learn-more"');
  });

  test("hiding the cue leaves the button visible", () => {
    const html = renderHero(createHero({ scrollCue: "hidden" }));
    expect(html).not.toContain("Scroll to learn more");
    expect(html).not.toContain('href="#learn-more"');
    expect(html).toContain('href="/projects"');
  });

  test("preserves the existing hero until CMS content is available", () => {
    const html = renderHero(null);
    expect(html).toContain("Regenerating ecosystems from the <em>Soil Up</em>");
    expect(html).toContain(
      "Developing projects for nature, people and climate"
    );
    expect(html).toContain("Learn More");
  });

  test("incomplete image alt text cannot replace the existing hero", () => {
    const hero = createHero();
    const html = renderHero({
      ...hero,
      image: { ...hero.image, altContent: " " },
    });
    expect(html).toContain("Regenerating ecosystems from the <em>Soil Up</em>");
    expect(html).not.toContain("Restoring ecosystems together");
  });
});
