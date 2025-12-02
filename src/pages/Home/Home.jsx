import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">

            <div className="banner">
                <img 
                    src="" 
                    alt="Banner"
                    className="banner-img"
                />
            </div>

            <section className="section">
                <div className="section-content">
                    <img 
                        src="" 
                        alt="About Us"
                        className="section-img"
                    />
                    <div>
                        <h2>About Us</h2>
                        <p>
                            We are a dedicated organization focused on delivering excellence
                            and creating value for our clients and community.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section alt">
                <div className="section-content">
                    <div>
                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to innovate and create meaningful solutions that
                            positively impact society and push boundaries.
                        </p>
                    </div>
                    <img 
                        src="" 
                        alt="Mission"
                        className="section-img"
                    />
                </div>
            </section>

            <section className="section">
                <div className="section-content">
                    <img 
                        src="" 
                        alt="Vision"
                        className="section-img"
                    />
                    <div>
                        <h2>Our Vision</h2>
                        <p>
                            Our vision is to be a global leader known for innovation, integrity,
                            and our commitment to making a difference.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                © {new Date().getFullYear()} Market Pulse Tracker. All rights reserved.
            </footer>

        </div>
    );
};

export default Home;
