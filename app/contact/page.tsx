import MessageForm from "@/components/MessageForm";


export default function Page() {
    return (
        <div className="mx-auto flex-col py-6 md:flex-row md:pt-12 md:flex md:justify-evenly">
            <div>
                <h1 className="header-text text-center">
                    Contact Me
                </h1>
                <p className="body-text text-center mt-3">
                    I would love to hear from you.
                </p>
            </div>
            <MessageForm />
        </div>
    );
}