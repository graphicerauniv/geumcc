import Link from "next/link";
import Image from "next/image";
import graphicEraLogoSVG from "@/assets/graphic-era-logo.svg";

export function Footer() {
	return (
		<footer className="border-t border-primary/20 bg-background">
			<div className="container py-8 md:py-12 mx-auto px-4 md:px-6">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					<div className="flex flex-col gap-2">
						<Link href="/" className="flex items-center gap-2">
							<Image
								src={graphicEraLogoSVG}
								alt="GECET Logo"
								width={30}
								height={30}
								className="text-primary"
							/>
							<span className="font-bold text-gradient">GECET</span>
						</Link>
						<p className="text-sm text-muted-foreground">
							Graphic Era Common Entrance Test Portal
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="font-medium text-secondary">Quick Links</h3>
						<nav className="flex flex-col gap-2">
							<Link
								href="/"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								Home
							</Link>
							<Link
								href="/auth/login"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								Login
							</Link>
							<Link
								href="/auth/register"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								Register
							</Link>
						</nav>
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="font-medium text-secondary">Resources</h3>
						<nav className="flex flex-col gap-2">
							<Link
								href="#"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								Exam Pattern
							</Link>
							<Link
								href="#"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								Syllabus
							</Link>
							<Link
								href="#"
								className="text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								FAQs
							</Link>
						</nav>
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="font-medium text-secondary">Contact</h3>
						<address className="not-italic text-sm text-muted-foreground">
							Graphic Era University
							<br />
							566/6, Bell Road, Clement Town
							<br />
							Dehradun, Uttarakhand - 248002
						</address>
						<p className="text-sm text-muted-foreground">
							<a
								href="mailto:gecet@geu.ac.in"
								className="hover:text-primary transition-colors"
							>
								gecet@geu.ac.in
							</a>
						</p>
					</div>
				</div>

				<div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-8 md:flex-row">
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Graphic Era University. All rights
						reserved.
					</p>
					<div className="flex gap-4">
						<Link
							href="#"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="#"
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
