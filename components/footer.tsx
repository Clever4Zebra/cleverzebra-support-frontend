export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Knowledgebase. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Powered by Laravel &amp; Next.js
        </p>
      </div>
    </footer>
  );
}
