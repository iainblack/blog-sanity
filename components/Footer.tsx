import { sanityFetch } from "@/sanity/lib/fetch";
import { SettingsQueryResponse, settingsQuery } from "@/sanity/lib/queries";
import SignUpForm from "./SignUpForm";
import Link from "next/link";


export default async function Footer() {
    const data = await sanityFetch<SettingsQueryResponse>({
        query: settingsQuery,
    });

    return (
        <footer className="border-t border-black bg-dark-bg">
            <div className="px-5 py-12 flex justify-center items-center text-center">
                <div className="w-full max-w-sm">
                    <SignUpForm />
                    <hr className="my-5" />
                    <div className="flex flex-col space-y-2">
                        <label className="text-xs text-white" htmlFor="email">
                            Never miss a post! Sign up to get email notifications.
                        </label>
                        <div className="text-xs text-white flex justify-center">
                            Already subscribed? <Link href="/manage-email-preferences"><p className="text-contrast-bg ml-2">Manage preferences</p></Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    );
}