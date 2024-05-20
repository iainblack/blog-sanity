import "@/styles/globals.css";

export default function HumanityLayout({
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
