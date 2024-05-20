import "@/styles/globals.css";

export default function PreferencesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <section className="flex-grow">
                {children}
            </section>
        </div>
    )
}
