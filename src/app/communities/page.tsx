import { Navbar } from "@/components/Navbar";
import Link from "next/link";

type Community = {
  id: string;
  name: string;
  region: string;
  description: string;
  stewardName: string;
  memberCount: number;
  currentRoot: string | null;
};

async function getCommunities(): Promise<Community[]> {
  try {
    const res = await fetch("http://localhost:3000/api/communities", {
      cache: "no-store",
    });
    const data = await res.json();
    return data.communities || [];
  } catch {
    return [];
  }
}

export default async function CommunitiesPage() {
  const communities = await getCommunities();

  return (
    <main className="flex-1">
      <Navbar />
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="label-caps text-saffron mb-2">The Archive</p>
            <h1 className="mb-3">Community Directory</h1>
            <p className="text-warm-gray max-w-lg">
              Twelve independent communities. Each maintains its own private
              membership register and appoints its own steward.
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-px bg-border-subtle mb-10">
            <div className="bg-charcoal py-4 px-5">
              <span className="label-caps block mb-1">Communities</span>
              <span className="font-serif text-2xl font-bold">{communities.length}</span>
            </div>
            <div className="bg-charcoal py-4 px-5">
              <span className="label-caps block mb-1">Total Members</span>
              <span className="font-serif text-2xl font-bold">
                {communities.reduce((sum, c) => sum + c.memberCount, 0)}
              </span>
            </div>
            <div className="bg-charcoal py-4 px-5">
              <span className="label-caps block mb-1">Roots Published</span>
              <span className="font-serif text-2xl font-bold">
                {communities.filter((c) => c.currentRoot).length}
              </span>
            </div>
          </div>

          {/* Community grid */}
          <div className="grid md:grid-cols-2 gap-px bg-border-subtle">
            {communities.map((comm) => (
              <Link
                key={comm.id}
                href={"/communities/" + comm.id}
                className="bg-charcoal p-6 group hover:bg-charcoal-surface transition-colors duration-200 block"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold group-hover:text-saffron transition-colors duration-200">
                    {comm.name}
                  </h3>
                  <span className="label-caps mt-1 shrink-0 ml-4">{comm.region}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-warm-gray mb-5 line-clamp-2">
                  {comm.description}
                </p>

                {/* Bottom metadata */}
                <div className="flex items-center gap-6 pt-4 border-t border-border-subtle text-[12px]">
                  <div>
                    <span className="label-caps block mb-0.5">Members</span>
                    <span className="font-mono text-ivory/80">{comm.memberCount}</span>
                  </div>
                  <div>
                    <span className="label-caps block mb-0.5">Steward</span>
                    <span className="text-ivory/60">{comm.stewardName}</span>
                  </div>
                  <div className="ml-auto">
                    {comm.currentRoot ? (
                      <span className="public-badge">Root ✓</span>
                    ) : (
                      <span className="label-caps text-warm-gray/50">No root</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
