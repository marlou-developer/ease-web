import React, { useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
    FaReact,
    FaLaravel,
    FaAws,
    FaGithub,
    FaLinkedin,
    FaEnvelope,
    FaExternalLinkAlt,
    FaCode,
    FaUser,
    FaGraduationCap,
    FaPaperPlane,
    FaTerminal,
    FaTimes,
    FaCameraRetro,
    FaFacebook,
} from "react-icons/fa";
import {
    SiTailwindcss,
    SiFlutter,
    SiPostman,
    SiStripe,
    SiInertia,
} from "react-icons/si";

const Portfolio = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const [activeTab, setActiveTab] = useState("all");
    const [formStatus, setFormStatus] = useState("idle");

    const [selectedImg, setSelectedImg] = useState(null);

    const projects = [
        {
            name: "CURTIS CRM",
            url: "https://curtis-css.com",
            cat: "crm",
            tags: ["Laravel", "AWS"],
            desc: "Enterprise-grade customer relationship management system.",
        },
        {
            name: "Unified System",
            url: "https://eo-unified-ims.com",
            cat: "ims",
            tags: ["React", "Inertia"],
            desc: "Inventory management with real-time syncing.",
        },
        {
            name: "Empire One Finance",
            url: "https://empireone-finance.com",
            cat: "finance",
            tags: ["Stripe", "Laravel"],
            desc: "Secure financial transaction and reporting portal.",
        },
        {
            name: "Empire One HRIS",
            url: "https://empireone-hris.com",
            cat: "hris",
            tags: ["React", "AWS"],
            desc: "Human resource information system for large teams.",
        },
    ];

    const techStack = [
        { Icon: FaReact, color: "text-cyan-400", name: "React" },
        { Icon: FaLaravel, color: "text-red-500", name: "Laravel" },
        { Icon: SiTailwindcss, color: "text-sky-400", name: "Tailwind" },
        { Icon: FaAws, color: "text-orange-400", name: "AWS" },
        { Icon: SiFlutter, color: "text-blue-400", name: "Flutter" },
        { Icon: SiStripe, color: "text-indigo-500", name: "Stripe" },
        { Icon: SiPostman, color: "text-orange-500", name: "Postman" },
        { Icon: SiInertia, color: "text-purple-500", name: "Inertia" },
    ];

    const navLinks = ["About", "Experience", "Projects", "Gallery", "Contact"];

    const personalPhotos = [
        {
            id: 1,
            src: "https://picsum.photos/id/1/367/267",
            title: "At the Office",
            size: "row-span-2",
        },
        {
            id: 2,
            src: "https://picsum.photos/id/1/367/267",
            title: "Tech Conference",
            size: "col-span-1",
        },
        {
            id: 3,
            src: "https://picsum.photos/536/354",
            title: "Speaking Event",
            size: "col-span-1",
        },
        {
            id: 4,
            src: "https://picsum.photos/id/1/367/267",
            title: "Coding Session",
            size: "row-span-2",
        },
        {
            id: 5,
            src: "https://picsum.photos/id/1/367/267",
            title: "Workshop",
            size: "col-span-1",
        },
        {
            id: 6,
            src: "https://picsum.photos/id/1/367/267",
            title: "Team Outing",
            size: "col-span-1",
        },
    ];
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus("loading");
        setTimeout(() => setFormStatus("success"), 2000);
    };

    return (
        <div className="bg-[#0b0f14] text-gray-300 min-h-screen selection:bg-cyan-500/30 scroll-smooth">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* Navbar / Logo */}
            <nav className="fixed top-0 w-full z-40 bg-[#0b0f14]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 group cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <FaTerminal className="text-black text-xl" />
                        </div>
                        <span className="text-white font-bold tracking-tighter text-xl">
                            MARLOU.DEV
                        </span>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                className="text-sm font-mono hover:text-cyan-400 transition-colors uppercase tracking-widest"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="h-screen flex items-center justify-center relative px-6 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
                </div>

                <div className="z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl md:text-9xl font-bold text-white tracking-tighter mb-4"
                    >
                        MARLOU <span className="text-cyan-500">PEPITO </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        Architecting high-performance{" "}
                        <span className="text-white">Web & Mobile</span>{" "}
                        solutions with 7 years of engineering excellence.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-10 flex flex-wrap gap-4 justify-center"
                    >
                        <button className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-full hover:scale-105 transition-transform">
                            View Resume
                        </button>
                        <a
                            href="#contact"
                            className="px-8 py-4 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
                        >
                            Get in touch
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Development Stacks Marquee */}
            <div className="py-10 border-y border-white/5 bg-black/20 overflow-hidden flex">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear",
                    }}
                    className="flex gap-20 items-center whitespace-nowrap px-10"
                >
                    {[...techStack, ...techStack].map((tech, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <tech.Icon
                                className={`text-4xl ${tech.color} opacity-50 group-hover:opacity-100 transition-opacity`}
                            />
                            <span className="text-2xl font-bold text-white/20 group-hover:text-white/80 transition-colors uppercase tracking-widest">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* About Me Section */}
            <section id="about" className="max-w-6xl mx-auto py-32 px-6">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <motion.div
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: -50 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
                            <FaUser className="text-cyan-400" /> 01. About Me
                        </h2>
                        <div className="space-y-6 text-lg text-gray-400">
                            <p>
                                I am a Software Engineer based in the
                                Philippines, specializing in building scalable
                                digital products from the ground up.
                            </p>
                            <p>
                                My expertise lies in the{" "}
                                <span className="text-white">
                                    Laravel & React ecosystem
                                </span>
                                , where I bridge the gap between complex backend
                                logic and seamless frontend experiences.
                            </p>
                            <div className="flex items-center gap-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                                <FaGraduationCap className="text-3xl text-cyan-400" />
                                <span className="text-sm">
                                    B.S. Information Technology - CPSU (2020)
                                </span>
                            </div>
                        </div>
                    </motion.div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-cyan-500/20 rounded-2xl blur-xl group-hover:bg-cyan-500/30 transition-all" />
                        <div className="relative aspect-square bg-[#161b22] rounded-2xl border border-white/10 flex items-center justify-center">
                            <FaReact className="text-[200px] text-cyan-400/10 animate-pulse" />
                            <img src="/images/pp.jpeg" className="w-full"/>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="bg-[#0d1117] py-32">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-white mb-16 text-center">
                        Work Experience
                    </h2>
                    <div className="space-y-12">
                        {[
                            {
                                company: "EmpireOne BPO Solutions",
                                role: "Senior Web Developer",
                                date: "2022 - Present",
                                desc: "Leading development for internal CRM and HRIS systems using React and AWS.",
                            },
                            {
                                company: "Koda Kollectiv",
                                role: "Software Engineer",
                                date: "2 Years Experience",
                                desc: "Full-stack development specializing in Laravel, Flutter, and payment integrations.",
                            },
                        ].map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative pl-8 border-l-2 border-cyan-500/30 hover:border-cyan-500 transition-colors"
                            >
                                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#0b0f14] border-2 border-cyan-500 rounded-full" />
                                <span className="text-cyan-400 font-mono text-sm">
                                    {job.date}
                                </span>
                                <h3 className="text-2xl font-bold text-white mt-2">
                                    {job.role}
                                </h3>
                                <p className="text-lg text-gray-400 mt-2">
                                    {job.company}
                                </p>
                                <p className="mt-4 text-gray-500 leading-relaxed">
                                    {job.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section
                id="projects"
                className="py-32 max-w-7xl mx-auto px-6 text-center"
            >
                <h2 className="text-4xl font-bold text-white mb-16">
                    Selected Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="text-left bg-[#161b22] border border-white/5 rounded-3xl overflow-hidden p-8 group transition-all hover:border-cyan-500/50"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400">
                                    <FaCode className="text-2xl" />
                                </div>
                                <a
                                    href={project.url}
                                    target="_blank"
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <FaExternalLinkAlt className="text-xl" />
                                </a>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {project.name}
                            </h3>
                            <p className="text-gray-400 mb-6">{project.desc}</p>
                            <div className="flex gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <div 
            
                    id="gallery"
            className="bg-[#0b0f14] text-gray-300 min-h-screen selection:bg-cyan-500/30 scroll-smooth py-32">
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-[100]"
                    style={{ scaleX }}
                />

                {/* Professional Gallery */}
                <section
                    className="max-w-7xl mx-auto px-6 relative z-10"
                >
                    <div className="mb-16 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-4">
                            <FaCameraRetro className="text-cyan-500" /> Life &
                            Work
                        </h2>
                        <p className="text-gray-500 mt-2 font-mono tracking-widest">
                            GALLERY VIEW
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                        {personalPhotos.map((photo, i) => (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                onClick={() => setSelectedImg(photo.src)}
                                className={`${photo.size} relative overflow-hidden rounded-3xl cursor-pointer group border border-white/5 bg-[#161b22]`}
                            >
                                <img
                                    src={photo.src}
                                    alt={photo.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-8">
                                    <div>
                                        <p className="text-cyan-400 font-mono text-xs mb-1">
                                            IMAGE_{photo.id}
                                        </p>
                                        <p className="text-white font-bold text-xl tracking-wider">
                                            {photo.title}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Interactive Contact Form */}
                <section
                    id="contact"
                    className="py-32 bg-[#0d1117] relative z-10"
                >
                    <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-5xl font-bold text-white mb-6">
                                Let's{" "}
                                <span className="text-cyan-500">Connect</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Have a project in mind or just want to say hi?
                                My inbox is always open.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <FaEnvelope className="text-2xl text-cyan-500" />
                                    <span className="font-mono">
                                        marlou.developer@gmail.com
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <motion.a
                                        whileHover={{ y: -5 }}
                                        href="#"
                                        className="p-4 bg-white/5 rounded-2xl text-2xl hover:text-cyan-400 transition-colors"
                                    >
                                        <FaGithub />
                                    </motion.a>
                                    <motion.a
                                        whileHover={{ y: -5 }}
                                        href="#"
                                        className="p-4 bg-white/5 rounded-2xl text-2xl hover:text-cyan-400 transition-colors"
                                    >
                                        <FaLinkedin />
                                    </motion.a>
                                      <motion.a
                                        whileHover={{ y: -5 }}
                                        href="#"
                                        className="p-4 bg-white/5 rounded-2xl text-2xl hover:text-cyan-400 transition-colors"
                                    >
                                        <FaFacebook />
                                    </motion.a>
                                </div>
                            </div>
                        </div>

                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-[#161b22] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4"
                        >
                            <input
                                required
                                type="text"
                                placeholder="Your Name"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors"
                            />
                            <input
                                required
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors"
                            />
                            <textarea
                                required
                                rows="4"
                                placeholder="How can I help you?"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors resize-none"
                            ></textarea>

                            <button
                                disabled={formStatus === "loading"}
                                className="w-full py-4 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
                            >
                                {formStatus === "idle" && (
                                    <>
                                        <FaPaperPlane /> Send Message
                                    </>
                                )}
                                {formStatus === "loading" && (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                )}
                                {formStatus === "success" && "Message Sent!"}
                            </button>
                        </motion.form>
                    </div>
                </section>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImg && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImg(null)}
                            className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
                        >
                            <button className="absolute top-10 right-10 text-white text-3xl">
                                <FaTimes />
                            </button>
                            <motion.img
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                src={selectedImg}
                                className="max-w-full max-h-[85vh] rounded-xl shadow-2xl border border-white/10"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <footer className="py-12 border-t border-white/5 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
                    Designed & Engineered by Marlou F. Pepito © 2026
                </footer>
            </div>
        </div>
    );
};

export default Portfolio;
