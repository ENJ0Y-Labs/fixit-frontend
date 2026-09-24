function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div>
                    <div className="logo">
                        <div className="logo-icon">F</div>
                        <div className="logo-text">FixIt</div>
                    </div>
                    <p>Connecting trusted local service providers with customers across Nigeria since 2026.</p>
                </div>
                <FooterColumn title="Company" items={["About Us", "Career", "Trust & Safety", "Terms of Service"]} />
                <FooterColumn title="Services" items={["Plumbing", "Electrical", "Cleaning", "Painting"]} />
                <FooterColumn title="Support" items={["Help Center", "Contact Us", "Privacy Policy"]} />
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 FixIt Technologies LTD.</p>
                <div>
                    <a href="#twitter">Twitter</a>
                    <a href="#instagram">Instagram</a>
                    <a href="#linkedin">LinkedIn</a>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, items }) {
    return (
        <div>
            <h2>{title}</h2>
            {items.map((item) => <p key={item}>{item}</p>)}
        </div>
    );
}

export default Footer;
