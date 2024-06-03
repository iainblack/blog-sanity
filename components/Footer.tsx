import { sanityFetch } from "@/sanity/lib/fetch";
import SignUpForm from "./SignUpForm";
import Link from "next/link";


export default async function Footer() {

    return (
        <footer className="bg-dark-bg relative bottom-0 min-h-[20vh]">
            <div className="w-full px-5 py-12 flex flex-col">
                <div className="mx-auto">
                    <h1 className="text-center text-2xl text-text-contrast pb-5">Sign up for email alerts</h1>
                    <SignUpForm />
                    <div className="flex flex-col space-y-2 pt-8">
                        <div className="text-xs text-white flex text-center justify-center">
                            Already subscribed? <Link href="/manage-email-preferences"><p className="text-contrast-bg ml-2 hover:text-primary">Manage preferences</p></Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    );
}