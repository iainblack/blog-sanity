import { sanityFetch } from "@/sanity/lib/fetch";
import { SettingsQueryResponse, settingsQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import MessageForm from "./MessageForm";
import SignUpForm from "./SignUpForm";


export default async function Footer() {
    const data = await sanityFetch<SettingsQueryResponse>({
        query: settingsQuery,
    });

    return (
        <footer className="border-t border-black bg-dark-bg">
            <div className="px-5 py-12 flex justify-center items-center text-center">
                <form className="w-full max-w-sm">
                    <SignUpForm />
                    <hr className="my-5" />
                    <label className="text-xs text-white" htmlFor="email">
                        Never miss a post! Sign up to get email notifications.
                    </label>
                </form>
            </div >
        </footer >
    );
}