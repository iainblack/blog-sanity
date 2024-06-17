import MessageForm from "@/components/MessageForm";


export default function Page() {
    const subtitle = `If you have a question or comment, I invite you to send it to me via this email link.  I will do my best to respond promptly to each email message I receive."  Underneath, that message, I'd suggest adding an additional paragraph that says: "If you would like to receive an email alert when I post each new blog post, I invite you to sign up below.  Be assured, I will not share your contact information with anyone, ever.`;

    return (
        <div className="container mx-auto lg:flex lg:flex-row lg:justify-between lg:px-16">
            <div className="my-6 lg:my-12">
                <h1 className="header-text text-center">
                    Contact Lou
                </h1>
                <p className="body-text text-center mt-6 max-w-2xl">
                    {subtitle}
                </p>
            </div>
            <MessageForm />
        </div>
    );
}