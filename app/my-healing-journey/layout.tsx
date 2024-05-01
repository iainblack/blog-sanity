import "@/styles/globals.css";

export default function JourneyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
        </section>
    )
}
