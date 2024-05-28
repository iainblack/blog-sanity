
import * as demo from "@/sanity/lib/demo";
export function Intro(props: { title?: string; subtitle?: string; }) {
    const title = props.title || demo.title;
    return (
        <section className="flex justify-center items-center">
            <div className="flex flex-col items-center">
                <h1 className="header-text text-center">
                    {title || demo.title}
                </h1>
                {props.subtitle &&
                    <h2 className="subheader-text text-center body-text mt-3">
                        {props.subtitle}
                    </h2>}
            </div>
        </section>
    );
}