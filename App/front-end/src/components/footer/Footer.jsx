import React from 'react';
import '../../style/footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container container">
                <div className="footer-logo">
                    <h3>StudyBuddy</h3>
                    <p>Your learning companion, always ready to help.</p>
                </div>

                <div className="footer-links">
                    <h4>Explore</h4>
                    <a href="#features">Features</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                    <a href="#terms">Terms</a>
                </div>

                <div className="footer-social">
                    <h4>Follow Us</h4>
                    <a href="#" aria-label="Twitter">🐦 Twitter</a>
                    <a href="#" aria-label="Instagram">📸 Instagram</a>
                    <a href="#" aria-label="Facebook">📘 LinkedIn</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Dayana Uzunova. All rights reserved.</p>
            </div>
        </footer>
    );
}
