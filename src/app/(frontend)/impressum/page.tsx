import type { Metadata } from "next";
import { ObfuscatedEmail } from "@/components/shared/obfuscated-email";
import PageHeader from "@/components/shared/page-header";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";

export const metadata: Metadata = generateMetadataHelper({
  title: "Impressum",
  description: "Legal information about Terrapreta.",
  url: "/impressum",
});

export default function ImpressumPage() {
  return (
    <>
      <PageHeader title="Impressum" />
      <div className="container-article px-5 py-20">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-4 font-bold text-xl">
              Terrapreta SRL Società Benefit
            </h2>
          </section>

          <section>
            <h3 className="mb-2 font-bold">Email</h3>
            <p>
              <ObfuscatedEmail
                display="mail@terrapreta.it"
                domain="terrapreta.it"
                local="mail"
              />
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-bold">Certified Email (PEC)</h3>
            <p>
              <ObfuscatedEmail
                display="pec@srlc.terrapreta.it"
                domain="srlc.terrapreta.it"
                local="pec"
              />
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-bold">Registered Office</h3>
            <p className="whitespace-pre-line">
              {"Via Valparaiso 11\n20144 Milano MI\nItaly"}
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-bold">VAT Number and Tax Code</h3>
            <p>13083330962</p>
          </section>

          <section>
            <h3 className="mb-2 font-bold">REA Registration Number</h3>
            <p>MI - 2702314</p>
          </section>

          <section>
            <h3 className="mb-2 font-bold">Share Capital</h3>
            <p>€ 10.000,00, fully paid-in</p>
          </section>
        </div>
      </div>
    </>
  );
}
