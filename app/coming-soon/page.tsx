import { redirect } from "next/navigation";

export default function ComingSoon() {

    const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON;

    if (comingSoon === 'false') {
        redirect('/');
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h1>Coming Soon</h1>
                <p>We’re working hard to bring you a new experience. Stay tuned!</p>
            </div>
        </div>
    );
}