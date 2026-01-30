import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hammer, ArrowLeft, Construction } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 overflow-hidden relative font-display">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-white select-none">404</div>
            </div>

            <div className="relative z-10 max-w-2xl w-full">
                <motion.div
                    className="border-2 border-[#333] bg-[#1A1A1A] p-12 relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Industrial Corners */}
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#C41E3A]"></div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#C41E3A]"></div>

                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            className="w-24 h-24 bg-[#C41E3A] rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(196,30,58,0.4)]"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            <Construction className="w-12 h-12 text-white" />
                        </motion.div>

                        <h1 className="text-8xl font-black text-white mb-4 tracking-tighter">
                            404
                        </h1>
                        <div className="h-1 w-24 bg-[#C41E3A] mb-8"></div>

                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-4">
                            Sector Unavailable
                        </h2>

                        <p className="text-[#888] text-lg mb-10 max-w-md font-sans leading-relaxed">
                            The coordinates you provided do not match any existing industrial assets in our database. It may have been decommissioned or moved.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <Link
                                to="/"
                                className="px-8 py-4 bg-[#C41E3A] text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-[#C41E3A] transition-all flex items-center justify-center gap-3 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Return to Base
                            </Link>
                            <Link
                                to="/products"
                                className="px-8 py-4 border border-[#333] text-[#AAA] font-bold uppercase tracking-[0.2em] text-sm hover:border-[#C41E3A] hover:text-white transition-all flex items-center justify-center gap-3"
                            >
                                <Hammer className="w-4 h-4" />
                                Browse Gear
                            </Link>
                        </div>
                    </div>

                    {/* Technical Decals */}
                    <div className="absolute top-6 right-6 flex flex-col items-end opacity-20">
                        <span className="text-[10px] text-white font-mono">ERR_CODE: 0x404_VOID</span>
                        <div className="flex gap-1 mt-1">
                            <div className="w-1 h-1 bg-[#C41E3A]"></div>
                            <div className="w-4 h-1 bg-[#333]"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Warning Tape Aesthetic */}
                <div className="mt-8 h-8 bg-[repeating-linear-gradient(45deg,#121212,#121212_15px,#1A1A1A_15px,#1A1A1A_30px)] border-y border-[#333] flex items-center justify-center">
                    <span className="text-[10px] text-[#444] font-black uppercase tracking-[1em]">SYSTEM_ERROR_RESTRICTED_ACCESS</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
