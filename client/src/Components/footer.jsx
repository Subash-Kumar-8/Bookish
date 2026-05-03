import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="text-bg-dark px-3 py-3 text-center">
      <div>© {year} Bookish. All rights reserved.</div>
      <div className="small">
        This product uses the Google Books API. Data provided by Google Books.
      </div>
      <div className="small">
        As an Amazon Associate, I earn from qualifying purchases.
      </div>
    </footer>
  );
};

export default Footer;