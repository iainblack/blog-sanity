
import * as demo from "@/sanity/lib/demo";
export function Intro(props: { title?: string; subtitle?: string; }) {
    const title = props.title || demo.title;
    return (
        <section className="flex items-center">
            <div className="flex flex-col items-left">
                <h1 className="header-text">
                    {title || demo.title}
                </h1>
                {props.subtitle &&
                    <h2 className="text-center body-text mt-3 text-gray-600">
                        {props.subtitle}
                    </h2>}
            </div>
        </section>
    );
}