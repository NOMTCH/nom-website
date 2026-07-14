import React from 'react';

export const metadata = {
  title: 'Privacy Policy | NOMSTD',
  description: 'Privacy Policy for nomstd.my.id',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-a:text-accent">
          <p className="text-muted">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to NOMSTD ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul>
            <li>Names</li>
            <li>Email Addresses</li>
            <li>Phone Numbers</li>
            <li>Job Titles</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>

          <h2>4. Cookies and Web Beacons</h2>
          <p>
            Like any other website, NOMSTD uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>
          <p>
            <strong>Google DoubleClick DART Cookie:</strong> Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
          </p>

          <h2>5. Third-Party Privacy Policies</h2>
          <p>
            NOMSTD's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>

          <h2>6. Children's Information</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. NOMSTD does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>

          <h2>7. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </div>
      </div>
    </div>
  );
}
