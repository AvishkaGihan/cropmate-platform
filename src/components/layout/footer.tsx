const Footer = () => {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Cropmate Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
