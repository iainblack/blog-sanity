import { sanityFetch } from "@/sanity/lib/fetch";
import SignUpForm from "./SignUpForm";
import Link from "next/link";


export default async function Footer() {

    return (
        <footer className="bg-dark-bg relative bottom-0 min-h-[20vh]">
            <div className="w-full px-5 py-12 flex flex-col">
                <div className="mx-auto">
                    <h1 className="text-center subheader-text text-text-contrast pb-5">Sign up for email alerts</h1>
                    <SignUpForm />
                    <div className="flex flex-col space-y-2 pt-8">
                        <div className="text-xl text-text-contrast flex text-center justify-center font-garamond leading-tight font-light">
                            Already subscribed? <Link href="/manage-email-preferences"><p className="text-contrast-bg ml-2 hover:text-primary">Manage preferences</p></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col ml-5 mb-5">
                <div className="text-lg text-text-contrast flex text-center font-garamond leading-tight font-light">
                    Website designed and created by{" "}
                    <Link href="https://iainblack.dev/" target="_blank">
                        <p className="text-contrast-bg pl-1 hover:text-primary">Iain Black</p>
                    </Link>{" "}
                </div>
            </div>
        </footer >
    );
}