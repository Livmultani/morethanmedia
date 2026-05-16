import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneCall, Heart, Globe, ArrowRight, Share2, Mail, LifeBuoy, CheckCircle, AlertCircle, Loader2, Lock, Eye, Users, Shield, Sprout, ExternalLink } from "lucide-react";
import { SiInstagram } from "react-icons/si";

interface PostMedia { type: "image" | "video" | "link"; url: string; caption?: string; }
interface Post { id: string; title: string; content: string; media: PostMedia[]; createdAt: string; }

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function PostMediaBlock({ media }: { media: PostMedia[] }) {
  if (!media?.length) return null;
  return (
    <div className="space-y-3 mt-1">
      {media.map((item, i) => {
        if (item.type === "image") {
          return (
            <figure key={i} className="rounded-xl overflow-hidden">
              <img src={item.url} alt={item.caption || "Post image"} className="w-full object-cover max-h-[400px]" loading="lazy" />
              {item.caption && <figcaption className="text-xs text-muted-foreground mt-1 px-1">{item.caption}</figcaption>}
            </figure>
          );
        }
        if (item.type === "video") {
          const ytId = getYouTubeId(item.url);
          if (ytId) {
            return (
              <div key={i} className="rounded-xl overflow-hidden aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title={item.caption || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            );
          }
          return (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline">
              {item.caption || item.url}
            </a>
          );
        }
        if (item.type === "link") {
          return (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-4 rounded-xl border border-border/60 bg-secondary/10 hover:bg-secondary/20 transition-colors group">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {item.caption || item.url}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{item.url}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
            </a>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function Home() {
  const [helpForm, setHelpForm] = useState({ name: "", contact: "", message: "" });
  const [helpStatus, setHelpStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [touchForm, setTouchForm] = useState({ name: "", email: "", message: "" });
  const [touchStatus, setTouchStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => setPosts(data))
      .catch(() => {});
  }, []);

  async function handleTouchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!touchForm.name || !touchForm.email || !touchForm.message) return;
    setTouchStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: touchForm.name, contact: touchForm.email, message: touchForm.message }),
      });
      if (res.ok) {
        setTouchStatus("sent");
        setTouchForm({ name: "", email: "", message: "" });
      } else {
        setTouchStatus("error");
      }
    } catch {
      setTouchStatus("error");
    }
  }

  async function handleHelpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!helpForm.name || !helpForm.contact || !helpForm.message) return;
    setHelpStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(helpForm),
      });
      if (res.ok) {
        setHelpStatus("sent");
        setHelpForm({ name: "", contact: "", message: "" });
      } else {
        setHelpStatus("error");
      }
    } catch {
      setHelpStatus("error");
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const navLinks = [
    { label: "About", id: "about" },
    { label: "The Issue", id: "issue" },
    { label: "Stories", id: "stories" },
    { label: "Resources", id: "resources" },
    { label: "Get Help", id: "gethelp" },
    { label: "Get Involved", id: "involved" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 group"
            data-testid="nav-logo"
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-10 h-10 shrink-0">
              <defs>
                <clipPath id="kiss-clip-nav">
                  <ellipse cx="100" cy="108" rx="51" ry="65"/>
                </clipPath>
              </defs>
              <circle cx="172.0" cy="108.0" r="6" fill="#DC889D" opacity="0.88"/><circle cx="170.4" cy="126.3" r="6" fill="#DC889D" opacity="0.88"/><circle cx="165.8" cy="143.9" r="6" fill="#DC889D" opacity="0.88"/><circle cx="158.3" cy="159.8" r="6" fill="#DC889D" opacity="0.88"/><circle cx="148.2" cy="173.4" r="6" fill="#DC889D" opacity="0.88"/><circle cx="136.0" cy="184.2" r="6" fill="#DC889D" opacity="0.88"/><circle cx="122.3" cy="191.8" r="6" fill="#DC889D" opacity="0.88"/><circle cx="107.5" cy="195.5" r="6" fill="#DC889D" opacity="0.88"/><circle cx="92.5" cy="195.5" r="6" fill="#DC889D" opacity="0.88"/><circle cx="77.7" cy="191.8" r="6" fill="#DC889D" opacity="0.88"/><circle cx="64.0" cy="184.2" r="6" fill="#DC889D" opacity="0.88"/><circle cx="51.8" cy="173.4" r="6" fill="#DC889D" opacity="0.88"/><circle cx="41.7" cy="159.8" r="6" fill="#DC889D" opacity="0.88"/><circle cx="34.2" cy="143.9" r="6" fill="#DC889D" opacity="0.88"/><circle cx="29.6" cy="126.3" r="6" fill="#DC889D" opacity="0.88"/><circle cx="28.0" cy="108.0" r="6" fill="#DC889D" opacity="0.88"/><circle cx="29.6" cy="89.7" r="6" fill="#DC889D" opacity="0.88"/><circle cx="34.2" cy="72.1" r="6" fill="#DC889D" opacity="0.88"/><circle cx="41.7" cy="56.2" r="6" fill="#DC889D" opacity="0.88"/><circle cx="51.8" cy="42.6" r="6" fill="#DC889D" opacity="0.88"/><circle cx="64.0" cy="31.8" r="6" fill="#DC889D" opacity="0.88"/><circle cx="77.7" cy="24.2" r="6" fill="#DC889D" opacity="0.88"/><circle cx="92.5" cy="20.5" r="6" fill="#DC889D" opacity="0.88"/><circle cx="107.5" cy="20.5" r="6" fill="#DC889D" opacity="0.88"/><circle cx="122.3" cy="24.2" r="6" fill="#DC889D" opacity="0.88"/><circle cx="136.0" cy="31.8" r="6" fill="#DC889D" opacity="0.88"/><circle cx="148.2" cy="42.6" r="6" fill="#DC889D" opacity="0.88"/><circle cx="158.3" cy="56.2" r="6" fill="#DC889D" opacity="0.88"/><circle cx="165.8" cy="72.1" r="6" fill="#DC889D" opacity="0.88"/><circle cx="170.4" cy="89.7" r="6" fill="#DC889D" opacity="0.88"/>
              <ellipse cx="100" cy="108" rx="67" ry="83" fill="white"/>
              <ellipse cx="100" cy="108" rx="62" ry="77" stroke="#DC889D" strokeWidth="1.5"/>
              <ellipse cx="100" cy="108" rx="53" ry="67" stroke="#DC889D" strokeWidth="1" strokeDasharray="2.5 3.5"/>
              <image href="/kiss-mark.jpg" x="49" y="43" width="102" height="130" clipPath="url(#kiss-clip-nav)" preserveAspectRatio="xMidYMid meet"/>
            </svg>
            <span className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              More Than Media
            </span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                data-testid={`nav-link-${link.id}`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <a
            href="https://instagram.com/livmultani"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/70 transition-colors"
            data-testid="nav-instagram"
          >
            <SiInstagram className="w-4 h-4" />
            @livmultani
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background z-0" />
        
        <div className="container relative z-10 mx-auto text-center max-w-4xl pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p variants={fadeIn} className="text-primary font-medium tracking-widest uppercase text-sm md:text-base">
              2026 Miss Teen Queen Canada Delegate
            </motion.p>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold leading-tight text-foreground">
              More Than Media
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              A platform dedicated to breaking the silence around eating disorders, fostering recovery, and creating a world where every teen feels seen, safe, and supported.
            </motion.p>
            <motion.div variants={fadeIn} className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-full px-8 text-base h-14" onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}>
                Find Support Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-14 bg-background/50 backdrop-blur-sm" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md mx-auto rounded-[2rem] aspect-[3/4] bg-gradient-to-br from-primary/20 via-secondary to-primary/10 flex flex-col items-center justify-center gap-4 shadow-xl border border-primary/10">
                <Heart className="w-16 h-16 text-primary/50" />
                <p className="text-primary/60 font-medium text-lg text-center px-8">Liv Multani<br/><span className="text-sm font-normal text-muted-foreground">2026 Miss Teen Queen Canada Delegate</span></p>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-serif text-foreground">
                My Promise
              </motion.h2>
              <motion.div variants={fadeIn} className="w-12 h-1 bg-primary rounded-full" />
              <motion.div variants={fadeIn} className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Hi, I'm Liv Multani. As your 2026 Miss Teen Queen Canada Delegate, I'm using my platform to shine a light on something that thrives in the dark: eating disorders.
                </p>
                <p>
                  For too long, the conversation around body image and eating disorders has been wrapped in shame. I want to change that. I've seen firsthand how these illnesses can steal the joy and potential from incredible young people. It doesn't discriminate. It doesn't care about your background, your gender, or your successes.
                </p>
                <p>
                  This campaign isn't just about awareness; it's about action, compassion, and reminding every single person struggling that their life is worth living fully. You are worthy of recovery.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center space-y-4 mb-16"
          >
            <motion.p variants={fadeIn} className="text-primary font-medium tracking-widest uppercase text-sm">Why More Than Media</motion.p>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-serif text-foreground">Different by Design</motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Most eating disorder programs start when things have already gone wrong. We start earlier — with the stories we're all being told.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Eye className="w-6 h-6 text-primary" />,
                title: "Media Literacy at the Root",
                body: "Other programs treat the symptoms. We tackle the cause — the filtered feeds, diet culture, and impossible ideals that plant the seed long before a disorder develops.",
              },
              {
                icon: <Users className="w-6 h-6 text-primary" />,
                title: "Peer-to-Peer, Not Top-Down",
                body: "I'm a teen myself — I'm not speaking at you from a podium or a clinic. I'm speaking with you, because I'm living in the same world you are.",
              },
              {
                icon: <Sprout className="w-6 h-6 text-primary" />,
                title: "Prevention Over Intervention",
                body: "We reach you before it becomes a crisis — while there's still space to interrupt the narrative, not just after it's already taken hold.",
              },
              {
                icon: <PhoneCall className="w-6 h-6 text-primary" />,
                title: "Fast to Reach You",
                body: "When you message us, you hear back fast — not in a week, not buried in a queue. I know that when someone reaches out, the window matters. I take that seriously.",
              },
              {
                icon: <Heart className="w-6 h-6 text-primary" />,
                title: "You Are Not a Number",
                body: "There's no intake form. No case number. No waiting list. You're a person, and I want to hear your story — not process it.",
              },
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "Shame-Free by Default",
                body: "No scare tactics. No before-and-after framing. No clinical detachment. Just honest conversations and the reminder that struggling doesn't make you broken.",
              },
              {
                icon: <Globe className="w-6 h-6 text-primary" />,
                title: "Canadian Context",
                body: "Built for Canadian teens, with Canadian resources and a community that reflects where we actually live — not just American helplines and American stats.",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className="h-full border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Issue Section */}
      <section id="issue" className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">The Reality</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Eating disorders are serious, life-threatening illnesses. But they are also treatable.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: "1 Million+", desc: "Canadians meet the diagnostic criteria for an eating disorder at any given time." },
              { stat: "All Ages", desc: "Eating disorders affect people of all genders, ages, races, and socioeconomic backgrounds." },
              { stat: "Highest", desc: "Eating disorders have the highest mortality rate of any mental illness." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
              >
                <Card className="h-full border-none shadow-sm bg-secondary/20 hover:bg-secondary/40 transition-colors">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="text-4xl font-serif font-bold text-primary">{item.stat}</div>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Stories */}
      <section id="stories" className="py-24 px-4 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">It's Never Just About Food</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Eating disorders are symptoms of something deeper. Here are some of the ways they can really take root.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                root: "When life feels out of control",
                tag: "Control",
                body: "If everything around you is unpredictable — a family falling apart, a situation you can't change, emotions that feel too big to hold — controlling what you eat can feel like the one thing that's actually yours. It's not about food. It's about needing somewhere safe to put your power when everything else has been taken from you.",
                whisper: "\"This is the one thing I can decide.\""
              },
              {
                root: "When you don't feel like you're enough",
                tag: "Self-Worth",
                body: "Sometimes the disorder speaks in a very specific voice: if you were smaller, better, more disciplined, then you'd deserve good things. Restricting or purging becomes a way of punishing yourself back into worth. The cruelest part is that it never works — the bar just keeps moving. The hunger isn't really for less food. It's for the feeling that you matter.",
                whisper: "\"Maybe if I'm smaller, I'll finally be enough.\""
              },
              {
                root: "When you need to feel something — or nothing",
                tag: "Numbing & Pain",
                body: "For some people, food becomes the only place they know how to feel. Bingeing can be a wave that drowns out anxiety, grief, or loneliness — even just for a little while. For others, the numbness of restriction is the point. Either way, the eating isn't the problem. It's the answer to a problem that hasn't been named yet. And that problem deserves real care.",
                whisper: "\"At least when I eat, I stop feeling everything else.\""
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="flex"
              >
                <Card className="h-full border-border/50 bg-background/80 backdrop-blur shadow-sm flex flex-col">
                  <CardContent className="p-8 space-y-5 flex flex-col flex-1">
                    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                      {item.tag}
                    </span>
                    <h3 className="text-xl font-serif text-foreground leading-snug">{item.root}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed flex-1">
                      {item.body}
                    </p>
                    <p className="text-sm italic text-primary/70 pt-3 border-t border-border/40">
                      {item.whisper}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="bg-primary/10 rounded-[2.5rem] p-8 md:p-16"
          >
            <motion.div variants={fadeIn} className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif text-foreground">You Don't Have to Do This Alone</h2>
              <p className="text-muted-foreground text-lg">Reach out to these trusted organizations for support, information, and guidance.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  name: "NEDIC",
                  desc: "National Eating Disorder Information Centre",
                  link: "nedic.ca",
                  icon: <Heart className="w-6 h-6 text-primary" />
                },
                {
                  name: "Kids Help Phone",
                  desc: "Call 1-800-668-6868 or text CONNECT to 686868",
                  link: "kidshelpphone.ca",
                  icon: <PhoneCall className="w-6 h-6 text-primary" />
                },
                {
                  name: "Beat",
                  desc: "International eating disorder support",
                  link: "beateatingdisorders.org.uk",
                  icon: <Globe className="w-6 h-6 text-primary" />
                },
                {
                  name: "CAMH",
                  desc: "Centre for Addiction and Mental Health",
                  link: "camh.ca",
                  icon: <Heart className="w-6 h-6 text-primary" />
                }
              ].map((resource, i) => (
                <motion.a
                  key={i}
                  href={`https://${resource.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeIn}
                  className="flex items-start gap-4 p-6 bg-background rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border/50 group"
                >
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{resource.desc}</p>
                    <span className="text-primary text-sm font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Visit Website <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get Help Section */}
      <section id="gethelp" className="py-24 px-4 bg-primary/5 border-t border-border/40">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6 text-center mb-16"
          >
            <motion.div variants={fadeIn} className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <LifeBuoy className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-serif text-foreground">
              You Don't Have to Figure It Out Alone
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              This space is for anyone going through anything — an eating disorder, anxiety, a hard situation at home, something you can't name yet. Whatever it is, it matters. Reach out and someone will get back to you.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Reach Out Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Card className="border-none shadow-xl bg-background">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-foreground">Share What's Going On</h3>
                    <p className="text-sm text-muted-foreground">No judgment. No pressure. Just a safe place to be heard.</p>
                  </div>
                  {helpStatus === "sent" ? (
                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                      <h4 className="text-xl font-serif text-foreground">Message received.</h4>
                      <p className="text-muted-foreground text-sm max-w-xs">
                        Thank you for reaching out. Your message has been sent privately and someone will get back to you soon.
                      </p>
                      <Button variant="outline" className="rounded-full mt-2" onClick={() => setHelpStatus("idle")} data-testid="help-send-another">
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleHelpSubmit}>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your name (or a nickname is fine)</label>
                        <Input
                          placeholder="Whatever you're comfortable with"
                          className="bg-secondary/10"
                          data-testid="help-input-name"
                          value={helpForm.name}
                          onChange={(e) => setHelpForm((f) => ({ ...f, name: e.target.value }))}
                          disabled={helpStatus === "sending"}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">How can we reach you back?</label>
                        <Input
                          placeholder="Email or Instagram handle"
                          className="bg-secondary/10"
                          data-testid="help-input-contact"
                          value={helpForm.contact}
                          onChange={(e) => setHelpForm((f) => ({ ...f, contact: e.target.value }))}
                          disabled={helpStatus === "sending"}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">What's going on?</label>
                        <Textarea
                          placeholder="You can share as much or as little as you want. There's no wrong way to say it."
                          className="min-h-[140px] bg-secondary/10"
                          data-testid="help-input-message"
                          value={helpForm.message}
                          onChange={(e) => setHelpForm((f) => ({ ...f, message: e.target.value }))}
                          disabled={helpStatus === "sending"}
                        />
                      </div>
                      {helpStatus === "error" && (
                        <div className="flex items-center gap-2 text-sm text-red-500">
                          <AlertCircle className="w-4 h-4" />
                          Something went wrong. Please try again or DM on Instagram.
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="w-full rounded-full h-12 text-base"
                        data-testid="help-submit"
                        disabled={helpStatus === "sending"}
                      >
                        {helpStatus === "sending" ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                        ) : "Send My Message"}
                      </Button>
                    </form>
                  )}
                  {helpStatus !== "sent" && (
                    <p className="text-xs text-muted-foreground text-center">
                      Your message is private. We read every single one.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Immediate Resources */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-4"
            >
              <motion.h3 variants={fadeIn} className="text-xl font-semibold text-foreground mb-6">
                Need to talk to someone right now?
              </motion.h3>
              {[
                {
                  name: "Kids Help Phone",
                  desc: "24/7 — call or text for any reason, any age under 29",
                  contact: "Call or text 686868",
                  color: "bg-rose-50 border-rose-100"
                },
                {
                  name: "Crisis Services Canada",
                  desc: "Immediate support for anyone in emotional distress or suicidal crisis",
                  contact: "1-833-456-4566",
                  color: "bg-purple-50 border-purple-100"
                },
                {
                  name: "Talk Suicide Canada",
                  desc: "Confidential support any time, day or night",
                  contact: "1-833-456-4566 / text 45645",
                  color: "bg-blue-50 border-blue-100"
                },
                {
                  name: "Trans Lifeline",
                  desc: "Peer support for trans and questioning people",
                  contact: "1-877-330-6366",
                  color: "bg-amber-50 border-amber-100"
                },
                {
                  name: "NEDIC Helpline",
                  desc: "Eating disorder support, information & referrals",
                  contact: "1-866-NEDIC-20",
                  color: "bg-green-50 border-green-100"
                }
              ].map((resource, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className={`p-4 rounded-xl border ${resource.color} flex justify-between items-start gap-4`}
                >
                  <div>
                    <p className="font-semibold text-foreground text-sm">{resource.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{resource.desc}</p>
                  </div>
                  <span className="text-xs font-medium text-primary whitespace-nowrap pt-0.5">{resource.contact}</span>
                </motion.div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                If you are in immediate danger, call 911.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Updates Section */}
      {posts.length > 0 && (
        <section id="updates" className="py-24 px-4 bg-background border-t border-border/40">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-4 text-center mb-12"
            >
              <motion.h2 variants={fadeIn} className="text-4xl font-serif text-foreground">Updates</motion.h2>
              <motion.p variants={fadeIn} className="text-muted-foreground">Thoughts, news, and moments from the campaign.</motion.p>
            </motion.div>
            <div className="space-y-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card className="border-border/50">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-serif text-foreground leading-snug">{post.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap pt-1">
                          {new Date(post.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                      <PostMediaBlock media={post.media} />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Get Involved & Contact */}
      <section id="involved" className="py-24 px-4 bg-secondary/20 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn} className="space-y-4">
                <h2 className="text-4xl font-serif text-foreground">Join the Movement</h2>
                <p className="text-lg text-muted-foreground">
                  Awareness spreads when we raise our voices together. Here's how you can help support the campaign and make a difference in your community.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Share the Message</h4>
                    <p className="text-sm text-muted-foreground">Use #MoreThanMedia to spread awareness.</p>
                  </div>
                </div>
                <a
                  href="https://instagram.com/livmultani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                  data-testid="link-instagram-personal"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <SiInstagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Follow on Instagram</h4>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">@livmultani</p>
                  </div>
                </a>
                <a
                  href="https://instagram.com/more.thanmedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                  data-testid="link-instagram-business"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <SiInstagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">More Than Media</h4>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">@more.thanmedia</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Host an Event</h4>
                    <p className="text-sm text-muted-foreground">Reach out to bring this campaign to your school.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Card className="border-none shadow-xl bg-background">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif text-foreground">Get in Touch</h3>
                    <p className="text-sm text-muted-foreground">Want to collaborate or share your story? Send a message.</p>
                  </div>
                  
                  {touchStatus === "sent" ? (
                    <div className="flex flex-col items-center gap-4 py-6 text-center">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                      <h4 className="text-lg font-serif text-foreground">Message sent!</h4>
                      <p className="text-muted-foreground text-sm max-w-xs">Thanks for reaching out. I'll get back to you soon.</p>
                      <Button variant="outline" className="rounded-full mt-1" onClick={() => setTouchStatus("idle")}>Send another</Button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleTouchSubmit}>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input placeholder="Your name" className="bg-secondary/10" value={touchForm.name} onChange={(e) => setTouchForm((f) => ({ ...f, name: e.target.value }))} disabled={touchStatus === "sending"} data-testid="touch-input-name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="Your email" className="bg-secondary/10" value={touchForm.email} onChange={(e) => setTouchForm((f) => ({ ...f, email: e.target.value }))} disabled={touchStatus === "sending"} data-testid="touch-input-email" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea placeholder="How can we help?" className="min-h-[120px] bg-secondary/10" value={touchForm.message} onChange={(e) => setTouchForm((f) => ({ ...f, message: e.target.value }))} disabled={touchStatus === "sending"} data-testid="touch-input-message" />
                      </div>
                      {touchStatus === "error" && (
                        <div className="flex items-center gap-2 text-sm text-red-500"><AlertCircle className="w-4 h-4" />Something went wrong. Try again or DM on Instagram.</div>
                      )}
                      <Button type="submit" className="w-full rounded-full h-12 text-base" disabled={touchStatus === "sending"} data-testid="touch-submit">
                        {touchStatus === "sending" ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-background border-t border-border text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-6 mb-4 flex-wrap">
          <a
            href="https://instagram.com/livmultani"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/70 transition-colors"
            data-testid="footer-link-instagram-personal"
          >
            <SiInstagram className="w-5 h-5" />
            <span className="text-sm font-medium">@livmultani</span>
          </a>
          <span className="text-border">·</span>
          <a
            href="https://instagram.com/more.thanmedia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/70 transition-colors"
            data-testid="footer-link-instagram-business"
          >
            <SiInstagram className="w-5 h-5" />
            <span className="text-sm font-medium">More Than Media</span>
          </a>
        </div>
        <p className="text-sm">
          © 2026 Liv Multani — Miss Teen Queen Canada Delegate. All rights reserved.
        </p>
        <p className="text-xs mt-2 max-w-xl mx-auto">
          If you or someone you know is in immediate crisis, please go to your nearest emergency room or call 911.
        </p>
        <div className="mt-6 pt-6 border-t border-border/40">
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            data-testid="footer-admin-link"
          >
            <Lock className="w-3 h-3" />
            Admin
          </a>
        </div>
      </footer>
    </div>
  );
}
