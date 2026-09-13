"use client";

import { Navbar } from "@/components/Navbar";

interface ChaupalEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  communities: string[];
  description: string;
}

const events: ChaupalEvent[] = [
  {
    id: "1",
    title: "Chaupal Joint Festival 2026",
    date: "October 15, 2026",
    location: "Multiple Locations",
    communities: ["Punjabi Sangat", "Ganesh Mandal", "Tamil Arts Sabha"],
    description:
      "A celebration bringing together three communities for cultural exchange and shared festivities.",
  },
  {
    id: "2",
    title: "Craft Showcase & Market",
    date: "November 2, 2026",
    location: "Nagaland",
    communities: [
      "Nagaland Weavers Collective",
      "Rajasthan Craft Guild",
      "Kashmir Handicraft Circle",
    ],
    description:
      "Annual market showcasing traditional crafts from artisan communities across India.",
  },
  {
    id: "3",
    title: "Community Stewards Summit",
    date: "December 10, 2026",
    location: "Virtual Event",
    communities: ["All 12 Communities"],
    description:
      "Quarterly gathering for community stewards to discuss governance, membership, and shared initiatives.",
  },
];

export default function Events() {
  return (
    <main className="flex-1">
      <Navbar />
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="label-caps text-saffron mb-2">Gatherings</p>
            <h1 className="mb-3">Chaupal Events</h1>
            <p className="text-warm-gray">
              Joint events and gatherings across the Chaupal network.
              Membership seals grant access to community-specific events.
            </p>
          </div>

          {/* Events list */}
          <div className="space-y-px">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-border-subtle p-6 hover:border-border-mid transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-lg font-semibold">{event.title}</h2>
                  <span className="label-caps shrink-0 mt-1">{event.date}</span>
                </div>

                <p className="text-sm text-ivory/60 mb-4">{event.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                  <div className="flex flex-wrap gap-2">
                    {event.communities.map((community, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-warm-gray border border-border-subtle px-2.5 py-1"
                      >
                        {community}
                      </span>
                    ))}
                  </div>
                  <span className="text-[12px] text-warm-gray/50 shrink-0 ml-4">
                    {event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* About section */}
          <div className="mt-12 border border-border-subtle p-6">
            <h2 className="text-lg font-semibold mb-3">About Chaupal Events</h2>
            <p className="text-sm text-ivory/60 mb-3">
              Chaupal events bring together members from different communities
              for cultural exchange, collaborative projects, and shared
              celebrations. Membership seals grant access to community-specific
              threads, group discounts, and event registrations.
            </p>
            <p className="text-[13px] text-warm-gray/60">
              Events are organized by community stewards and are open to
              verified seal holders.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}