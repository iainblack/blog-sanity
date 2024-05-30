import MessageForm from "@/components/MessageForm";


export default function Page() {
    return (
        <div className="container mx-auto lg:flex lg:flex-row lg:justify-between lg:px-16">
            <div className="my-6 lg:my-12">
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