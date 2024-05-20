import { sanityFetch } from "@/sanity/lib/fetch";
import { ExternalLink, SettingsQueryResponse, externalLinksQuery, settingsQuery } from "@/sanity/lib/queries";
import SignUpForm from "./SignUpForm";
import Link from "next/link";
import LinkList from "./LinkList";


export default async function Footer() {
    const links = await sanityFetch<ExternalLink[]>({
        query: externalLinksQuery,
    });

    return (
        <footer className="border-t border-black bg-dark-bg relative bottom-0">
            <div className="w-full px-5 py-12 flex flex-col md:flex-row">
                <div className="md:w-1/2">
                    <div className="max-w-xs lg:max-w-sm pb-8 md:pb-0 md:mx-auto">
                        <h1 className=" text-left text-2xl text-text-contrast pb-5">Sign up for email alerts</h1>
                        <SignUpForm />
                        {/* <hr className="my-5" /> */}
                        <div className="flex flex-col space-y-2 pt-8">
                            <div className="text-xs text-white flex">
                                Already subscribed? <Link href="/manage-email-preferences"><p className="text-contrast-bg ml-2 hover:text-primary">Manage preferences</p></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:border-l opacity-30" />
                <div className="md:w-1/2">
                    <LinkList links={links} title="Recommended Resources" />
                </div>
            </div>
        </footer >
    );
}