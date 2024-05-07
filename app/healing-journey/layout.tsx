import "@/styles/globals.css";

export default function JourneyLayout({
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
