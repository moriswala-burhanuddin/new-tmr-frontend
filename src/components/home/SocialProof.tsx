import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialProofProps {
    links?: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
        linkedin?: string;
        youtube?: string;
    };
}

const SocialProof = ({ links }: SocialProofProps) => {
    const socials = [
        { name: 'Facebook', icon: <Facebook className="w-8 h-8" />, followers: '50K+', link: links?.facebook || '#' },
        { name: 'Instagram', icon: <Instagram className="w-8 h-8" />, followers: '120K+', link: links?.instagram || '#' },
        { name: 'TikTok', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>, followers: '85K+', link: links?.tiktok || '#' },
        { name: 'LinkedIn', icon: <Linkedin className="w-8 h-8" />, followers: '30K+', link: links?.linkedin || '#' },
        { name: 'YouTube', icon: <Youtube className="w-8 h-8" />, followers: '200K+', link: links?.youtube || '#' },
    ];

    return (

        <section className="bg-[#121212] py-20 border-t border-[#333] relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter font-display mb-4">
                        Connect With Us
                    </h2>
                    <p className="text-lg text-[#AAAAAA]">Join thousands of professionals across our platforms</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {socials.map((social, index) => (
                        <motion.a
                            key={social.name}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[180px] flex flex-col pt-6"
                        >
                            {/* Top Border with Small Tab */}
                            <div className="absolute top-0 left-0 w-full h-6 flex items-end">
                                <div className="h-[2px] flex-1 bg-[#444] group-hover:bg-[#C41E3A] transition-colors"></div>
                                <div className="relative w-20 h-full -mb-[2px]">
                                    <div className="absolute inset-0 bg-[#444] group-hover:bg-[#C41E3A] transition-colors" style={{ clipPath: 'polygon(25% 0, 75% 0, 100% 100%, 0% 100%)' }}></div>
                                    <div className="absolute inset-[2px] bottom-0 bg-[#121212]" style={{ clipPath: 'polygon(25% 0, 75% 0, 100% 100%, 0% 100%)' }}></div>
                                </div>
                                <div className="h-[2px] flex-1 bg-[#444] group-hover:bg-[#C41E3A] transition-colors"></div>
                            </div>

                            {/* Main Card */}
                            <div className="flex-1 border-x-2 border-b-2 border-[#333] bg-[#1A1A1A] group-hover:border-[#C41E3A] transition-all duration-300 flex flex-col items-center justify-center p-6 relative overflow-hidden">

                                {/* Screw decorations */}
                                <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#333]"></div>
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#333]"></div>
                                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#333]"></div>
                                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#333]"></div>

                                {/* Corner Accents */}
                                <div className="absolute bottom-0 left-0 w-3 h-[2px] bg-[#C41E3A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 w-[2px] h-3 bg-[#C41E3A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 right-0 w-3 h-[2px] bg-[#C41E3A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 right-0 w-[2px] h-3 bg-[#C41E3A] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* Icon */}
                                <div className="mb-4 text-[#888] group-hover:text-[#C41E3A] transition-colors transform group-hover:scale-110 duration-300">
                                    {social.icon}
                                </div>

                                {/* Followers */}
                                <span className="font-bold text-2xl text-white mb-1 font-display">{social.followers}</span>

                                {/* Platform Name */}
                                <span className="text-sm text-[#AAAAAA] group-hover:text-white uppercase tracking-wider font-display transition-colors">{social.name}</span>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
