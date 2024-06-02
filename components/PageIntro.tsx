
import * as demo from "@/sanity/lib/demo";
export function Intro(props: { title?: string; subtitle?: string; }) {
    const title = props.title || demo.title;
    return (
        <section className="flex items-center w-full px-2 md:px-0">
            <div className="flex flex-col w-full items-center sm:items-start">
                <h1 className="header-text">
                    {title || demo.title}
                </h1>
                {props.subtitle &&
                    <h2 className="body-text mt-3 text-gray-600">
                        {props.subtitle}
                    </h2>}
            </div>
        </section>
    );
}