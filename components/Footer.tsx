import { sanityFetch } from "@/sanity/lib/fetch";
import { SettingsQueryResponse, settingsQuery } from "@/sanity/lib/queries";
import { PortableTextBlock } from "next-sanity";
import MessageForm from "./MessageForm";


export default async function Footer() {
    const data = await sanityFetch<SettingsQueryResponse>({
        query: settingsQuery,
    });

    return (
        <footer className="border-t border-black bg-dark-bg">
            <div className="px-5 py-12 flex justify-center items-center text-center">
                <form className="w-full max-w-sm">
                    <div className="flex items-center">
                        <input className="w-full h-12 bg-white text-gray-600 border border-black py-3 px-4 leading-tight focus:outline-none focus:bg-white" type="email" placeholder="Email" aria-label="Email" />
                        <button className="two-tone-button-inverse whitespace-nowrap h-12" type="button">
                            Sign Up
                        </button>
                    </div>
                    <hr className="my-5" />
                    <label className="text-xs text-white" htmlFor="email">
                        Never miss a post! Sign up to get email notifications.
                    </label>
                </form>
            </div >
        </footer >
    );
}