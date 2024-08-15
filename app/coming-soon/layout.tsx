
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="bg-default-bg text-text-primary">
            <body>
                <section className="min-h-screen flex flex-col">
                    {children}
                </section>
            </body>
        </html>
    );
}