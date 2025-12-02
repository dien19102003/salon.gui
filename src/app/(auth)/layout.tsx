import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { CustomerProvider } from '@/context/customer-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const authBgImage = PlaceHolderImages.find(p => p.id === 'salon-intro-1');

    return (
        <CustomerProvider>
            <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        {children}
                    </div>
                </div>
                <div className="hidden bg-muted lg:block relative">
                    {authBgImage && (
                        <>
                            <Image
                                src={authBgImage.imageUrl}
                                alt={authBgImage.description}
                                data-ai-hint={authBgImage.imageHint}
                                width="1920"
                                height="1080"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-primary/80" />
                        </>
                    )}
                </div>
            </div>
        </CustomerProvider>
    );
}
