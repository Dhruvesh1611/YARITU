import React from "react";

const ContactButton = ({ email }) => {
  return <button onClick={() => window.location.href = `mailto:${email}`}>Contact Candidate</button>;
};

export default ContactButton;
