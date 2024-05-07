import "@/styles/globals.css";

export default function AdditionalTopicsLayout({
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
