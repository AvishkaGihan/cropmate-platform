import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Leaf,
  Sprout,
  ShoppingBag,
  Truck,
} from "lucide-react";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Enhanced with better typography and gradient */}
      <section className="relative h-[650px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/30 z-10" />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
        <div className="container mx-auto relative z-20 flex h-full items-center">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Leaf className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-white font-medium">
                Farm to Table, Simplified
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
              Connecting Farmers <br />
              <span className="text-primary">with Vendors</span>
            </h1>

            <p className="text-lg text-white/90 max-w-lg">
              Cropmate is the platform that bridges the gap between farmers and
              vendors, ensuring fresh produce reaches markets efficiently with
              transparent pricing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/crops">
                  Browse Crops <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <Link href="/register">Join Our Network</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced with icons and better cards */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-2">Our Process</p>
            <h2 className="text-4xl font-bold mb-4">How Cropmate Works</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Our simple three-step process connects farmers directly with
              vendors, eliminating middlemen and ensuring the freshest produce
              at the best prices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Farmers List Crops",
                description:
                  "Farmers can easily list their available crops with details like price, quantity, and harvest dates.",
                icon: <Sprout className="h-8 w-8 text-primary" />,
                benefits: [
                  "Simple crop management",
                  "Direct pricing control",
                  "Harvest tracking",
                ],
              },
              {
                title: "Vendors Purchase",
                description:
                  "Vendors browse available crops, select what they need, and place orders with secure payment options.",
                icon: <ShoppingBag className="h-8 w-8 text-primary" />,
                benefits: [
                  "Access to fresh produce",
                  "Transparent pricing",
                  "Quality assurance",
                ],
              },
              {
                title: "Drivers Deliver",
                description:
                  "Verified drivers pick up the produce and deliver it to vendors with real-time tracking.",
                icon: <Truck className="h-8 w-8 text-primary" />,
                benefits: [
                  "Optimized routes",
                  "Timely delivery",
                  "Temperature control",
                ],
              },
            ].map((item, index) => (
              <div
                key={index}
                className="border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <ul className="space-y-2">
                  {item.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - New addition */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5,000+", label: "Farmers Registered" },
              { value: "12,000+", label: "Crops Listed" },
              { value: "3,500+", label: "Vendors Active" },
              { value: "50+", label: "Regions Covered" },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <p className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - New addition */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to transform how you source or sell crops?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of farmers and vendors already using Cropmate to
              streamline their agricultural business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/register">Create an Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
