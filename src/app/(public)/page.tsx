import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
        <div className="container mx-auto relative z-20 flex h-full items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-bold text-white">
              Connecting Farmers with Vendors
            </h1>
            <p className="text-lg text-white/90">
              Cropmate is the platform that bridges the gap between farmers and
              vendors, ensuring fresh produce reaches markets efficiently.
            </p>
            <div className="flex space-x-4">
              <Button asChild size="lg">
                <Link href="/crops">Browse Crops</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/register">Join Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works </h2>
            <p className="text-muted-foreground mt-2">
              Simple steps to get fresh produce from farm to market
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Farmers List Crops",
                description:
                  "Farmers can easily list their available crops with details like price, quantity, and location.",
                icon: "🌱",
              },
              {
                title: "Vendors Purchase",
                description:
                  "Vendors browse available crops, select what they need, and place orders directly.",
                icon: "🛒",
              },
              {
                title: "Drivers Deliver",
                description:
                  "Verified drivers pick up the produce and deliver it to the vendors efficiently.",
                icon: "🚚",
              },
            ].map((item, index) => (
              <div key={index} className="border rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
