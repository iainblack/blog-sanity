import "@/styles/globals.css";

export default function PreferencesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-[80vh]">
            {children}
        </section>
    )
}
