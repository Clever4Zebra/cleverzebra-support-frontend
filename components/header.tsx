import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  // { href: "/articles", label: "Articles" },
  // { href: "/categories", label: "Categories" },
  // { href: "/walkthroughs", label: "Walkthroughs" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center px-6">
        <Link href="/" className="mr-8 font-heading text-xl font-bold tracking-tight text-primary">
          Knowledgebase
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
